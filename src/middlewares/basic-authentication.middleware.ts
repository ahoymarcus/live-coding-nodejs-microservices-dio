import { Request, Response, NextFunction } from 'express';

import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';




async function basicAuthenticationMiddleware(req, res, next) {
	
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
		
		if (!user) {
			throw new ForbiddenError('Usuário ou senha inválidos!');
		}
		
		
		/*
			ATENÇÃO: o usuário será passado junto para a requisição, já que este meddleware está registrado dentro da rota /tokens
			Contudo, por causa das validações Typescript é preciso criar uma extensão de propriedade na requisição, já que a prop 'user' não existe na Request...
		*/
		req.user = user;
		
		// ATENÇÃO: não esquecer que o middleware precisa dar prosseguimento ao caminho da requisição com o next()
		next();
		
	} catch (error) {
		next(error);
	}
}



export default basicAuthenticationMiddleware;




