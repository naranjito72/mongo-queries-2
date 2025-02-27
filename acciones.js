// open cdm y buscamos directorio mongodb

C:\Program Files\MongoDB\Server\4.2>cd bin

// ya hemos creado el json en vsc y colocado en la carpeta json dentro de bin

// creación de la base de datos y una colección con db compass, comando en cdm para subir el json

C:\Program Files\MongoDB\Server\4.2\bin>mongoimport --db tienda_libreria --collection lista_libreria --file json/libreria.json

/* después de casi dos horas de pelea (creyendo que la construcción del json era erronea), decido analizar los comandos y la 

 la búsqueda me lleva al siguiente comando*/

 mongoimport --db tienda_libreria --collection lista_libreria --type json --file json/libreria.json --jsonArray

 //el terminal me indica que el tipo de documento y su ubicación son parametros incompatibles quedando

 mongoimport --db tienda_libreria --collection lista_libreria  --file json/libreria.json --jsonArray

 //y consiguiendo por fin, subir el json a la bbdd

// LINEAS COMANDOS TERMINAL mongo.exe
 
// ddbb

show dbs

//entrar en la db

use tienda_libreria

// ver colecciones

show collections

// enseñar toda la db

db.lista_libreria.find({}).pretty()

// enseñar sólo apellidos DATE

db.lista_libreria.find({"autor.apellidos" : "DATE"}, {"autor": 1, _id:0}).pretty()

// años 1998 o 2005

db.lista_libreria.find({$or : [ {"anyo" : "1998"}, {"anyo" : "2005"}]}).pretty()

// error al tratar de refactorizar

> db.lista_libreria.find({ "anyo" : { $or : ["1998", "2005"]}}).pretty()
Error: error: {
        "ok" : 0,
        "errmsg" : "unknown operator: $or",
        "code" : 2,
        "codeName" : "BadValue"
}

// me da correcto con el comando $in

db.lista_libreria.find({ "anyo" : { $in : ["1998", "2005"]}}).pretty()

// búsqueda de sólo una cantidad d elementos .count()

db.lista_libreria.find({"editorial" : "Addison‐Wesley"}).count()
0

/*Realizando una revisión me he dado cuenta que la formulación anterior no es correcta , ¿por qué?*/

db.lista_libreria.count({"editorial" : "Addison-Wesley"})
3
/* En el ejemplo anterior, la formulación de shell me acepta sólamente la segunda variable
y sin embargo en el ejemplo que coloco


db.restaurants.find({"cuisine" : "American "}).count() 

output:db.restaurants.find({"cuisine" : "American "}).count();
6183

PREGUNTAR A RAUL
*/

// tercera posicion del array

db.lista_libreria.getIndexes(2)
[
        {
                "v" : 2,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "tienda_libreria.lista_libreria"
        }
]
/*PREGUNTAR A RAUL. Debo leer y entender mejor la funcion getIndexes. Veo que me devuelve un Array con key:values
pero no entiendo el return. ¿Qué es v? ¿key:value con el _id?¿ns con el nombre de la db y la colección? */
// Este es el libro en la tercera posicion, pero no me convence la forma a la que he accedido

db.lista_libreria.find({"_id": ObjectId("5d876787f6a13ccd5ee7015b")}).pretty()
{
        "_id" : ObjectId("5d876787f6a13ccd5ee7015b"),
        "titulo" : "Introducci�n a las Bases de Datos",
        "edicion" : 1,
        "autor" : {
                "apellidos" : "Pons",
                "nombre" : "O."
        },
        "editorial" : "Thomson",
        "anyo" : "2005",
        "precio" : 100.25
}
db.lista_libreria.find().limit(1).skip(2).pretty()//correcto

// acceder a un campo sin escribir su valor
// el problema es que me devuelve todos los datos

db.lista_libreria.find({titulo : { $exists: true}}).pretty()

// llamada a sólo un campo dando por sentado que existe

