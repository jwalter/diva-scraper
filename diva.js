var cheerio = require('cheerio');

function detailsFromHtml(html) {
    const $ = cheerio.load(html);
    const titleElem = $('#innerEastCenter > span:nth-child(1) > span');
    const someAuthorElems = $('#formSmash\\:some > h3');
    const moreAuthorElems = $('#formSmash\\:all > h3');
    const allAuthorElems = someAuthorElems.toArray().concat(moreAuthorElems.toArray());
    console.log('Loaded page for ', titleElem.text());
    const authors = [];
    for (let authorElem of allAuthorElems) {
        //console.log('    ', authorElem.children[1].data);
        authors.push(authorElem.children[1].data);
        //console.log('    ', authorElem.next.children[0].children[0].data);
    }
    return {
        title: titleElem.text(),
        authors: authors
    };
}

module.exports = detailsFromHtml