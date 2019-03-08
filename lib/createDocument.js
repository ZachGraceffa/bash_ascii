const fs = require('fs');
const cheerio = require('cheerio');
const libScr = require('./buildScript.js');

exports.createDocument = (loc) => {

    if(!loc.endsWith(".html")) {
        console.log("File must have html extension");
    }

    fs.readFile(loc, 'utf-8' , (err, buf) => {
        if(err)
        {
            console.log("Unable to read read file.");
            return;
        }

        let $ = cheerio.load(buf.toString());

        let mainDiv = $('div');

        if(mainDiv !== null && mainDiv.html() !== null) {
            console.log("Found Main Div");

            let scriptString = libScr.buildScript(mainDiv);
        }

    });

    return;
}
