// 관리자 사용자 타입
export interface AuthUser {
  userId: string;
  name: string | null;
  email: string | null;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// 인증 컨텍스트 타입 (관리자 전용 - SNS 로그인 제거)
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (userId: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

// 로그인 폼 타입
export interface AuthFormData {
  userId: string;
  password: string;
}

// 인증 에러 타입
export interface AuthError {
  message: string;
  status?: number;
}

// 백엔드 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}
