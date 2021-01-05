const { program } = require('commander');
program.version('0.2');

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const epub = require('epub-gen');
const crypto = require('crypto');

program
  .option('-u, --url <url>', 'URL to generate EPUB file from, will provide you with a hash to get the EPUB')
  .option('-h, --hash <hash>', 'Short hash to download a prepared EPUB file');

program.on('--help', () => {
    console.log('');
    console.log('You have to provide either an <url> or a <hash> to run the program.');
    console.log('');
  });

program.parse(process.argv);

if (program.url) {
    let url = "";
    try {
        url = new URL(program.url);
    } catch (e) {
        try {
            url = new URL("https://" + program.url);
        } catch (e) {
            console.log('Error: only valid URLs are allowed: https://...');
            program.help();
        }
    }
    runUrl(url);
} else if (program.hash) {
    console.log(`- ${program.hash}`);
} else {
    program.help();
}

function runUrl(url) {
    const re = /^(http:\/\/|https:\/\/)?(www\.)?([^\/]+)(\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/([^\?^#^\/]+)).*$/ig;
    const urlFlavor = re.exec(program.url);
    if (null !== urlFlavor && urlFlavor.length > 2 && urlFlavor[3] === 'republik.ch') {
        runRepublik('https://republik.ch' + urlFlavor[4]);
    } else {
        console.log('Error: only article URLs for the magazine called "Republik" allowed: https://www.republik.ch/yyyy/mm/dd/...');
        program.help();
    }
}

function runRepublik(sanitized_url) {
    // only sanitized Urls!
    console.log('epubbing from republik.ch: ' + sanitized_url);
    const repCssConfig = {
        "authors": "data-css-w52rh7",
        "title": "data-css-2m9n2p",
        "article": "data-css-88vvl0",
        "elementParagraph": "data-css-aphf9g",
        "elementTitle": "data-css-153qrt7"
    };

    let filename = '';

    fetch(sanitized_url)
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
            const content = [];
            const hash = crypto.createHash('sha256');
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
                    hash.update(content[content.length - 1].data);
                } else {
                    content.push({
                        title: elements[i].contentText,
                        data: ""
                    });
                }
            }
            filename = hash.digest('hex').substr(0, 7);
            const options = {
                title: metadata.title,
                author: metadata.authors,
                output: './test_epubs/republik_' + filename + '.epub',
                content
            };
            return new epub(options).promise;
        })
        .then(() => console.log('\n\n--> Get your epub by calling\n  "node ' + program.name() + ' --hash ' + filename + '"\n\n'))
        .catch(function(err){
            console.log(err);
            //handle error
        });
}