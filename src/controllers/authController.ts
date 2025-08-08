import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userService';
import { generateToken } from '../utils/tokenUtils';

const userService = new UserService();

// valida na entrada da request
const LoginRequestSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const validatedData = LoginRequestSchema.parse(req.body);
      const { email, password } = validatedData;

      const user = await userService.authenticateUser(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const accessToken = generateToken(user.id);
      
      
      res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        maxAge: 24 * 60 * 60 * 1000, 
        path: '/'
      });

      return res.status(200).json({ 
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });

      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
