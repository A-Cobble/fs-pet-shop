import http from "http";
// import fs from "fs";
import { readPetsFile } from "./shared.js";
import fs from "fs/promises";

const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {
    const matches = req.url.match(petRegExp);

    if (req.url === "/pets" && req.method === "GET") {
        readPetsFile().then( (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
        })

    } else if (matches && req.method === "GET"){
        const id = matches [1];
            readPetsFile().then((data) => {
                if (data[id]){
                    res.end(JSON.stringify(data[id]))
                }else {
                    res.writeHead(404);
                    res.end();
                }
            });

        } else if (req.url === "/pets" && req.method === "POST"){
            let body ="";
            req.on("data", (chunk) => {
                body += chunk;
            })
            req.on("end", () => {
                const newPet = JSON.parse(body);
                    readPetsFile().then((data) => {
                        data.push(newPet);
                        return fs
                        .writeFile("pets.json", JSON.stringify(data))    
                        .then(() => {
                            res.setHeader("Content-type", "applicaton/json");
                            res.end(JSON.stringify(newPet));
                        });
                    });
                })
            }else{
                res.writeHead(404);
                res.end();
            }
        })
        
        server.listen(3000, () => {
            console.log("server started on port 3000");
        })

