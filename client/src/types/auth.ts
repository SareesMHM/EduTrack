import { Address, Gender, User } from './user';

export interface LoginInput { email: string; password: string }
export interface RegisterInput {
  fullName: string; email: string; password: string; phone?: string; gender?: Gender; dateOfBirth?: string;
  gradeId?: string; parentName?: string; parentPhone?: string; parentNic?: string; address?: Address;
}
export interface Tokens { accessToken: string; refreshToken: string }
export interface AuthResult extends Tokens { user: User }
