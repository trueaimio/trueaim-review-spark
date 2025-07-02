
import React, { useState, useEffect } from 'react';
import { Copy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

interface ReviewData {
  emoji: string;
  emojiLabel: string;
  preferences: string[];
}

const ReviewGenerator = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [reviewData, setReviewData] = useState<ReviewData>({
    emoji: '',
    emojiLabel: '',
    preferences: []
  });
  const [generatedReview, setGeneratedReview] = useState('');
  const [currentStep, setCurrentStep] = useState<'emoji' | 'preferences' | 'review' | 'negative' | 'loading'>('emoji');
  const [isCopied, setIsCopied] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Use the provided API key directly
  const apiKey = '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';

  const emojis = [
    { emoji: '😃', label: 'Excellent' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Ok' },
    { emoji: '☹️', label: 'Bad' }
  ];

  // Reordered with Ease of Set Up first, then Improved Ad ROI
  const preferenceOptions = [
    'Ease of Set Up',
    'Improved Ad ROI',
    'Customer Support',
    'Precision Targeting',
    'Better Lead Quality',
    'Everything'
  ];

  // Add diverse talking points for each preference
  const diverseContexts = {
    'Ease of Set Up': [
      'quick installation process',
      'straightforward onboarding',
      'seamless integration with existing systems',
      'user-friendly setup wizard',
      'minimal technical requirements',
      'plug-and-play functionality'
    ],
    'Improved Ad ROI': [
      'better return on advertising spend',
      'more efficient budget allocation',
      'improved cost per acquisition',
      'better qualified traffic',
      'higher conversion rates',
      'reduced wasted ad spend'
    ],
    'Customer Support': [
      'responsive help desk',
      'knowledgeable support team',
      'quick resolution times',
      'helpful documentation',
      'proactive assistance',
      'accessible customer service'
    ],
    'Precision Targeting': [
      'accurate audience identification',
      'detailed demographic filtering',
      'behavioral targeting capabilities',
      'lookalike audience creation',
      'geographic precision',
      'interest-based targeting'
    ],
    'Better Lead Quality': [
      'higher intent prospects',
      'more qualified inquiries',
      'better conversion potential',
      'relevant customer matches',
      'reduced bounce rates',
      'improved lead scoring'
    ],
    'Everything': [
      'comprehensive solution',
      'all-in-one platform',
      'complete advertising toolkit',
      'end-to-end functionality',
      'holistic approach',
      'integrated features'
    ]
  };

  // Add business types and contexts for more variety
  const businessContexts = [
    'small business owner',
    'marketing manager',
    'agency professional',
    'e-commerce store owner',
    'local business operator',
    'digital marketer',
    'startup founder',
    'sales director'
  ];

  const timeframes = [
    'after a few weeks',
    'within the first month',
    'after trying it out',
    'over the past couple months',
    'since we started using it',
    'after implementing it'
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

  const generateReviewWithChatGPT = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress during API call
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
    }, 150);
    
    try {
      const selectedPreferences = reviewData.preferences.join(', ');
      
      // Generate random contexts for variety
      const randomBusinessContext = businessContexts[Math.floor(Math.random() * businessContexts.length)];
      const randomTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
      
      // Get diverse talking points for selected preferences
      const diversePoints = reviewData.preferences.flatMap(pref => {
        const contexts = diverseContexts[pref] || [];
        // Pick 1-2 random contexts for each preference
        const shuffled = [...contexts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
      });
      
      const randomPoints = diversePoints.slice(0, 3); // Limit to 3 points max

      // Create a unique prompt that includes the specific combination of preferences
      const combinationKey = reviewData.preferences.sort().join('|');
      const uniqueId = Math.random().toString(36).substring(7);
      
      // Create specific messaging for Ease of Set Up
      const easeOfSetUpDetails = reviewData.preferences.includes('Ease of Set Up') 
        ? `When mentioning "Ease of Set Up", specifically highlight:
- How smooth and easy the onboarding process was with TrueAim AI
- How TrueAim AI plugs directly into their existing ad account
- How simple the setup process was compared to other solutions
- The seamless integration experience

` : '';

      const prompt = `You are writing a genuine Google review for TrueAim AI, a cutting-edge ad targeting platform. TrueAim AI provides access to 250+ million consumer profiles with 100+ billion real-time buying signals, helping businesses target Facebook ads to people who are actively looking for their services within the past week.

Write a ${reviewData.emojiLabel.toLowerCase()} review from the perspective of a ${randomBusinessContext} focusing specifically on: ${selectedPreferences}

Context for variety: You're writing this review ${randomTimeframe}. Consider incorporating these specific aspects naturally: ${randomPoints.join(', ')}.

${easeOfSetUpDetails}CRITICAL DIVERSITY REQUIREMENTS:
1. Use a unique writing style - vary sentence structure, length, and tone
2. Choose different aspects to emphasize even within the same preference categories
3. Use varied vocabulary and phrasing
4. Include personal touches that make this review unique
5. Vary the review structure (don't always start the same way)
6. Use different transitional phrases and connectors

SAFEGUARDS - YOU MUST FOLLOW THESE RULES:
1. NEVER mention specific metrics, percentages, or numbers (like "32% improvement", "50% increase", etc.)
2. NEVER mention "ad reach" - TrueAim AI is about TARGETING, not reach
3. NEVER mention irrelevant metrics like "click-through rates", "impressions", or "reach"
4. Focus ONLY on what TrueAim AI actually does: better TARGETING of Facebook ads to people actively looking for services
5. Use qualitative descriptions instead of quantitative claims
6. Stick to believable, general improvements like "better results", "more qualified leads", "easier setup"
7. Keep tone moderate and professional - avoid overly enthusiastic language like "one of the best", "amazing", "incredible"
8. Use balanced language - instead of superlatives, use words like "good", "solid", "helpful", "works well"
9. ABSOLUTELY NEVER use em dashes (—) anywhere in the text
10. Use regular hyphens (-) or commas instead of em dashes
11. Replace any em dash with a comma, period, or regular hyphen
12. Use measured, realistic language that sounds credible
13. Avoid extreme superlatives or overly giddy expressions

STYLE VARIATION INSTRUCTIONS:
- Mix short and long sentences
- Vary how you start the review (don't always lead with the same structure)
- Use different ways to express satisfaction
- Incorporate varied business terminology naturally
- Change up the flow and rhythm of the writing
- Use different connector words (however, additionally, furthermore, also, plus, etc.)

The review should:
- Sound like it's from a real ${randomBusinessContext} who actually used the service
- Focus on TARGETING improvements and LEAD QUALITY (not reach or impressions)
- Be conversational and authentic, not overly promotional
- Include natural language patterns and personal touches unique to this review
- Be 2-4 sentences long
- Avoid generic marketing language
- Address each selected preference area in a natural way
- Create a completely unique voice and perspective

Selected combination: ${combinationKey}
Unique identifier: ${uniqueId}

Examples of GOOD balanced language:
- "The targeting works well for our needs"
- "Setup was straightforward and took about 10 minutes"
- "We're getting better quality leads now"
- "The targeting is more precise than what we had before"
- "Support was helpful when we had questions"

Examples of BAD overly enthusiastic language to AVOID:
- "One of the best/easiest/most amazing"
- "Absolutely incredible"
- "Mind-blowing results"
- "Game-changer"
- "Revolutionary"
- Any specific percentages or numbers
- "Ad reach improved"
- "Click-through rates"
- "Impressions increased"

Write ONLY the review text, no quotes or formatting. Make this review completely unique and different from any other review that might be generated. NEVER use em dashes (—) in any part of the review.`;

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
              content: 'You are an expert at writing authentic, unique, and varied customer reviews for TrueAim AI. Your primary goal is to create completely different reviews each time while following all safety guidelines. You MUST: 1) Create unique writing styles and structures, 2) Vary vocabulary and phrasing significantly, 3) NEVER mention specific metrics or percentages, 4) NEVER mention "ad reach" - focus on TARGETING quality, 5) NEVER use em dashes (—), 6) Focus on targeting improvements and lead quality, 7) Use qualitative descriptions only, 8) Keep tone moderate and professional, 9) Use balanced, credible language, 10) Make each review completely distinct in voice, style, and emphasis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 1.1, // Increased temperature for maximum variety
          top_p: 0.95, // Higher top_p for more diverse token selection
          frequency_penalty: 0.8, // Higher frequency penalty to reduce repetition
          presence_penalty: 0.6, // Presence penalty to encourage new topics
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      let review = data.choices[0]?.message?.content?.trim() || '';
      
      // Additional safety checks
      review = review.replace(/—/g, ', ');
      review = review.replace(/\b\d+%/g, 'significantly');
      review = review.replace(/\b\d+\s*percent/gi, 'significantly');
      review = review.replace(/one of the (best|easiest|most \w+)/gi, 'a good');
      review = review.replace(/absolutely (amazing|incredible|fantastic)/gi, 'helpful');
      review = review.replace(/game-changer/gi, 'useful tool');
      
      setGeneratedReview(review);
    } catch (error) {
      console.error('Error generating review:', error);
      alert('Failed to generate review. Please try again.');
      clearInterval(progressInterval);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const canProceed = reviewData.preferences.length > 0;

  // Generate review whenever preferences change
  useEffect(() => {
    if (currentStep === 'preferences' && canProceed) {
      // Clear previous review immediately to show loading state
      setGeneratedReview('');
      generateReviewWithChatGPT();
    }
  }, [reviewData.preferences, currentStep]);

  const handleCopyAndSubmit = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      setCurrentStep('loading');
      setLoadingProgress(0);
      
      // Changed increment from 10 to 1 for smoother progress, now 30% faster
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const googleReviewUrl = 'https://g.page/r/CYJQ22pZhgZwEBM/review';
              console.log('Opening Google Reviews URL:', googleReviewUrl);
              
              // Detect mobile device
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              
              if (isMobile) {
                // For mobile: use location.href to ensure it works
                window.location.href = googleReviewUrl;
              } else {
                // For desktop: use window.open for new tab
                window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
              }
            }, 200);
            return 100;
          }
          return prev + 1; // Changed from +10 to +1
        });
      }, 37.3); // Reduced from 53.3ms to 37.3ms (30% faster)
      
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
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-8">
          
          {/* Emoji Selection Step */}
          {currentStep === 'emoji' && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 relative z-10">
                  How was your experience with
                </h1>
                <div className="flex justify-center -my-8">
                  <img 
                    src="/lovable-uploads/8de08320-699b-4cbb-bda0-f9a053e5694a.png" 
                    alt="TrueAim AI"
                    className="h-24 sm:h-32 w-auto"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-6 -mt-4 relative z-10">
                {emojis.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji, label)}
                    className="flex flex-col items-center p-4 sm:p-8 rounded-xl border-2 border-gray-600 bg-gray-700/30 transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:bg-blue-500/10 active:scale-95 touch-manipulation"
                  >
                    <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">{emoji}</div>
                    <span className="text-sm sm:text-lg font-medium text-gray-300">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Negative Feedback Step */}
          {currentStep === 'negative' && (
            <div className="text-center space-y-6">
              <div className="text-4xl sm:text-5xl mb-4">{selectedEmoji}</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                We're sorry you didn't have a good experience
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                We appreciate your feedback and will work to improve.
              </p>
              
              <div className="bg-green-900/30 border-2 border-green-600/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-sm:text-base">Feedback Submitted</span>
                </div>
                <p className="text-green-300 mt-2 text-xs sm:text-sm">Thank you for taking the time to share your experience with us.</p>
              </div>
            </div>
          )}

          {/* Preference Selection Step */}
          {currentStep === 'preferences' && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div>
                <div className="text-4xl sm:text-5xl mb-4">{selectedEmoji}</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Awesome!</h2>
                <p className="text-gray-300 text-sm sm:text-base">What impressed you most about TrueAim AI?</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preferenceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePreferenceToggle(option)}
                      className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation active:scale-95 ${
                        reviewData.preferences.includes(option)
                          ? 'bg-blue-600 text-white border-2 border-blue-400'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {/* Generated review display */}
                {(generatedReview || isGenerating) && (
                  <div className="mt-4 sm:mt-6">
                    <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600">
                      {isGenerating ? (
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-gray-300 mb-4 text-sm sm:text-base">Generating your unique review...</p>
                            <div className="max-w-xs mx-auto">
                              <Progress value={generationProgress} className="h-2 sm:h-3 mb-2" />
                              <p className="text-xs sm:text-sm text-blue-400 font-medium">
                                {Math.round(generationProgress)}% complete
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-200 leading-relaxed mb-4 text-left text-sm sm:text-base">
                            "{generatedReview}"
                          </p>
                          <Button
                            onClick={handleCopyAndSubmit}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-3 sm:py-4 touch-manipulation active:scale-95"
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
            <div className="text-center space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Almost there!</h2>
                <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-4">
                  When you get to Google, just paste and you're ready to go!
                </p>
              </div>
              
              <div className="max-w-sm mx-auto w-full px-4">
                <div className="bg-gray-700 rounded-full h-3 sm:h-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-100"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-green-400 font-semibold text-sm sm:text-base">
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
