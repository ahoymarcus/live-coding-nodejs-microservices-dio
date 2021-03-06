import dotenv from 'dotenv';
//require('dotenv').config();

import express, { Request, Response, NextFunction} from 'express';
import errorHandler from './middlewares/error-handler.middleware';

import statusRoute from './routes/status.route';
import userRoute from './routes/user.route';
import authorizationRoute from './routes/authorization.route';




const app = express();

// Middleware Express para configurar recebimento de json
// Tem de vir por primeiro na ordem
app.use(express.json());

// Middleware para configurar o parseamento de requests com urlencoded payloads
app.use(express.urlencoded({ extended: true }));



// Configuração das Rotas
app.use(statusRoute);
app.use(authorizationRoute);

/*
	ATENÇÃO: o middleware bearerAuthenticationMiddleware poderia ser registrado aqui, seguindo essa ordem para ele atuar apenas nas rotas daque para baixo!!!
*/
app.use(userRoute);



// Configurar os Errors Handlers (middleware)
app.use(errorHandler);



app.listen(3000, () => {
	console.log('Server runninng at localhost:3000');
});





