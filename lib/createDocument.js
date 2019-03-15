const fs = require('fs');
const cheerio = require('cheerio');
const libScr = require('./buildScript.js');
const scriptDir = global.__basedir + '/tmp';

exports.createDocument = (loc, esc) => {

    if(!loc.endsWith('.html')) {
        console.log('File must have html extension');
    }

    fs.readFile(loc, 'utf-8' , (err, buf) => {
        if(err)
        {
            console.log('Unable to read read file.');
            return;
        }

        let $ = cheerio.load(buf.toString());

        let mainDiv = $('div');

        if(mainDiv !== null && mainDiv.html() !== null) {
            console.log('Found Main Div');

            libScr.buildScript(mainDiv, esc, cb);
        }
        else {
            return console.log('Cannot find main div, aborting script creation.');
        }

    });

    return;
}

const cb = (scriptStr, scriptErr) => {
        if(scriptErr) {
            return console.log(scriptErr);
        }

        if (!fs.existsSync(scriptDir)) {
            fs.mkdirSync(scriptDir);

            console.log("Created script output directory " + scriptDir);
        }

        let scriptName = scriptDir + '/script.sh';
        fs.writeFile(scriptName, scriptStr, function(fileErr) {
            if(fileErr) {
                return console.log(fileErr);
            }

            console.log('The file was saved to ' + scriptName + '!');
        });
};
