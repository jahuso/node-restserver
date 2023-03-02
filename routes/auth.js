const {Router} = require('express');
const {check} = require('express-validator');

const{login, googleSignIn} = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contrasena es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google',[
    check('id_token','id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);

router.post('/login',login);

module.exports = router;


