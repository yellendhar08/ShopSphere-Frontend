export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  exp: number;
}
