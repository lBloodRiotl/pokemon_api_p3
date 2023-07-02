// Obtenemos el metodo Router de express
const database = require('../config/basedatos');
const { httpError } = require('../utils/error');
const { obtenerData } = require('../middlewares/auth');
//CONTROLADORES
const obtenerTipokemons = async (req, res) => {
    try {
        const db = await database();
        //  METODO PARA OBTENER TODAS LAS TipoPkemons
        const sql = `
        SELECT 
                t.id_tpokemon,
                t.nombre
        FROM tipo_pokemon t
        `;
        //EJECUTAMOS LA CONSULTA
        const [rows] = await db.query(sql);
        //RETORNAMOS LA RESPUESTA
        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        httpError(res, "ERROR_GET_TipoPkemons");
    }
}
//  METODO PARA AGREGAR UNA TipoPkemon
const agregarTipokemon = async (req, res) => {

    try {
        const { nombre } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();

        const sql = `
            INSERT INTO tipo_pokemon(nombre, id_user)
            VALUES('${nombre}', ${id_usuario})
        `;
        // EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada de la TipoPkemon"
                }
            );
        }
        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_TipoPkemon")
    }
}
//  METODO PARA OBTENER UN TipoPkemon
const obtenerTipokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                t.id_tpokemon,
                t.nombre
        FROM tipo_pokemon t
        WHERE t.id_tpokemon = ${id}
    `;

        const [rows] = await db.query(sql);

        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-TipoPkemon")
    }
}
//  METODO PARA OBTENER UN TipoPkemon POR NOMBRE
const obtenerTipokemonNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                t.id_tpokemon,
                t.nombre
        FROM tipo_pokemon t
        WHERE t.nombre like '${name}%'

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
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-TipoPkemon-POR-NOMBRE")
    }
}
// Metodos para editar
const editarTipokemon = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, estado} = req.body;
        const db = await database();
        const sql = `
            UPDATE tipo_pokemon SET
                nombre = '${nombre}'
            WHERE id_tpokemon = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar TipoPkemon");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  la TipoPkemon"
        });
    } catch (error) {
        return httpError(res, "Ocurrio algo en PUT TipoPkemon");
    }
}
// Metodos para eliminar
const eliminarTipokemon = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();
        const sql = `DELETE FROM tipo_pokemon WHERE id_tpokemon = ${id}`;
        const [resultado] = await db.query(sql);

        if (!resultado.affectedRows) {
            return httpError(res, "No se pudo eliminar nada de la TipoPkemon");
        }

        return res.json(
            {
                "ok": true,
                "msj": "TipoPkemon fue eliminada correctamente"
            }
        )

    } catch (error) {
        return httpError(res, "ERROR EN DELETE TipoPkemon");
    }
}
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = {  
    obtenerTipokemons,
    obtenerTipokemon,
    obtenerTipokemonNombre,
    agregarTipokemon,
    editarTipokemon,
    eliminarTipokemon           
}