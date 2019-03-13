const cheerio = require('cheerio');

//helper strings
const newLine = '\n';
const printfBegin = 'printf \'';
const printfEnd = '\'';

exports.buildScript = ($mainDiv, cb) => {
    let scriptStr = '#!/bin/bash' + newLine;

    //loading a new dom in this class with the html method from the passed in cheerio object
    let $ = cheerio.load($mainDiv.html());

    let $firstSpan = $($('span')[0]);
    //we take the length of the first span, add the length of the rest until line break to find width
    let xAxis = $firstSpan.text().length + $firstSpan.nextUntil('br').text().length;
    //check line breaks to find height
    let yAxis = $('br').length;
    //put axi values into printf statement to resize terminal window
    let windowSize = `printf '\e[8;${yAxis};${xAxis}t'`;

    scriptStr += windowSize + newLine;

    let children = $mainDiv.children();

    let count = children.length;

    let currentLine = printfBegin;

    children.each(function(i, elem) {
        let $el = $(this);

        if($el.is('span')) {
          currentLine += formatLine($el);
        } else if($el.is('br')) {
          //end current prinf statement, add newline char
          currentLine += printfEnd + newLine;
          //append current line of script to whole
          scriptStr += currentLine;
          //if not last line, start off next line
          if(i < (count - 1)) {
            currentLine = printfBegin;
          }
        }
    });

    //console.log(scriptStr);
    return cb(scriptStr, null);
}

const formatLine = ($spanEl) => {
    let style = $spanEl.attr('style');
    //escape special chars in text
    let text = $spanEl.text();
    //faster than .replace(/%/g)
    text = text.split('%').join('%%');

    if(style === null && text === null) {
        return '';
    }
    else if(text !== null) {
        return text;
    }
}
