import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginCredentials, UserPreferences } from '../../types/auth';

// 从 localStorage 获取已注册用户，如果没有则使用默认用户
const getInitialUsers = (): User[] => {
  const savedUsers = localStorage.getItem('registeredUsers');
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }
  return [{
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    role: 'user',
    preferences: {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      currency: 'CNY',
    },
    createdAt: new Date().toISOString(),
  }];
};

let registeredUsers: User[] = getInitialUsers();

// 修改模拟登录函数
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 查找用户
  const user = registeredUsers.find(u => u.email === credentials.email);
  
  if (user) {
    // 在实际应用中，这里应该进行密码哈希比较
    // 现在为了测试，我们假设所有密码都是 'password'
    if (credentials.password === 'password') {
      return user;
    }
  }
  throw new Error('Invalid credentials');
};

// 修改时间常量
const TEST_MODE = false; // 改回正式模式
const EXPIRES_IN = {
  REMEMBER: 30 * 24 * 60 * 60 * 1000,  // 30天
  NORMAL: 24 * 60 * 60 * 1000,         // 24小时
  RENEW_THRESHOLD: 10 * 24 * 60 * 60 * 1000  // 10天（新增）
};

// 创建异步action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials & { rememberMe?: boolean }) => {
    const user = await mockLogin(credentials);
    
    // 使用测试时间
    const expiresIn = credentials.rememberMe ? EXPIRES_IN.REMEMBER : EXPIRES_IN.NORMAL;
    const expiresAt = new Date().getTime() + expiresIn;
    
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('expiresAt', expiresAt.toString());
    if (credentials.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    return user;
  }
);

// 修改会话检查，添加过期时间提示
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    const rememberMe = localStorage.getItem('rememberMe');

    if (!token || !expiresAt) {
      return null;
    }

    const now = new Date().getTime();
    const expireTime = parseInt(expiresAt);
    
    // 添加过期时间日志（方便测试）
    if (TEST_MODE) {
      const remainingTime = Math.max(0, (expireTime - now) / 1000);
      console.log(`Session expires in: ${remainingTime.toFixed(0)} seconds`);
    }

    // 检查是否过期
    if (now > expireTime) {
      console.log('Session expired');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('rememberMe');
      return null;
    }

    // 如果即将过期且设置了记住登录，则续期
    const remainingTime = expireTime - now;
    // 当剩余时间少于10天时续期
    if (rememberMe && remainingTime < EXPIRES_IN.RENEW_THRESHOLD) {
      const newExpiresAt = now + EXPIRES_IN.REMEMBER;
      localStorage.setItem('expiresAt', newExpiresAt.toString());
      console.log('Session renewed with 30 days');
    }

    return {
      id: '1',
      username: 'Test User',
      email: 'test@example.com',
      role: 'user',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        currency: 'CNY',
      },
      createdAt: new Date().toISOString(),
    } as User;
  }
);

// 修改注册函数
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // 检查邮箱是否已被注册
    if (registeredUsers.some(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    // 创建新用户
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: data.username,
      email: data.email,
      role: 'user',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        currency: 'CNY',
      },
      createdAt: new Date().toISOString(),
    };

    // 将新用户添加到注册用户列表
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    return newUser;
  }
);

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('rememberMe');
    },
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      if (state.user) {
        state.user.preferences = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 