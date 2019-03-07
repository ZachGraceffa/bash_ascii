const cheerio = require('cheerio');

const buildScript = function(mainDiv) {
    let scriptStr = '';

    //loading a new dom in this class with the html method from the passed in cheerio object
    let $ = cheerio.load(mainDiv.html());

    let $firstSpan = $($('span')[0]);
    let xAxis = $firstSpan.text().length + $firstSpan.nextUntil('br').text().length;
    let yAxis = $('br').length;
    let windowSize = `printf '\e[8;${yAxis};${xAxis}t'`;

    console.log(windowSize);

    $().children().each(function(i, elem) {
      let $el = $(this);

      if($el.is('br')) {
          //console.log('y');
      }
    });
}

exports.buildScript = buildScript;
