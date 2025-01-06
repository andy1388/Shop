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
    <div className="w-full py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center relative">
          {/* 連接線 - 使用偽元素創建兩條線 */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between">
            {/* 第一條線 */}
            <div className={`h-[2px] w-[45%] ${
              currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'
            }`} />
            {/* 第二條線 */}
            <div className={`h-[2px] w-[45%] ${
              currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          </div>

          {/* 步驟圓圈 */}
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative z-10 bg-gray-50">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${currentStep === step.number 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step.number 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  } mb-2`}
              >
                {currentStep > step.number ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`text-sm whitespace-nowrap ${
                currentStep === step.number 
                  ? 'text-blue-600 font-medium' 
                  : currentStep > step.number
                    ? 'text-green-500'
                    : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 