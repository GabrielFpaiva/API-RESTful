import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar login e obter accessToken via cookie
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 minimum: 1
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Email ou senha inválidos
 *       400:
 *         description: Dados inválidos
 */
router.post('/auth/login', AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realizar logout e limpar accessToken
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 */
router.post('/auth/logout', AuthController.logout);

export default router;
