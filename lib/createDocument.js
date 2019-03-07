const fs = require('fs');
const cheerio = require('cheerio');
const libScr = require('./buildScript.js');

const createDocument = function(loc) {

    if(!loc.endsWith(".html")) {
        console.log("File must have html extension");
    }

    fs.readFile(loc, 'utf-8' ,function(err, buf) {
        if(err)
        {
            console.log("Unable to read read file.");
            return;
        }

        let $ = cheerio.load(buf.toString());

        var mainDiv = $('div');

        if(mainDiv !== null && mainDiv.html() !== null) {
            console.log("Found Main Div");

            var scriptString = libScr.buildScript(mainDiv);
        }

    });

    return;
}

exports.createDocument = createDocument;
