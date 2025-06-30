
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

  const emojis = [
    { emoji: '😃', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Ok' },
    { emoji: '☹️', label: 'Bad' }
  ];

  const preferenceOptions = [
    'Customer Service',
    'Speed of Delivery',
    'Ease of Use',
    'Results I Got',
    'Professionalism',
    'Innovation'
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleEmojiSelect = (emoji: string, label: string) => {
    setSelectedEmoji(emoji);
    setReviewData(prev => ({ ...prev, emoji, emojiLabel: label }));
    
    // Trigger confetti for positive ratings
    if (label === 'Excellent' || label === 'Good') {
      triggerConfetti();
      setCurrentStep('preferences');
    } else {
      // Show negative feedback for Ok and Bad ratings
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

  const canProceed = reviewData.preferences.length > 0 || reviewData.customText.trim().length > 0;

  // Generate review in real time when preferences or custom text changes
  useEffect(() => {
    if (currentStep === 'preferences' && canProceed) {
      const templates = [
        `I had a ${reviewData.emojiLabel.toLowerCase()} experience with TrueAim AI! Their {feature} really stood out and made everything so much easier. Highly recommend!`,
        `${reviewData.emojiLabel} working with TrueAim AI! I especially appreciated their {feature}. I'll definitely be coming back.`,
        `TrueAim AI exceeded my expectations! Their {feature} was impressive and delivered real value. 5 stars!`,
        `Outstanding experience with TrueAim AI. The {feature} made all the difference in achieving my goals. Highly recommend their services!`
      ];

      let selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      if (reviewData.customText.trim()) {
        selectedTemplate = selectedTemplate.replace('{feature}', reviewData.customText.trim());
      } else if (reviewData.preferences.length > 0) {
        const randomPreference = reviewData.preferences[Math.floor(Math.random() * reviewData.preferences.length)];
        selectedTemplate = selectedTemplate.replace('{feature}', randomPreference.toLowerCase());
      }

      setGeneratedReview(selectedTemplate);
    }
  }, [reviewData.preferences, reviewData.customText, reviewData.emojiLabel, currentStep, canProceed]);

  const handleCopyAndSubmit = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      setCurrentStep('loading');
      setLoadingProgress(0);
      
      // Animate loading bar over 5 seconds
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              window.open('https://g.page/r/trueaim-ai/review', '_blank');
            }, 500);
            return 100;
          }
          return prev + 2; // 50 steps over 5 seconds
        });
      }, 100);
      
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[600px] flex flex-col">
          
          {/* Emoji Selection Step */}
          {currentStep === 'emoji' && (
            <div className="text-center flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/lovable-uploads/f963d4bd-aaca-412f-aad0-ad4b4119a63c.png" 
                    alt="TrueAim AI Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  How was your experience with
                </h1>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
                  TrueAim AI?
                </div>
              </div>
              
              <div className="flex justify-center gap-4 flex-wrap">
                {emojis.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji, label)}
                    className="group flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:scale-105 hover:border-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-400"
                    aria-label={`Select ${label}`}
                  >
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {emoji}
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-purple-800">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Negative Feedback Step */}
          {currentStep === 'negative' && (
            <div className="text-center flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-4xl mb-4">{selectedEmoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                We're sorry you didn't have a good experience
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We appreciate your feedback and will work to improve.
              </p>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-semibold">Feedback Submitted</span>
                </div>
                <p className="text-green-600 mt-2">Thank you for taking the time to share your experience with us.</p>
              </div>
            </div>
          )}

          {/* Preference Selection Step */}
          {currentStep === 'preferences' && (
            <div className="text-center flex-1 flex flex-col justify-center animate-fade-in">
              <div className="mb-6">
                <div className="text-4xl mb-2">{selectedEmoji}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Awesome!</h2>
                <p className="text-lg text-gray-600">What did you like most?</p>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-3 justify-center">
                  {preferenceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePreferenceToggle(option)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 ${
                        reviewData.preferences.includes(option)
                          ? 'bg-purple-800 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="max-w-md mx-auto">
                  <Input
                    placeholder="Or write your own..."
                    value={reviewData.customText}
                    onChange={(e) => handleCustomTextChange(e.target.value)}
                    className="text-center border-2 border-gray-200 focus:border-purple-600 rounded-xl py-3 text-lg"
                  />
                </div>
                
                {/* Real-time generated review display */}
                {generatedReview && (
                  <div className="max-w-lg mx-auto mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-400">
                      <p className="text-lg text-gray-800 leading-relaxed text-center mb-4">
                        "{generatedReview}"
                      </p>
                      <Button
                        onClick={handleCopyAndSubmit}
                        className="w-full px-8 py-4 text-lg font-semibold bg-purple-800 hover:bg-purple-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        disabled={isCopied}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Copied! Redirecting...
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            Copy & Submit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading Step */}
          {currentStep === 'loading' && (
            <div className="text-center flex-1 flex flex-col justify-center animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Almost there!</h2>
                <p className="text-xl text-gray-600 mb-8">
                  When you get to Google, just paste and you're ready to go!
                </p>
              </div>
              
              <div className="max-w-md mx-auto w-full">
                <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-green-600 font-semibold">
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
