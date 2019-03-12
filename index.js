//setting base dir for modules
global.__basedir = __dirname;

const libCD = require('./lib/createDocument.js');
const fs = require('fs');

if(process.argv[2] === undefined) {
    //todo help section
    console.log("Must pass in arguments, like -c to create from file.");
} else if(process.argv[2] === '-c') {

    if(process.argv[3] === undefined) {
        console.log("No file specified");
        return;
    }

    console.log("Creating bash script");

    var document = libCD.createDocument(process.argv[3]);
}
else {
    console.log("Unrecognized input.");
}
