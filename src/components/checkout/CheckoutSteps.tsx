import React from 'react';

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: '確認訂單' },
    { number: 2, title: '填寫資料' },
    { number: 3, title: '付款完成' }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center relative">
        {/* 連接線 */}
        <div className="absolute left-0 top-1/2 h-0.5 bg-gray-200 w-full -z-10" />
        
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${currentStep === step.number 
                  ? 'bg-blue-600 text-white' 
                  : currentStep > step.number 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                } mb-2`}
            >
              {currentStep > step.number ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className={`text-sm ${
              currentStep === step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 