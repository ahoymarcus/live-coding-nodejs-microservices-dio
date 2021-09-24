//import dotenv from 'dotenv';

import { Pool } from 'pg';



//const connectionString = '';
//const connectionString = process.env.POSTGRES_URL;

  



// Trabalhar com um Pool de conexões
const db = new Pool({ connectionString });




export default db;

     




