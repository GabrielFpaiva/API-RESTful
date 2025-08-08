import { UserDao } from '../dao/userDao';
import { User, UserWithoutPassword } from '../models/userModel';

const userDao = new UserDao();

export class UserService {
  async createUser(data: { name: string; email: string; password: string }): Promise<UserWithoutPassword> {
    const user = await userDao.create(data);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsers(page: number, limit: number) {
    const users = await userDao.getAll(page, limit);
    const totalItems = await userDao.getTotalCount();
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      items: users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    };
  }

  async getUserById(id: string): Promise<UserWithoutPassword | undefined> {
    const user = await userDao.getUserById(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }): Promise<UserWithoutPassword | null> {
    const user = await userDao.update(id, data);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async changePassword(userId: string, data: { currentPassword: string; newPassword: string }): Promise<UserWithoutPassword | null> {
    const user = await userDao.getUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isCurrentPasswordValid = await userDao.verifyPassword(user, data.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Senha atual incorreta');
    }

    const updatedUser = await userDao.updatePassword(userId, data.newPassword);
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    return null;
  }

  async deleteUser(id: string): Promise<UserWithoutPassword | null> {
    const user = await userDao.delete(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async authenticateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await userDao.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await userDao.verifyPassword(user, password);
    if (!isValidPassword) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
