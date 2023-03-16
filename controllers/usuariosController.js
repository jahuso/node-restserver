const {response,request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');



const usuariosGet = async(req, res = response)=> {
    
    //const {q, nombre = 'No name', apikey, page = 1, limit} = req.query;

    const{limite =5, desde = 0} = req.query;
    const query = {estado: true}; 

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))  
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response)=> {
    const {nombre,correo, password,rol} = req.body;
    const usuario = new Usuario({nombre,correo,password,rol});

    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });
    }

    //Encryptar el password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //guardar en bd
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response)=> {
    const {id} = req.params;
    const {_id, password,google, ...resto} = req.body;

    //TODO validar contra base de datos
    if (password) {
        //Encriptar la contrase;a
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);    
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json(usuario);
}



const usuariosDelete = async(req, res = response)=> {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json(usuario);
}

const usuariosPatch = (req, res = response)=> {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