> db.lista_libreria.distinct("titulo")
[
        "Fundamentos de Sistemas de Bases de Datos",
        "Introducci�n a los Sistemas de Bases de Datos ",
        "Introducci�n a las Bases de Datos",
        "Bases de Datos"
]
/* no consigo unir los campos "autor " y "titulo" en la misma funcion, muy poca documentacion al respecto
No hay problemas para que, dano nosotros los valores de los campos, nos oredene o muestre la lista,
pero colocar dos campos vacios (entiendo que debo utilizar las query $and o $in) there is no bloody fucking way, jezzus */

// no recordé los aggregate y groups

db.lista_libreria.aggregate( [ { $group: { _id : 0, titulo : { $addToSet: "$titulo"}, autor : { $addToSet : "$autor"} } } ] ).pretty()
{
        "_id" : 0,
        "titulo" : [
                "Introducci�n a las Bases de Datos",
                "Fundamentos de Sistemas de Bases de Datos",
                "Introducci�n a los Sistemas de Bases de Datos ",
                "Bases de Datos"
        ],
        "autor" : [
                {
                        "apellidos" : "Pons",
                        "nombre" : "O."
                },
                {
                        "apellidos" : "ELMASRI,",
                        "nombre" : "R.A."
                },
                {
                        "apellidos" : "DATE",
                        "nombre" : "C.J."
                },
                [
                        {
                                "apellidos" : "Alonso",
                                "nombre" : "S."
                        },
                        {
                                "apellidos" : "Alarcon",
                                "nombre" : "P."
                        },
                        {
                                "apellidos" : "Bollain",
                                "nombre" : "M."
                        }
                ],
                [
                        {
                                "apellidos" : "Santos",
                                "nombre" : "E."
                        },
                        {
                                "apellidos" : "Garcia",
                                "nombre" : "A."
                        },
                        {
                                "apellidos" : "Alonso",
                                "nombre" : "S."
                        },
                        {
                                "apellidos" : "Alarcon",
                                "nombre" : "P."
                        },
                        {
                                "apellidos" : "Garbajosa",
                                "nombre" : "J."
                        }
                ]
        ]
}
// libros con posteriodidad al 2004

db.lista_libreria.find({"anyo" : { $gte : "2004" }}, {"titulo":1, "_id":0} ).pretty()
{
        "_id" : ObjectId("5d876787f6a13ccd5ee70159"),
        "titulo" : "Fundamentos de Sistemas de Bases de Datos",
        "edicion" : 1,
        "autor" : {
                "apellidos" : "ELMASRI,",
                "nombre" : "R.A."
        },
        "editorial" : "Addison-Wesley",
        "anyo" : "2007",
        "precio" : 45.25
}
{
        "_id" : ObjectId("5d876787f6a13ccd5ee7015b"),
        "titulo" : "Introducci�n a las Bases de Datos",
        "edicion" : 1,
        "autor" : {
                "apellidos" : "Pons",
                "nombre" : "O."
        },
        "editorial" : "Thomson",
        "anyo" : "2005",
        "precio" : 100.25
}
{
        "_id" : ObjectId("5d876787f6a13ccd5ee7015c"),
        "titulo" : "Fundamentos de Sistemas de Bases de Datos",
        "edicion" : 2,
        "autor" : {
                "apellidos" : "ELMASRI,",
                "nombre" : "R.A."
        },
        "editorial" : "Addison-Wesley",
        "anyo" : "2011",
        "precio" : 50
}
{
        "_id" : ObjectId("5d876787f6a13ccd5ee7015d"),
        "titulo" : "Bases de Datos",
        "edicion" : 2,
        "autor" : [
                {
                        "apellidos" : "Alonso",
                        "nombre" : "S."
                },
                {
                        "apellidos" : "Alarcon",
                        "nombre" : "P."
                },
                {
                        "apellidos" : "Bollain",
                        "nombre" : "M."
                }
        ],
        "editorial" : "ETSISI",
        "anyo" : "2010",
        "precio" : 25
}

