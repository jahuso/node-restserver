const {Router} = require('express');
const {check} = require('express-validator');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT,validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categoriasController');



const router = Router();

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es un id de Mongo valido').isMongoId(), 
    check('id').custom(existeCategoriaPorId),
    validarCampos,
],obtenerCategoria);

//crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    //check('categoria','No es un id de Mongo').isMongoId(),    
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquier persona con un token valido
router.put('/:id',[
        validarJWT,
        check('categoria','No es un id de Mongo').isMongoId(),
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),       
        validarCampos
    ],actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(), 
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria);


module.exports = router;