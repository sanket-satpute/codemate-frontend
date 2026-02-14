export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[]; // Assuming roles are strings, e.g., ['ROLE_USER', 'ROLE_ADMIN']
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePictureUrl?: string; // Optional field for profile picture URL
}

export interface PasswordChangeDTO {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
