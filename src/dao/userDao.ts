import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User, UserWithoutPassword, UserSchema } from '../models/userModel';
import prisma from '../config/prisma';


const CreateUserDataSchema = z.object({

  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),

});

const UpdateUserDataSchema = z.object({
  
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

export class UserDao {
  async create(userData: { name: string; email: string; password: string }): Promise<User> {
    
    const validatedData = CreateUserDataSchema.parse(userData);
    
    const existingUser = await this.getUserByEmail(validatedData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword
      }
    });
    return UserSchema.parse(newUser);
  }

  async getAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map(user => UserSchema.parse(user));
  }

  async getTotalCount(): Promise<number> {
    return await prisma.user.count();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? UserSchema.parse(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? UserSchema.parse(user) : null;
  }

  async update(id: string, data: { name?: string; email?: string; password?: string }): Promise<User | null> {
 
    const validatedData = UpdateUserDataSchema.parse(data);
    
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    if (validatedData.email) {
      const userWithEmail = await this.getUserByEmail(validatedData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error('Email já está em uso');
      }
    }

    let updateData: any = { ...validatedData };
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return UserSchema.parse(updatedUser);
  }

  async updatePassword(id: string, newPassword: string): Promise<User | null> {
    
    if (newPassword.length < 6) {
      throw new Error('Nova senha deve ter pelo menos 6 caracteres');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return UserSchema.parse(updatedUser);

  }

  async delete(id: string): Promise<User | null> {
    const deletedUser = await prisma.user.delete({
      where: { id }
    });

    return UserSchema.parse(deletedUser);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {

    return bcrypt.compare(password, user.password);
    
  }
}
