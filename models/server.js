const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

 
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        this.paths={
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:   '/api/uploads',
            usuarios:   '/api/usuarios'
        }
        

        //conectar a db
        this.conectarDB();

        //middlewares
        this.middlewares();

        //app routes
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //Cors
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //Carpeta publica
        this.app.use(express.static('public'));

        //Fileupload
        this.app.use(fileUpload({
            useTempFiles:true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }


    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));   
        this.app.use(this.paths.uploads, require('../routes/uploads'));   
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));   
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server corriendo en.. ', this.port);
        });
    }
}


module.exports = Server;