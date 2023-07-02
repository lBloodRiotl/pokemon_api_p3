// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerPokemons,
    obtenerPokemon,
    obtenerPokemonNombre,
    obtenerPokemonPorTipoPokemonNombre,
    agregarPokemon,
    editarPokemon,
    eliminarPokemon } = require('../controllers/pokemons.controllers');
//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenOK } = require('../middlewares/auth');
const { validadorPokemon } = require('../validators/pokemons.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE RECETAS
router.get('/', obtenerPokemons);
router.post('/', [TokenOK, validadorPokemon], agregarPokemon);
router.get('/:id', obtenerPokemon);
router.get('/nombre/:name', obtenerPokemonNombre);
router.get('/tipopokemon/:name', obtenerPokemonPorTipoPokemonNombre);
router.put('/:id',TokenOK, editarPokemon);
router.delete('/:id',TokenOK, eliminarPokemon);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;