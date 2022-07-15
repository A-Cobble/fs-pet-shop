import { readFile } from "fs/promises"
import { readPetsFile } from "./shared.js";
import express from "express"
import { writeFile } from "fs/promises"

//Dependencies
const app = express();
const PORT = 4000;
app.use(express.json());


//handle requests with routes
app.get('/pets', (req,res) => {
    readPetsFile().then((data) => {
        res.send(data)
    })
})

app.get('/pets/:id', (req,res) => {
   const index = req.params.id
    readPetsFile().then((data) => {
        if(data[index]){
            res.send(data[index])
        }else{
            res.sendStatus(404)
        }
    })
})

app.post('/pets', (req,res) => {
    const newPet = req.body
    readPetsFile().then((data) => {
        data.push(newPet)
        return writeFile("pets.json", JSON.stringify(data))
        .then(() => {
            res.send(newPet)
        })
    })
})

//listen on a port
app.listen(PORT, () => {
    console.log('Listening on Port 4000')
})


module.exports = app;