// Obtenemos el metodo Router de express
const database = require('../config/basedatos');
const { httpError } = require('../utils/error');
const { obtenerData } = require('../middlewares/auth');
const { matchedData } = require('express-validator');
//CONTROLADORES
const obtenerPokemons = async (req, res) => {

    try {
        const db = await database();

        const sql = `
        SELECT 
                p.id_pokemon,
                p.nombre,
                p.descripcion,
                p.evolucion,
                p.id_tpokemon
            FROM pokemon p
        `;

        const [rows] = await db.query(sql);

        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        httpError(res, "ERROR_GET_Pokemons");
    }
}
//  METODO PARA AGREGAR UNA Pokemons
const agregarPokemon = async (req, res) => {

    try {
        const body = matchedData(req);
        const { nombre, descripcion,  evolucion,id_tpokemon } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();
        const sql = `
            INSERT INTO Pokemon(nombre, descripcion, evolucion, id_tpokemon, id_user)
            VALUES('${nombre}', '${descripcion}', ${evolucion}, ${id_tpokemon}, ${id_usuario})
        `;
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada de la Pokemons"
                }
            );
        }
        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_Pokemons")
    }
}
//  METODO PARA OBTENER UNA Pokemons POR ID 
const obtenerPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                p.id_pokemon,
                p.nombre,
                p.descripcion,
                p.evolucion,
                p.id_tpokemon
            FROM pokemon p
        WHERE p.id_pokemon = ${id}
    `;
        const [rows] = await db.query(sql);
        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_DATO-DE-LA-Pokemons")
    }
}
//  METODO PARA OBTENER NOMBRE POR TIPO DE POKEMON
const obtenerPokemonPorTipoPokemonNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                p.id_pokemon,
                p.nombre,
                p.descripcion,
                p.evolucion,
                p.id_tpokemon
            FROM pokemon p
            JOIN tipo_pokemon tp ON p.id_tpokemon = tp.id_tpokemon
        WHERE tp.nombre like '${name}%'

    `;
       //EJECUTAMOS LA CONSULTA 
       const [rows] = await db.query(sql);
       res.json(
           {
               "ok": true,
               data: rows
           }
       );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-Pokemons-BUSQUEDA-POR-PLATAFORMA-POR-NOMBRE")
    }
}
//  METODO PARA OBTENER UN POKEMON POR NOMBRE
const obtenerPokemonNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                p.id_pokemon,
                p.nombre,
                p.descripcion,
                p.evolucion,
                p.id_tpokemon
            FROM pokemon p
        WHERE p.nombre like '${name}%'

    `;
       //EJECUTAMOS LA CONSULTA 
       const [rows] = await db.query(sql);
       res.json(
           {
               "ok": true,
               data: rows
           }
       );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-Pokemons-BUSQUEDA-POR-PLATAFORMA-POR-NOMBRE")
    }
}
//  METODO PARA EDITAR UNA Pokemons
const editarPokemon = async (req, res) => {

    try {
        const { id } = req.params;
        const body = matchedData(req);
        const { nombre, descripcion, evolucion, id_tpokemon} = req.body;
        const db = await database();
        const sql = `
            UPDATE Pokemon SET
                nombre = '${nombre}',
                descripcion = '${descripcion}',
                evolucion = ${evolucion},
                id_tpokemon = '${id_tpokemon}'
            WHERE id_pokemon = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);        
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar Pokemons");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  la Pokemons"
        });

    } catch (error) {
        return httpError(res, "Error al editar Pokemons");
    }
}
// METODO PARA ELIMINAR pokemons
const eliminarPokemon = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();
        const sql = `DELETE FROM pokemon WHERE id_pokemon = ${id}`;
        const [resultado] = await db.query(sql);

        if (!resultado.affectedRows) {
            return httpError(res, "No se pudo eliminar nada de la Pokemons");
        }

        return res.json(
            {
                "ok": true,
                "msj": "Pokemons fue eliminada correctamente"
            }
        )

    } catch (error) {
        return httpError(res, "ERROR EN DELETE Pokemons");
    }
}
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = { 
    obtenerPokemons,
    obtenerPokemon,
    obtenerPokemonNombre,
    obtenerPokemonPorTipoPokemonNombre,
    agregarPokemon,
    editarPokemon,
    eliminarPokemon            
}   