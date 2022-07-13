#!/usr/bin/env node

import fs from 'fs';
import { readFile } from 'fs/promises'
import { writeFile } from 'fs/promises'


const subcommand = process.argv[2]

// console.log(subcommand)

switch(subcommand){
    case 'read': {
        const itemIndex = process.argv[3]
        // fs.readFile('pets.json', 'utf-8', (str) => {
            //     const data = JSON.parse(str);
            //     console.log(data, 'data');
            // });
        readFile('pets.json', 'utf-8').then(str => {
            const data = JSON.parse(str);
            if ( itemIndex === undefined ){
                console.log(data);
            } else if( data[itemIndex] === undefined ){
                console.error('Usage: node pets.js read INDEX');
                process.exit(1)
            } else {
                console.log(data[itemIndex], 'data');
            }
        })
        break;
    }


    case 'create': {
        const ageValue = parseInt(process.argv[3]);
        const kindStr = process.argv[4];
        const nameStr = process.argv[5];
        
        const newAnimal = {age: ageValue, kind: kindStr, name: nameStr};
        if(nameStr === undefined || kindStr === undefined || ageValue === undefined){
            console.error('Usage: node pets.js create AGE KIND NAME');
            process.exit(1);
        }else{
        readFile('pets.json', 'utf-8').then(str => {
            const data = JSON.parse(str);
            data.push(newAnimal);
            let newData = JSON.stringify(data)
            writeFile('pets.json', newData).then(() =>{
            });
        })
        }    
        break;
    }


    case 'update':{
        const [,,, index, age, kind, name] = process.argv;
        readFile( 'pets.json', 'utf-8' ).then( str => {
            const data = JSON.parse( str );
            if ( data[index] ){
                const pet = data[index];
                pet.age = parseInt(age);
                pet.kind = kind;
                pet.name = name;
                writeFile('pets.json', JSON.stringify(data));  
                console.log(data)         
            } else {
                console.error('Usage: node pets.js update INDEX AGE KIND NAME');
                process.exit(1);
            }
        })
        break;
    }


    case 'destroy':{
        const itemIndex = process.argv[3]
        readFile('pets.json', 'utf-8').then(str => {
            const data = JSON.parse(str);
            if ( itemIndex === undefined ){
                console.error('Usage: node pets.js destroy INDEX');
                process.exit(1);
            } else if( data[itemIndex] === undefined ){
                console.error('Usage: node pets.js destroy INDEX');
                process.exit(1);
            } else {
                data.splice(itemIndex,1);
            }
            writeFile('pets.json', JSON.stringify(data));
            console.log(data)
        })
            break;
    }


    default: {
        console.error('Usage: node pets.js [read | create | update | destroy]');
        process.exit(1);
    }
}