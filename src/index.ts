import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { config } from './config/config';
import { specs } from './config/swagger';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(userRoutes);
app.use(authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(config.PORT, () => {
  console.log(`Servidor rodando na porta ${config.PORT}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${config.PORT}/api-docs`);
});
