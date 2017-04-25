var cheerio = require('cheerio');

function detailsFromHtml(html) {
    const $ = cheerio.load(html);
    const titleElem = $('#innerEastCenter > span:nth-child(1) > span');
    const someAuthorElems = $('#formSmash\\:some > h3');
    const moreAuthorElems = $('#formSmash\\:all > h3');
    const allAuthorElems = someAuthorElems.toArray().concat(moreAuthorElems.toArray());
    const authors = [];
    for (let authorElem of allAuthorElems) {
        authors.push(createAuthor(authorElem));
    }
    return {
        title: titleElem.text(),
        authors: authors
    };
}

function createAuthor(authorElem) {
    return {
        name: authorElem.children[1].data.trim(),
        organisation: authorElem.next.children[0].children[0].data
    }
}

module.exports = detailsFromHtml