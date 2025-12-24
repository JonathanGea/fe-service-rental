export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
