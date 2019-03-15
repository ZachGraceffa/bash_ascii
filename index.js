//setting base dir for modules
global.__basedir = __dirname;

const libCD = require('./lib/createDocument.js');
const fs = require('fs');

let htmlLoc = '';
let esc = 'e';

for (i = 2; i < process.argv.length; i++) {
    if(process.argv[i] === '-c' & process.argv.length >= i + 1) {

        if(process.argv[i + 1] === undefined) {
            console.log("No file specified");
            return;
        }

        htmlLoc = process.argv[i + 1];
    }
    else if(process.argv[i] === '-e' & process.argv.length >= i + 1)
    {
        esc = process.argv[i + 1];
    }
}

console.log("Creating bash script");
var document = libCD.createDocument(htmlLoc, esc);
