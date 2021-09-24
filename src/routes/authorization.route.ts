import { Request, Response, NextFunction, Router } from 'express';
import { Buffer } from 'buffer';

import ForbiddenError from '../models/errors/forbidden.error.model';




const authorizationRoute = Router();


authorizationRoute.post('/token', async (req: Request, res: Response, next: NextFunction) => {
	console.log('Testing post token router...');
	console.log(req.headers['authorization']);
	
	const testBuf = Buffer.from('hello');
	console.log(testBuf);
	
			
	try {
		const authorizationHeader = req.headers['authorization'];
	
		if (!authorizationHeader) {
		
			/*ATENÇÃO: mensagem de teste. Em produção não se deve expor aspectos internos do sistema, como, por exemplo, tipo de autenticação...*/
			throw new ForbiddenError('Credenciais não informadas');
		}
		
		/*Abaixo, formato padrão de uma string de Basic Auth
		Basic Og== */
		const [authenticationType, token] = authorizationHeader.split(' ');
		console.log(authenticationType, token);
		
		
		if (authenticationType !== 'Basic' || !token) {
			throw new ForbiddenError('Tipo de autenticação inválido');
		}
		
		const tokenContent = Buffer.from(token, 'base64').toString('uft-8');
		// console.log(tokenContent);
		
		const [username, password] = tokenContent.split(':');
		console.log(username, password);
		
		if (!username || !password) {
			throw new ForbiddenError('Credenciais não preechidas');
		}
		
		const user = await userRepository.findByUsernameAndPassword(username, password);
		console.log(user);
		
	} catch (error) {
		next(error);
	}
});



export default authorizationRoute;


