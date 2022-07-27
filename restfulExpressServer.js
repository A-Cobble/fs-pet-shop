import { readPetsFile } from "./shared.js";
import express from "express";
import { writeFile } from "fs/promises";
import pg from "pg";
import { readSync } from "fs";
import basicAuth from 'express-basic-auth';

const pool = new pg.Pool({
    database: "petshop"
});

//Dependencies
/////////////////////////////////////////////////////////////////////////
const app = express();
const PORT = 4000;
app.use(express.json());

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
    next();
}

app.use(basicAuth({
    users: { 'admin':'meowmix' },
    challenge: true,
    realm: "Required"
}), (res, req,next) =>{
    res.send('Unauthorized')
})


//handle requests with routes
/////////////////////////////////////////////////////////////////////////

// app.get('/pets', (req,res, next) => {
//     readPetsFile().then((data) => {
//         res.send(data)
//     })
//     .catch(next)
// })


// app.get('/pets/:id', (req,res, next) => {
//    const index = req.params.id
//     readPetsFile().then((data) => {
//         if(data[index]){
//             res.send(data[index])
//         } else {
//             res.sendStatus(404)
//         }
//     })
//     .catch(next)
// })


// app.post('/pets', (req,res, next) => {
//     const newPet = req.body
//     newPet.age = Number(newPet.age)
//     readPetsFile().then((data) => {
//         if(newPet.age && newPet.kind && newPet.name){
//             data.push(newPet);
//             return writeFile("pets.json", JSON.stringify(data))
//             .then(() => res.status(201).send(newPet))
//         } else {
//             res.sendStatus(400)
//         }
//     })
//     .catch(next)
// });


// app.patch("/pets/:index", (req, res, next) => {
//     const petIndex = req.params.index;
//     const changing = req.body
//     changing.age = Number(changing.age);
//     readPetsFile().then((data) => {
//         if(data[petIndex] === undefined){
//             res.sendStatus(404)
//         }
//         if(changing.name){
//             data[petIndex].name = changing.name;
//             console.log(data[petIndex.name])
//         } else if (changing.kind){
//             data[petIndex].kind = changing.kind;
//             console.log(data[petIndex.kind])
//         } else if (changing.age){
//             data[petIndex].age = changing.age;
//             console.log(data[petIndex.age])
//         } else {
//             res.sendStatus(400);
//         }
//         return writeFile("pets.json", JSON.stringify(data))
//         .then(() => res.send(data[petIndex])) 
//     })
//     .catch(next)
// })


// app.delete('/pets/:value', (req, res, next) => {
//     const deleteIndex = req.params.value;
//     readPetsFile().then((data) => {
//         if(data[deleteIndex] === undefined){
//             res.sendStatus(404)
//         }else{

//         data.splice(deleteIndex,1);
//         return writeFile('pets.json', JSON.stringify(data))
//         .then(() => res.send(data))
//         }
//     })
//     .catch(next)
// })


app.get('/pets', (req,res,next) => {
    pool.query("SELECT * FROM pets").then((data) => {
        res.send(data.rows);
    })
    .catch(next);
})


app.get('/pets/:id', (req,res, next) => {
    const id =req.params.id;
    pool.query(`SELECT * FROM pets WHERE id = $1;`, [id]).then((data)=> {
        const pet = data.rows[0];
        if(pet){
            res.send(pet);
        }
    })
    .catch(next)
})


app.post('/pets', (req,res, next) => {
    const newPet = req.body
    newPet.age = Number(newPet.age)
    if(newPet.age && newPet.kind && newPet.name){
        pool.query('INSERT INTO pets(name, kind, age) VALUES($1, $2, $3);', [newPet.name, newPet.kind, newPet.age]).then((data)=> {
            res.status(201).send(newPet)
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
}) 


app.patch("/pets/:id", (req, res, next) => {
    const { id } = req.params;
    const { name, age, kind } = req.body;
    if (Number.isNaN(id)){
        res.sendStatus(400)
    }
    if(age || kind || name){
        pool.query('UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind) WHERE id = $4 RETURNING *;', [name, age, kind, id]).then((data)=> {
            // res.status(200).send(data.rows[0])
            if(data.rows.length === 0){
                res.sendStatus(404);
            }else {
                res.status(200).send(data.rows[0])
            }
        }).catch(next);
    }else{
        res.sendStatus(400);
    }
})


app.delete('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query("DELETE FROM pets WHERE id = $1 RETURNING *;", [id]).then((data)=> {
        if(data.rows.length === 0 ){
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    })
    .catch(next)
})


//listen on a port
app.listen(PORT, () => {
    console.log('Listening on Port 4000')
})

app.use(unknownHTTP)
// module.exports = app;


app.use((err, req, res, next) => {
    res.sendStatus(500);
});







// function executeQuery(){
//     pool.query("SELECT * FROM pets").then((res) => {
//         const firstPet = res.rows[0];
//         return pool.query("SELECT * FROM pets WHERE id = $1", [firstPet.id]);
//     })
//     .then((data) => {
//         console.log(data.rows);
//     })
// }

// executeQuery()


// async function executeQueryAsync(){
//     const res = await pool.query("SELECT * FROM pets");
//     const firstPet = res.rows[0];
//     const pet = await pool.query("SELECT * FROM pets WHERE id = $1", [firstPet.id]);
//     console.log(pet.rows[0]);
// }
// try {
//     executeQueryAsync();
// }catch (e) {

// }