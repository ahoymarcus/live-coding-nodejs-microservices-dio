import { Request, Response, NextFunction, Router } from 'express';




const authorizationRoute = Route();


authorizationRoute.post('/token', (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.headers['authorization'];
	
	if (!authorizationHeader) {
		
	}
});



export default authorizationRoute;


