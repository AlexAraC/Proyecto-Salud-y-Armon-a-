const sql = require('mssql');

require('dotenv').config();


if (!process.env.DB_SERVER) {
    throw new Error('DB_SERVER no definido');
}


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const conectarDB = async () => {

    try {

        await sql.connect(config);

        console.log('Conectado a SQL Server');

    } catch (error) {

        console.log(error);

    }

};

module.exports = {
    conectarDB,
    sql
};