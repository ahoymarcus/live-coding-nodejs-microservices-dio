import { Request, Response, NextFunction, Router } from 'express';
import { Buffer } from 'buffer';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import ForbiddenError from '../models/errors/forbidden.error.model';

/*ATENÇÃO: veja que o middleware está sendo registrado aqui, PORQUE ele está sendo designado apenas para esta rota específica*/
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import bearerAuthenticationMiddleware from '../middleware/bearer-authentication.middleware';




const authorizationRoute = Router();


/*
	ATENÇÃO: esta rota TEM que vir antes da outra, porque é mais específica, SENÃO, ela nunca seria chamada!!!!
	Observe que nesta rota, com a inserção do middleware bearerAuthenticationMiddleware, já vai haver uma validação prévia, de modo que em não havendo erro passado à frente pelo middleware, tudo o que resta é responder com 200...
*/
authorizationRoute.post('/token/validate', bearerAuthenticationMiddleware, (req: Request, res: Response, next: NextFunction) => {
	res.sendStatus(StatusCodes.OK);
});



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





