// Em src/dtos/AuthDtos.ts

/**
 * O "formulário" que o frontend envia para a API ao fazer login.
 * Corresponde ao seu LoginDto.cs no backend.
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * A resposta que o frontend espera receber da API após um login bem-sucedido.
 * Corresponde ao objeto que seu AuthController retorna.
 */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

/**
 * A resposta que o frontend espera receber ao buscar o perfil do usuário.
 * Corresponde ao userProfileResponse do seu GetUserProfile.
 */
export interface UserProfileDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  hasPassword?: boolean;
  phoneNumber: string;
}