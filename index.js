var request = require('request');
var cheerio = require('cheerio');
var detailsFromHtml = require('./diva');

const baseUrl = 'http://liu.diva-portal.org';
const noOfRows = 2;
const url = baseUrl + '/smash/resultList.jsf?dswid=-6418&language=en&searchType=RESEARCH&query=&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%7B%22dateIssued%22%3A%7B%22from%22%3A%222016%22%2C%22to%22%3A%222016%22%7D%7D%2C%7B%22organisationId%22%3A%223801%22%2C%22organisationId-Xtra%22%3Atrue%7D%2C%7B%22publicationTypeCode%22%3A%5B%22article%22%5D%7D%5D%5D&aqe=%5B%5D&noOfRows=' + noOfRows + '&sortOrder=author_sort_asc&onlyFullText=false&sf=all';

request(url, (error, response, html) => {
    if (!error) {
        console.log('Got OK response')
        var $ = cheerio.load(html);
        var publications = $('#formSmash\\:items\\:resultList_list > li');

        publications.each(function (i, elem) {
            //console.log($(elem).find('a').first().text());
            //console.log($(elem).find('a').first().attr('href'));
            const info = articleInfo($(elem).find('a').first().attr('href'));
        });
    } else {
        console.log(error);
    }
});

function articleInfo(url) {
    request(baseUrl + url, (error, response, html) => {
        if (!error) {
            return detailsFromHtml(html);
        } else {
            console.log(error);
        }
    });
}

async function scrape() {
    const allItems = await driver.findElements(By.css("#formSmash\\:items\\:resultList_list > li"));
    const allLinks = await Promise.all(allItems.map(item => item.findElement(By.tagName('a'))));
    const summaries = [];
    for (let link of allLinks) {
        const href = await link.getAttribute("href");
        await driver2.get(href);
        const titleElem = await driver2.findElement(By.css("#innerEastCenter > span:nth-child(1) > span"));
        const title = await titleElem.getText();
        const someAuthorElems = await driver2.findElements(By.xpath("//*[@id='formSmash:some']/h3"));
        let allAuthorElems = [];
        try {
            const moreAuthorsLink = await driver2.findElement(By.css("#formSmash\\:j_idt225 > span"));
            await moreAuthorsLink.click();
            const moreAuthorElems = await driver2.findElements(By.xpath("//*[@id='formSmash:all']/h3"));
            allAuthorElems = someAuthorElems.concat(moreAuthorElems);
        } catch (e) {
            allAuthorElems = someAuthorElems;
        }
        const authors = [];
        for (let authorElem of allAuthorElems) {
            const name = await authorElem.getText();
            const org = await authorElem.findElement(By.xpath("following::div/span"));
            const orgText = await org.getText();
            authors.push(
                {
                    name: fixName(name),
                    cmiv: orgText.indexOf("CMIV") != -1
                });
        }
        const publishedIn = await driver2.findElement(By.xpath("//span[@class='displayFields']/span[@class='italicLabel']/.."));
        const publishedInText = await publishedIn.getText();

        let citationsText = "-";
        try {
            const citationsElem = await driver2.findElement(By.css("#formSmash\\:citings > span"));
            citationsText = await citationsElem.getText();
        } catch (e) {
            // No citations
        }
        const summary = {
            title: title,
            authors: authors,
            in: publishedInText.trim(),
            citations: citationsText
        }
        summaries.push(summary);
        console.log("Summarized: " + summaries.length + " " + summary.title);
    }
    return summaries;
}

function fixName(name) {
    const parts = name.split(",");
    const fixedName = parts[0] + " " + parts[1].trim().substring(0, 1);
    return fixedName;
}
