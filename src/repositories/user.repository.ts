// Lembrando que o objeto 'db' é o Pool de conexões exportado por db.ts
import db from '../db';
import User from '../models/user.model';

import DatabaseError from '../models/errors/database.error.model';




class UserRepository {
	
	async findAllUsers(): Promise<User[]> {
		const query = `
			SELECT uuid, username 
				FROM application_user
		`;
		
		/* MODELO 1
		db.query<User>(query).then((result) => {
			result.rows[0].username
		});*/
		/*MODELO 2*/
		const { rows } = await db.query<User>(query);
		//const rows = result.rows;
		
		return rows || [];
	}
	
	
	/*ATENÇÃO*/
	// não passar a variável uuid diretamente 
	// para a query string para evitar SQL 
	// Injection
	async findById(uuid: string): Promise<User> {
		
		try {
			const query = `
				SELECT uuid, username
					FROM application_user
					WHERE uuid = $1
			`;
			
			const values = [uuid];
			
			const { rows } = await db.query<User>(query, values);
			
			const [ user ] = rows;
			// const user = rows[0];
			
			return user;
		} catch (error) {
			console.log(error);
			
			throw new DatabaseError('Erro na consulta por ID', error);
		}
		
	}
	
	
	// Não esquecer de passar o param de criptografia do Postgres
	// Aqui a chave está sendo passada, mas o certo é tê-la 
	// como variável de ambiente e passada $3
	async create(user: User): Promise<string> {
		const script = `
			INSERT INTO application_user (username, password)
				VALUES ($1, crypt($2, 'my_salt'))
			RETURNING uuid
		`;
		
		const values = [user.username, user.password];
	
		const { rows } = await db.query<{ uuid: string }>(script, values);
		
		const [newUser] = rows;
		
		return newUser.uuid;
	}
	
	
	async update(user: User): Promise<void> {
		const script = `
			UPDATE application_user
				SET 
					username = $1,
					password = crypt($2, 'my_salt')
				WHERE uuid = $3
		`;
		
		const values = [user.username, user.password, user.uuid];
	
		await db.query(script, values);	
	}
	
	// Cuidado: delete é uma palavra reservada do Javascript
	async remove(uuid: string): Promise<void> {
		const script = `
			DELETE
				FROM application_user
				WHERE uuid = $1
		`;
		
		const values = [uuid];
		
		await db.query(script, values);
	}
	
}



export default new UserRepository();







