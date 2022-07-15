import { readPetsFile } from "./shared.js";
import express from "express"
import { writeFile } from "fs/promises"

//Dependencies
const app = express();
const PORT = 4000;
app.use(express.json());
const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
    next();
}

//handle requests with routes
app.get('/pets', (req,res, next) => {
    readPetsFile().then((data) => {
        res.send(data)
    })
    .catch(next)
})

app.get('/pets/:id', (req,res, next) => {
   const index = req.params.id
    readPetsFile().then((data) => {
        if(data[index]){
            res.send(data[index])
        }else{
            res.sendStatus(404)
        }
    })
    .catch(next)
})

app.post('/pets', (req,res, next) => {
    const newPet = req.body
    newPet.age = Number(newPet.age)
    readPetsFile().then((data) => {
        if(newPet.age && newPet.kind && newPet.name){
            data.push(newPet);
            return writeFile("pets.json", JSON.stringify(data))
            .then(() => res.send(newPet))
        } else {
            res.sendStatus(400)
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