// ahora pruebo con aggregate y group

db.lista_libreria.find({"anyo" : { $gte : "2004" }} ).distinct('titulo')pretty()
2019-09-23T20:19:32.219+0200 E  QUERY    [js] uncaught exception: SyntaxError: unexpected token: identifier :
@(shell):1:72

//ERROR!!
// refactorización del método sin aggregate

> db.lista_libreria.distinct( "titulo", {"anyo" : { $gt: "2004" } } )
[
        "Fundamentos de Sistemas de Bases de Datos",
        "Introducci�n a las Bases de Datos",
        "Bases de Datos"
]
/*!important los espacios entre las comillas las entiende como lenght y si no se colocan correctamente puede dar lugar a error */

db.lista_libreria.distinct( "titulo ", { "anyo" : { $gt: "2004" } } )
[ ]
// devuelve una array vacia al no encontrar el campo "titulo "(field=="titulo")

// buscar los libros 2001 +50€

db.lista_libreria.distinct( "titulo", { "anyo": { $gt: "2001" }, { "precio": { $gt: 50 } } } )
2019-09-23T20:39:48.803+0200 E  QUERY    [js] uncaught exception: SyntaxError: expected property name, got '{' :
@(shell):1:65
// error!

db.lista_libreria.distinct( "titulo", {  "precio": { $gt: 50 } } )
[
        "Introducci�n a los Sistemas de Bases de Datos ",
        "Introducci�n a las Bases de Datos"
]// devuelve los titulos +50, pero no me pide los titulos
// y falta 2001
// devolución CANTIDAD de libros 2001 +50

db.lista_libreria.aggregate([
        {$match: { $and: [ 
            { "anyo": { $gte : "2001"}},
            { "precio": { $gte : 50}}
           ]
          }
         },
         { $group: { _id: null, count: { $sum: 1 }}}
         ]
)  ;

{
        "_id" : null,
        "count" : 3.0
    }
// devolucion con los titulos

db.lista_libreria.aggregate([
        {$match: { $and: [ 
            { "anyo": { $gte : "2001"}},
            { "precio": { $gte : 50}}
           ]
          }
         },
         { $group: { _id: null, 
             count: { $sum: 1 },
             titulo: { $addToSet : "$titulo"}}}
         ]
)  ;
"_id" : null,
"count" : 3.0,
"titulo" : [ 
    "Fundamentos de Sistemas de Bases de Datos", 
    "Introducci�n a los Sistemas de Bases de Datos ", 
    "Introducci�n a las Bases de Datos"
]
}
// libros editorial Addison-Wesley despues ($gt) 2005
db.lista_libreria.aggregate([
        {$match: { $and: [
            { "anyo": {$gt: "2005"}},
            { "editorial": "Addison-Wesley"}
            ]
            }
            },
            {$group: { _id: null,
                count: { $sum: 1},
                titulo: { $addToSet: "$titulo"}}}
        ] 
             );
/* 1 */
{
        "_id" : null,
        "count" : 2.0,
        "titulo" : [ 
            "Fundamentos de Sistemas de Bases de Datos"
        ]
    }
// título de libro y editorial para aquellos libros que tengan un precio superior a 50€

db.lista_libreria.aggregate([
        { $match: { "precio": { $gt: 50}
            }
            }
        ,
            { $group: { _id: null,
                count: { $sum: 1},
                titulo: { $addToSet: "$titulo"},
                editorial: { $addToSet: "$editorial"}}}
       ] 
  );
/* 1 */
{
        "_id" : null,
        "count" : 2.0,
        "titulo" : [ 
            "Introducci�n a los Sistemas de Bases de Datos ", 
            "Introducci�n a las Bases de Datos"
        ],
        "editorial" : [ 
            "Thomson", 
            "Addison-Wesley"
        ]
    }

