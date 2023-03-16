const {Router} = require('express');
const {check} = require('express-validator');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT,validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto,
        borrarProducto} = require('../controllers/productosController');


const router = Router();

/**
 * {{url}}/api/Productos
 */

//Obtener todas las Productos - publico
router.get('/', obtenerProductos);

//Obtener una Producto por id - publico
router.get('/:id',[
    check('categoria','No es un id de Mongo valido').isMongoId(), 
    check('id').custom(existeProductoPorId),
    validarCampos,
],obtenerProducto);

//crear Producto - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    //check('categoria','No es un id de Mongo').isMongoId(),
    //check('id').custom(existeCategoriaPorId),       
        
    validarCampos
], crearProducto);

//Actualizar - privado - cualquier persona con un token valido
router.put('/:id',[
        validarJWT,
        //check('categoria','No es un id de Mongo').isMongoId(),    
        //check('id').custom(existeProductoPorId),       
        validarCampos
    ],actualizarProducto);

//Borrar una Producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(), 
    //check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);

module.exports = router;