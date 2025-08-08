import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userService';

const userService = new UserService();

const CreateUserRequestSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const UpdateUserRequestSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      
      const validatedData = CreateUserRequestSchema.parse(req.body);
      
      const user = await userService.createUser(validatedData);
      return res.status(201).json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });

    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const users = await userService.getUsers(Number(page), Number(limit));
      return res.status(200).json(users);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) return res.status(200).json(user);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        return res.status(400).json({ error: err.message });

      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
     
      const validatedData = UpdateUserRequestSchema.parse(req.body);
      
      const user = await userService.updateUser(req.params.id, validatedData);
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(404).json({ error: 'Usuário não encontrado' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (user) return res.status(204).send();
      return res.status(404).json({ error: 'Usuário não encontrado' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const targetUserId = req.params.id;

      if (userId !== targetUserId) {
        return res.status(401).json({ error: 'Não autorizado a alterar senha de outro usuário' });
      }

      const validatedData = ChangePasswordRequestSchema.parse(req.body);

      const user = await userService.changePassword(userId, validatedData);
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(404).json({ error: 'Usuário não encontrado' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }

      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
}
