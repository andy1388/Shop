import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { register } from '../store/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PasswordInput from '../components/common/PasswordInput';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword, ValidationErrors } from '../utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (field: string) => {
    let error = null;
    switch (field) {
      case 'username':
        error = validateUsername(formData.username);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
    }
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            创建新账户
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="用户名"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              error={attempted ? errors.username : null}
              className="w-full"
            />
            <Input
              type="email"
              name="email"
              placeholder="电子邮箱"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={attempted ? errors.email : null}
              className="w-full"
            />
            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={attempted ? errors.password : null}
              showStrength={true}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              error={attempted ? errors.confirmPassword : null}
              className="w-full"
            />
          </div>

          {attempted && error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600">已有账户？</span>
          <Link to="/login" className="text-blue-600 hover:text-blue-800 ml-2">
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register; 