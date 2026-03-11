export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePictureUrl?: string;
}

export interface PasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface DisableAccountDTO {
  days: number;
  password: string;
}

export interface DeleteAccountDTO {
  password: string;
}

export interface ChangeEmailDTO {
  currentPassword: string;
  newEmail: string;
  confirmNewEmail: string;
}
