import { Request, Response, NextFunction, Router } from 'express';
import { Buffer } from 'buffer';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import ForbiddenError from '../models/errors/forbidden.error.model';

/*ATENÇÃO: veja que o middleware está sendo registrado aqui, PORQUE ele está sendo designado apenas para esta rota específica*/
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';




const authorizationRoute = Router();


authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
	console.log('Testing post token router...');
	console.log(req.headers['authorization']);
	
	const testBuf = Buffer.from('hello');
	console.log(testBuf);
	
			
	try {
		
		const user = req.user;
		
		// Validação apenas preventiva, caso o middleware seja alterado
		if (!user) {
			throw new ForbiddenError('Usuário não informado!');
		}
		
		/*Montando o JWT*/
		// JWT.sign({ username: user.uuid }, 'my_secret_key', {
			// subject: user?.uuid
		// });
		
		const jwtPayload = { username: user.uuid };
		const jwtOptions = { subject: user?.uuid };
		const secretKey = 'my_secret_key';
		
		const jwt = JWT.sign(jwtPayload, jwtOptions, jwtOptions);
		
		res.status(StatusCodes.OK).json({ token: jwt });
		
		
		
	} catch (error) {
		next(error);
	}
});



export default authorizationRoute;