// encuentra lista 2005 
db.lista_libreria.aggregate([
{ $match: { $and: [
    { "anyo": { $gt: "2005"}},
    ]
    }
    },
    {$group: { _id: null,
         count: { $sum: 1},
         titulo: { $addToSet: "$titulo"},
         autor: { $addToSet: "$autor"}}}
]);
/* 1 */
{
        "_id" : null,
        "count" : 4.0,
        "titulo" : [ 
            "Fundamentos de Sistemas de Bases de Datos", 
            "Bases de Datos", 
            "Introducci�n a las Bases de Datos"
        ]
        "autor" : [ 
                {
                    "apellidos" : "ELMASRI,",
                    "nombre" : "R.A."
                }, 
                [ 
                    {
                        "apellidos" : "Alonso",
                        "nombre" : "S."
                    }, 
                    {
                        "apellidos" : "Alarcon",
                        "nombre" : "P."
                    }, 
                    {
                        "apellidos" : "Bollain",
                        "nombre" : "M."
                    }
                ], 
                {
                    "apellidos" : "Pons",
                    "nombre" : "O."
                }
            ]
        }
  // listas 1998 y +2005
  db.lista_libreria.aggregate([
        { $match: { $or: [
            { "anyo":  { $eq: "1998"}},
            { "anyo": { $gte: "2005"}}]}
        },
            {$group: { _id: "$anyo",
                 count: { $sum: 1},
                 titulo: { $addToSet: "$titulo"},
                 autor: { $addToSet: "$autor"}}}
        ]);
   /* 1 */
{
        "_id" : "2005",
        "count" : 1.0,
        "titulo" : [ 
            "Introducci�n a las Bases de Datos"
        ],
        "autor" : [ 
            {
                "apellidos" : "Pons",
                "nombre" : "O."
            }
        ]
    }
    
    /* 2 */
    {
        "_id" : "2007",
        "count" : 1.0,
        "titulo" : [ 
            "Fundamentos de Sistemas de Bases de Datos"
        ],
        "autor" : [ 
            {
                "apellidos" : "ELMASRI,",
                "nombre" : "R.A."
            }
        ]
    }
    
    /* 3 */
    {
        "_id" : "2011",
        "count" : 1.0,
        "titulo" : [ 
            "Fundamentos de Sistemas de Bases de Datos"
        ],
        "autor" : [ 
            {
                "apellidos" : "ELMASRI,",
                "nombre" : "R.A."
            }
        ]
    }
    
    /* 4 */
    {
        "_id" : "2010",
        "count" : 1.0,
        "titulo" : [ 
            "Bases de Datos"
        ],
        "autor" : [ 
            [ 
                {
                    "apellidos" : "Alonso",
                    "nombre" : "S."
                }, 
                {
                    "apellidos" : "Alarcon",
                    "nombre" : "P."
                }, 
                {
                    "apellidos" : "Bollain",
                    "nombre" : "M."
                }
            ]
        ]
    }
    
    /* 5 */
    {
        "_id" : "1998",
        "count" : 1.0,
        "titulo" : [ 
            "Bases de Datos"
        ],
        "autor" : [ 
            [ 
                {
                    "apellidos" : "Santos",
                    "nombre" : "E."
                }, 
                {
                    "apellidos" : "Garcia",
                    "nombre" : "A."
                }, 
                {
                    "apellidos" : "Alonso",
                    "nombre" : "S."
                }, 
                {
                    "apellidos" : "Alarcon",
                    "nombre" : "P."
                }, 
                {
                    "apellidos" : "Garbajosa",
                    "nombre" : "J."
                }
            ]
        ]
    }       
//titulo, editorial 
db.lista_libreria.aggregate([

    {$group:{ _id:"$titulo", num_ediciones:{$sum:1}}},
    {$match:
        {"num_ediciones":{$gt:1}}
    }
])

//pintar

let libros = db.libros.aggregate([

    {$group:{ _id:"$titulo", num_ediciones:{$sum:1}}},
    {$match:
        {"num_ediciones":{$gt:1}}
    }
])

libros.forEach
