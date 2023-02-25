const {Router} = require('express');
const Role = require('../models/role');

const { validarCampos} = require('../middlewares/validar-campos');
const {check} = require('express-validator');
const {esRoleValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch, 
        usuariosPut 
    } = require('../controllers/usuariosController');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol').custom(),
    
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost );

router.delete('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos    
],usuariosDelete );

router.patch('/', usuariosPatch);

module.exports = router;

