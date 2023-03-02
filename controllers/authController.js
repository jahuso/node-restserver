const {response}= require('express');
const bcryptjs= require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

const login=async(req,res = response)=> {
    const{correo,password} = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            });
        }

        //Verificar la constrase;a
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }


    
}

const googleSignIn = async(req,res = response)=>{
    const {id_token} = req.body;
    
    try {

        const {correo,nombre,img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password:';P',
                img,
                rol:'USER_ROLE',
                google:true
            };

            usuario = new Usuario(data);
            console.log(usuario);
            await usuario.save();
        }

       //si el usuario no esta en DB
       if (!usuario.estado) {
            return res.status(401).json({
                msg: 'hable con el admin, usuario bloqueado'
            });
       }

       //generar JWT
       const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'El Token google invalido'
        })
    }
}

module.exports ={
    login,
    googleSignIn
}