// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerTipokemons,
    obtenerTipokemon,
    obtenerTipokemonNombre,
    agregarTipokemon,
    editarTipokemon,
    eliminarTipokemon } = require('../controllers/tpokemons.controllers');

//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenOK } = require('../middlewares/auth');
const { validadorTpokemon } = require('../validators/tpokemons.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE CATEGORIAS
router.get('/', obtenerTipokemons);
router.post('/', TokenOK, [validadorTpokemon], agregarTipokemon);
router.get('/nombre/:name', obtenerTipokemonNombre);
router.get('/:id', obtenerTipokemon);
router.put('/:id',TokenOK, editarTipokemon);
router.delete('/:id',TokenOK, eliminarTipokemon);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;