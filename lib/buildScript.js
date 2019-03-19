const cheerio = require('cheerio');

const scriptStrs = {
    beginScript: '#!/bin/bash',
    beginFormat: (esc, fg, bg) => `\\${esc}[38;5;${fg};48;5;${bg}m`,
    endFormat: (esc) => `\\${esc}[0m`,
    resizeWindow: (esc, xAxis, yAxis) =>`printf '\\${esc}[8;${yAxis};${xAxis}t'`,
    newLine: '\n',
    printfBegin: 'printf \'',
    printfEnd: '\'',
    //(?<=\#) is a look behind for #, then capture next 3 alphanumeric (\w) chars
    getColorsRegexp: /(?<=\#)(\w{3})/g
};

exports.buildScript = ($mainDiv, esc, cb) => {
    let scriptStr = scriptStrs.beginScript + scriptStrs.newLine;

    //loading a new dom in this class with the html method from the passed in cheerio object
    let $ = cheerio.load($mainDiv.html());

    let $firstSpan = $($('span')[0]);
    //we take the length of the first span, add the length of the rest until line break to find width
    let xAxis = $firstSpan.text().length + $firstSpan.nextUntil('br').text().length;
    //check line breaks to find height
    let yAxis = $('br').length;
    //put axi values into printf statement to resize terminal window
    let windowSize = scriptStrs.resizeWindow(esc, xAxis, yAxis);

    scriptStr += windowSize + scriptStrs.newLine;

    let children = $mainDiv.children();

    let count = children.length;

    let currentLine = scriptStrs.printfBegin;

    children.each(function(i, elem) {
        let $el = $(this);

        if($el.is('span')) {
          currentLine += formatLine($el, esc);
        } else if($el.is('br')) {
          //end current prinf statement, add newline char
          currentLine += scriptStrs.printfEnd + scriptStrs.newLine;
          //append current line of script to whole
          scriptStr += currentLine;
          //if not last line, start off next line
          if(i < (count - 1)) {
            currentLine = scriptStrs.printfBegin;
          }
        }
    });

    //console.log(scriptStr);
    return cb(scriptStr, null);
}

const formatLine = ($spanEl, esc) => {
    let style = $spanEl.attr('style');
    //escape special chars in text
    let text = $spanEl.text();
    //faster than .replace(/%/g)
    text = text.split('%').join('%%');

    if(style === null && text === null) {
        return '';
    }
    else if(style === null && text !== null) {
        return text;
    }

    let colors = style.match(scriptStrs.getColorsRegexp);

    if(colors.length !== 2)
    {
        console.log('Unable to parse color info from element.');
        return text;
    }

    let fg = parseColorAndNormalize(colors[0]);
    let bg = parseColorAndNormalize(colors[1]);

    return scriptStrs.beginFormat(esc, fg, bg) + text + scriptStrs.endFormat(esc);
}

//fn to parse the integr from a color hex code and normalize it on a scale of 0-240 + 16
//this is to account for the 256 bash color codes plus the first 16 that do not follow the color spectrum
const parseColorAndNormalize = (hexColor) => {
    let int = parseInt(hexColor, 16);

    let normalizedInt = normalizeInt(int, 0, 240) + 16;

    return Math.round(normalizedInt);
}

const normalizeInt = (val, max, min) => { return (val - min) / (max - min); }
