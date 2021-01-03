const fetch = require('node-fetch');
const cheerio = require('cheerio');
const epub = require('epub-gen');

const repCssConfig = {
  "authors": "data-css-w52rh7",
  "title": "data-css-2m9n2p",
  "article": "data-css-88vvl0",
  "elementParagraph": "data-css-aphf9g",
  "elementTitle": "data-css-153qrt7"
};

const url = 'https://www.republik.ch/2021/01/02/das-faschistische-missverstaendnis';
//const url = 'https://www.republik.ch/2020/12/31/ein-jahresend-gespraech-aus-dem-jenseits';

fetch(url)
    .then(res => res.text())
    .then(body => {
        $ = cheerio.load(body);
        var metadata = {
            authors: $('p[' + repCssConfig.authors + ']', body).text(),
            title: $('h1[' + repCssConfig.title + ']', body).text()
        };
        var article = $('div[' + repCssConfig.article + ']');

        var elements = [];
        article.children().each(function (i, elem) {
            if (elem.attribs[repCssConfig.elementParagraph] !== undefined || elem.attribs[repCssConfig.elementTitle] !== undefined) {
                elements.push({
                    "struct": elem.name,
                    "contentHTML": $(elem).html(),
                    "contentText": $(elem).text()
                });
            }
        });
        const content = []
        for (let i = 0; i < elements.length; i += 1) {
            if (elements[i].struct !== "h2") {
                if (i === 0) {
                    content.push({
                        title: metadata.title,
                        data: "<" + elements[i].struct + ">" + elements[i].contentHTML + "</" + elements[i].struct + ">"
                    });
                } else {
                    content[content.length - 1].data += "\n<" + elements[i].struct + ">" + elements[i].contentHTML + "</" + elements[i].struct + ">"
                }
            } else {
                content.push({
                    title: elements[i].contentText,
                    data: ""
                });
            }
        }
        const options = {
            title: metadata.title,
            author: metadata.authors,
            output: './test_epubs/republik_artikel.epub',
            content
        };
        return new epub(options).promise;
    })
    .then(() => console.log('Done'))
    .catch(function(err){
      console.log(err);
      //handle error
    });