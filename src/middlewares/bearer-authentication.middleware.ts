import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';





async function bearerAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
	
	try {
		
		const authorizationHeader = req.headers['authorization'];
		
		if (!authorizationHeader) {
			throw new ForbiddenError('Credenciais não informadas');
		}
		
		const [authenticationType, token] = authorizationHeader.split(' ');
		
		if (authenticationType !== 'Bearer' || !token) {
			throw new ForbiddenError('Tipo de autenticação inválido!');
		}
		
		// O método verify() devolve o payload
		// que aqui é o 'subject' com o uuid
		const tokenPayload = JWT.verify(token, 'my_secret_key');
		
				
		if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
			throw new ForbiddenError('Token Inválido');
		}
		
		
		const uuid = tokenPayload.sub;
		
		
		/*
			ATENÇÃO: como o conteúdo do token é confiável, uma vez que ele foi validade pela função JWT.verify() nem sequer haveria a necessidade de se checar com o DB (o que faz diferença em grandes apps)
		*/
		//const user = await userRepository.findById(uuid);
		
		const user = {
			uuid: tokenPayload.sub,
			username: tokenPayload.username
		};
		
		req.user = user;
		
		
		next();
	} catch (error) {
		next(error);
	}
}



export default bearerAuthenticationMiddleware;





