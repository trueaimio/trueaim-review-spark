
import React, { useState, useEffect } from 'react';
import { Copy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import confetti from 'canvas-confetti';

interface ReviewData {
  emoji: string;
  emojiLabel: string;
  preferences: string[];
  customText: string;
}

const ReviewGenerator = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [reviewData, setReviewData] = useState<ReviewData>({
    emoji: '',
    emojiLabel: '',
    preferences: [],
    customText: ''
  });
  const [generatedReview, setGeneratedReview] = useState('');
  const [currentStep, setCurrentStep] = useState<'emoji' | 'preferences' | 'review' | 'negative' | 'loading'>('emoji');
  const [isCopied, setIsCopied] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use the provided API key directly
  const apiKey = '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';

  const emojis = [
    { emoji: '😃', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Ok' },
    { emoji: '☹️', label: 'Bad' }
  ];

  const preferenceOptions = [
    'Customer Support',
    'Ease of Set Up',
    'Improved Ad ROI',
    'Precision Targeting',
    'Better Lead Quality',
    'Everything'
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 25,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleEmojiSelect = (emoji: string, label: string) => {
    setSelectedEmoji(emoji);
    setReviewData(prev => ({ ...prev, emoji, emojiLabel: label }));
    
    if (label === 'Excellent' || label === 'Good') {
      triggerConfetti();
      setCurrentStep('preferences');
    } else {
      setCurrentStep('negative');
    }
    
    setGeneratedReview('');
  };

  const handlePreferenceToggle = (preference: string) => {
    setReviewData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleCustomTextChange = (text: string) => {
    setReviewData(prev => ({ ...prev, customText: text }));
  };

  const generateReviewWithChatGPT = async () => {
    setIsGenerating(true);
    
    try {
      const selectedPreferences = reviewData.preferences.length > 0 
        ? reviewData.preferences.join(', ') 
        : reviewData.customText;

      const prompt = `You are writing a genuine Google review for TrueAim AI, a cutting-edge ad targeting platform. TrueAim AI provides access to 250+ million consumer profiles with 100+ billion real-time buying signals, helping businesses target Facebook ads to people who are actively looking for their services within the past week.

Write a ${reviewData.emojiLabel.toLowerCase()} review focusing on: ${selectedPreferences}

The review should:
- Sound like it's from a real business owner or marketer who actually used the service
- Include specific, believable results or improvements (use realistic numbers/percentages)
- Mention how it helped with Facebook ad targeting specifically
- Be conversational and authentic, not overly promotional
- Include natural language patterns and personal touches
- Be 2-4 sentences long
- Avoid generic marketing language

Examples of good authentic touches:
- "Finally found a solution that actually works"
- "Within the first week I noticed..."
- "As someone who's tried everything..."
- "The difference was night and day"
- "Honestly didn't expect much but..."

Write ONLY the review text, no quotes or formatting.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at writing authentic, natural-sounding customer reviews that feel genuine and specific.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const review = data.choices[0]?.message?.content?.trim() || '';
      
      setGeneratedReview(review);
    } catch (error) {
      console.error('Error generating review:', error);
      alert('Failed to generate review. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = reviewData.preferences.length > 0 || reviewData.customText.trim().length > 0;

  // Generate review when preferences change
  useEffect(() => {
    if (currentStep === 'preferences' && canProceed) {
      generateReviewWithChatGPT();
    }
  }, [reviewData.preferences, reviewData.customText, currentStep]);

  const handleCopyAndSubmit = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      setCurrentStep('loading');
      setLoadingProgress(0);
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              window.open('https://g.page/r/CYJQ22pZhgZwEBM/review', '_blank');
            }, 200);
            return 100;
          }
          return prev + 10;
        });
      }, 400);
      
    } catch (error) {
      console.error('Failed to copy text:', error);
      const textArea = document.createElement('textarea');
      textArea.value = generatedReview;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setCurrentStep('loading');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
          
          {/* Emoji Selection Step */}
          {currentStep === 'emoji' && (
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  How was your experience with
                </h1>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  TrueAim AI?
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {emojis.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji, label)}
                    className="flex flex-col items-center p-8 rounded-xl border-2 border-gray-600 bg-gray-700/30 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:bg-blue-500/10"
                  >
                    <div className="text-5xl mb-3">{emoji}</div>
                    <span className="text-lg font-medium text-gray-300">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Negative Feedback Step */}
          {currentStep === 'negative' && (
            <div className="text-center space-y-6">
              <div className="text-5xl mb-4">{selectedEmoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                We're sorry you didn't have a good experience
              </h2>
              <p className="text-gray-300 mb-6">
                We appreciate your feedback and will work to improve.
              </p>
              
              <div className="bg-green-900/30 border-2 border-green-600/50 rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Feedback Submitted</span>
                </div>
                <p className="text-green-300 mt-2 text-sm">Thank you for taking the time to share your experience with us.</p>
              </div>
            </div>
          )}

          {/* Preference Selection Step */}
          {currentStep === 'preferences' && (
            <div className="text-center space-y-6">
              <div>
                <div className="text-5xl mb-4">{selectedEmoji}</div>
                <h2 className="text-2xl font-bold text-white mb-2">Awesome!</h2>
                <p className="text-gray-300">What impressed you most about TrueAim AI?</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {preferenceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePreferenceToggle(option)}
                      className={`p-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        reviewData.preferences.includes(option)
                          ? 'bg-blue-600 text-white border-2 border-blue-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div>
                  <Input
                    placeholder="Or describe your own experience..."
                    value={reviewData.customText}
                    onChange={(e) => handleCustomTextChange(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Generated review display */}
                {(generatedReview || isGenerating) && (
                  <div className="mt-6">
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                      {isGenerating ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                          <p className="text-gray-300">Generating your unique review...</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-200 leading-relaxed mb-4 text-left">
                            "{generatedReview}"
                          </p>
                          <Button
                            onClick={handleCopyAndSubmit}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={isCopied}
                          >
                            {isCopied ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Copied! Redirecting...
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy & Submit Review
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading Step */}
          {currentStep === 'loading' && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Almost there!</h2>
                <p className="text-gray-300 mb-8">
                  When you get to Google, just paste and you're ready to go!
                </p>
              </div>
              
              <div className="max-w-sm mx-auto w-full">
                <div className="bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-100"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-green-400 font-semibold">
                  {loadingProgress < 100 ? `Loading... ${Math.round(loadingProgress)}%` : 'Ready! Opening Google Reviews...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewGenerator;
