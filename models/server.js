const express = require('express')
const cors = require('cors');

const { dbConnection } = require('../database/config');
 


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        //conectar db
        this.conectarDB();

        //middlewares
        this.middlewares();

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //Carpeta publica
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        this.app.use(express.static('public'));

    }


    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server corriendo en.. ', this.port);
        });
    }
}


module.exports = Server;