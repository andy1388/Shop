// 表单验证规则
export const validateEmail = (email: string): string | null => {
  if (!email) return '请输入邮箱';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '请输入有效的邮箱地址';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return '请输入密码';
  if (password.length < 6) return '密码长度至少为6位';
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return '请输入用户名';
  if (username.length < 2) return '用户名长度至少为2位';
  if (username.length > 20) return '用户名长度不能超过20位';
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return '请确认密码';
  if (password !== confirmPassword) return '两次输入的密码不一致';
  return null;
};

// 添加密码强度检查
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  if (!password) {
    return {
      score: 0,
      feedback: '请输入密码'
    };
  }

  // 计算分数（每个条件1分）
  let score = 0;
  const feedback = [];

  // 1. 长度 8+
  const hasLength = password.length >= 8;
  if (hasLength) score++;
  else feedback.push('密码长度至少8位');

  // 2. 包含数字
  const hasNumber = /\d/.test(password);
  if (hasNumber) score++;
  else feedback.push('建议包含数字');

  // 3. 包含小写字母
  const hasLower = /[a-z]/.test(password);
  if (hasLower) score++;
  else feedback.push('建议包含小写字母');

  // 4. 包含大写字母
  const hasUpper = /[A-Z]/.test(password);
  if (hasUpper) score++;
  else feedback.push('建议包含大写字母');

  // 5. 包含特殊字符
  const hasSpecial = /[!@#$%^&*]/.test(password);
  if (hasSpecial) score++;
  else feedback.push('建议包含特殊字符');

  // 特殊情况处理：
  // 1. 长度不足但满足多个条件
  if (!hasLength && score > 2) {
    return {
      score: 2, // 显示为中等（黄色）
      feedback: '密码长度至少8位'
    };
  }

  // 2. 只有特殊字符
  if (hasSpecial && score === 1) {
    return {
      score: 1, // 显示为弱（红色）
      feedback: feedback.join('，')
    };
  }

  // 常规情况处理
  if (score <= 2) {
    return {
      score: 1,
      feedback: feedback.join('，')
    };
  } else if (score === 3) {
    return {
      score: 2,
      feedback: feedback.join('，')
    };
  } else if (score === 4) {
    return {
      score: 3,
      feedback: feedback.join('，')
    };
  } else {
    return {
      score: 4,
      feedback: ''
    };
  }
};

// 表单验证接口
export interface ValidationErrors {
  [key: string]: string | null;
} 