import React, { useState } from 'react';
import Input from './Input';
import { checkPasswordStrength } from '../../utils/validation';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string | null;
  showStrength?: boolean;
}

const PasswordInput = ({ 
  value, 
  onChange, 
  onBlur, 
  error,
  showStrength = true 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(value);

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return 'bg-gray-200'; // 空密码
      case 1:
        return 'bg-red-500';  // 弱密码
      case 2:
        return 'bg-yellow-500'; // 中等密码
      case 3:
        return 'bg-blue-500';   // 较强密码
      case 4:
        return 'bg-green-500';  // 强密码
      default:
        return 'bg-gray-200';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
        return '请输入密码';
      case 1:
        return '弱';
      case 2:
        return '中等';
      case 3:
        return '较强';
      case 4:
        return '强';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="密码"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? '隐藏' : '显示'}
        </button>
      </div>
      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {getStrengthText(strength.score)}
            </span>
          </div>
          {strength.feedback && (
            <p className="text-xs text-gray-500">{strength.feedback}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput; 