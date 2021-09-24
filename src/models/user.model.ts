// Lembrar que uuid só passa a existir após a gravação do registro pelo Postgre
type User = {
	uuid?: string;
	username: string;
	password?: string;
}


export default User;


