
import React, { useState } from 'react';
import { Copy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReviewData {
  emoji: string;
  emojiLabel: string;
  preferences: string[];
  customText: string;
}

const ReviewGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reviewData, setReviewData] = useState<ReviewData>({
    emoji: '',
    emojiLabel: '',
    preferences: [],
    customText: ''
  });
  const [generatedReview, setGeneratedReview] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const emojis = [
    { emoji: '😊', label: 'Great' },
    { emoji: '😍', label: 'Loved it!' },
    { emoji: '🤩', label: 'Amazing' },
    { emoji: '👍', label: 'Very Good' },
    { emoji: '🧠', label: 'Insightful' }
  ];

  const preferenceOptions = [
    'Customer Service',
    'Speed of Delivery',
    'Ease of Use',
    'Results I Got',
    'Professionalism',
    'Innovation'
  ];

  const handleEmojiSelect = (emoji: string, label: string) => {
    setReviewData(prev => ({ ...prev, emoji, emojiLabel: label }));
    setTimeout(() => setCurrentStep(2), 300);
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

  const generateReview = () => {
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
    setCurrentStep(3);
  };

  const handleCopyAndRedirect = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      
      setTimeout(() => {
        window.open('https://g.page/r/trueaim-ai/review', '_blank');
      }, 1000);
      
      setTimeout(() => setIsCopied(false), 3000);
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
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Step 1: Emoji Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                How was your experience with
              </h1>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                TrueAim AI?
              </div>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {emojis.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji, label)}
                  className="group flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
                  aria-label={`Select ${label}`}
                >
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {emoji}
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Preference Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{reviewData.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Awesome!</h2>
              <p className="text-xl text-gray-600">What did you like most?</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {preferenceOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePreferenceToggle(option)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200 ${
                      reviewData.preferences.includes(option)
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
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
                  className="text-center border-2 border-gray-200 focus:border-purple-400 rounded-xl py-3 text-lg"
                />
              </div>
              
              <div className="text-center pt-4">
                <Button
                  onClick={generateReview}
                  disabled={!canProceed}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    canProceed
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Generate Review
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generated Review */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{reviewData.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Review is Ready!</h2>
              <p className="text-gray-600">Here's what we generated for you:</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
              <p className="text-lg text-gray-800 leading-relaxed text-center">
                "{generatedReview}"
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                You're almost done! Just click below to leave your review on Google.
              </p>
              
              <Button
                onClick={handleCopyAndRedirect}
                className="px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
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
                    📋 Copy & Leave Review
                  </>
                )}
              </Button>
              
              {isCopied && (
                <div className="text-green-600 text-sm animate-fade-in">
                  ✅ Review copied to clipboard! Opening Google Reviews...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewGenerator;
