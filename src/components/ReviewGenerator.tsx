
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 min-h-[600px] flex flex-col">
          
          {/* Emoji Selection Step */}
          {currentStep === 'emoji' && (
            <div className="text-center flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex justify-center mb-8">
                  <img 
                    src="/lovable-uploads/f963d4bd-aaca-412f-aad0-ad4b4119a63c.png" 
                    alt="TrueAim AI Logo" 
                    className="h-32 w-32 object-contain drop-shadow-2xl"
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  How was your experience with
                </h1>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  TrueAim AI?
                </div>
              </div>
              
              <div className="flex justify-center gap-4 flex-wrap">
                {emojis.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji, label)}
                    className="group flex flex-col items-center p-6 rounded-2xl border-2 border-gray-600/50 bg-gray-700/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/70 hover:bg-blue-500/10 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    aria-label={`Select ${label}`}
                  >
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {emoji}
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300">
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
              <h2 className="text-2xl font-bold text-white mb-4">
                We're sorry you didn't have a good experience
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                We appreciate your feedback and will work to improve.
              </p>
              
              <div className="bg-green-900/30 border-2 border-green-600/50 rounded-2xl p-6 max-w-md mx-auto backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-semibold">Feedback Submitted</span>
                </div>
                <p className="text-green-300 mt-2">Thank you for taking the time to share your experience with us.</p>
              </div>
            </div>
          )}

          {/* Preference Selection Step */}
          {currentStep === 'preferences' && (
            <div className="text-center flex-1 flex flex-col justify-center animate-fade-in">
              <div className="mb-6">
                <div className="text-4xl mb-2">{selectedEmoji}</div>
                <h2 className="text-2xl font-bold text-white mb-2">Awesome!</h2>
                <p className="text-lg text-gray-300">What did you like most?</p>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-3 justify-center">
                  {preferenceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePreferenceToggle(option)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                        reviewData.preferences.includes(option)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 border border-blue-400/50'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-blue-600/20 hover:text-blue-300 border border-gray-600/50'
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
                    className="text-center border-2 border-gray-600/50 bg-gray-700/30 text-white placeholder-gray-400 focus:border-blue-500/70 focus:bg-gray-700/50 rounded-xl py-3 text-lg backdrop-blur-sm"
                  />
                </div>
                
                {/* Real-time generated review display */}
                {generatedReview && (
                  <div className="max-w-lg mx-auto mt-6">
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border-2 border-blue-500/30 backdrop-blur-sm">
                      <p className="text-lg text-gray-200 leading-relaxed text-center mb-4">
                        "{generatedReview}"
                      </p>
                      <Button
                        onClick={handleCopyAndSubmit}
                        className="w-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-blue-500/30"
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
                <h2 className="text-3xl font-bold text-white mb-4">Almost there!</h2>
                <p className="text-xl text-gray-300 mb-8">
                  When you get to Google, just paste and you're ready to go!
                </p>
              </div>
              
              <div className="max-w-md mx-auto w-full">
                <div className="bg-gray-700/50 rounded-full h-4 mb-4 overflow-hidden border border-gray-600/50">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-100 ease-out shadow-lg"
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
