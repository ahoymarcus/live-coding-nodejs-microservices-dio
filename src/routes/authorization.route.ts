import { Request, Response, NextFunction, Router } from 'express';

import ForbiddenError from '../models/errors/forbidden.error.model';




const authorizationRoute = Router();


authorizationRoute.post('/token', (req: Request, res: Response, next: NextFunction) => {
	console.log('Testing post token router...');
	
	try {
		const authorizationHeader = req.headers['authorization'];
	
		if (!authorizationHeader) {
		
			/*ATENÇÃO: mensagem de teste. Em produção não se deve expor aspectos internos do sistema, como, por exemplo, tipo de autenticação...*/
			throw new ForbiddenError('Credenciais não informadas');
		}
		
		// Abaixo, formato padrão de uma string de Basic Auth
		// Basic Og==
		const [authenticationType, token] = authorizationHeader.split(' ');
		
		if (authenticationType !== 'Basic' || !token) {
			throw new ForbiddenError('Tipo de autenticação inválido');
		}
		
		
		
		
	} catch (error) {
		next(error);
	}
});



export default authorizationRoute;


