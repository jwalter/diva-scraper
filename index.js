var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key;

const url = 'http://liu.diva-portal.org/smash/resultList.jsf?dswid=-6418&language=en&searchType=RESEARCH&query=&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%7B%22dateIssued%22%3A%7B%22from%22%3A%222016%22%2C%22to%22%3A%222016%22%7D%7D%2C%7B%22organisationId%22%3A%223801%22%2C%22organisationId-Xtra%22%3Atrue%7D%2C%7B%22publicationTypeCode%22%3A%5B%22article%22%5D%7D%5D%5D&aqe=%5B%5D&noOfRows=250&sortOrder=author_sort_asc&onlyFullText=false&sf=all';


const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
const driver2 = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
const openInTabChord = Key.chord(Key.CONTROL, Key.RETURN);

driver.get(url);
async function scrape() {
    const allItems = await driver.findElements(By.css("#formSmash\\:items\\:resultList_list > li:nth-child(4)"));
    const allLinks = await Promise.all(allItems.map(item => item.findElement(By.tagName('a'))));
    for (let link of allLinks) {
        const href = await link.getAttribute("href");
        await driver2.get(href);
        const authors = await driver2.findElements(By.xpath("//*[@id='formSmash:some']/h3"));
        const authorNames = await Promise.all(authors.map(author => author.getText()));
        console.log("Authors: ", authorNames);
        try {
            const citationsElem = await driver2.findElement(By.css("#formSmash\\:citings > span"));
            const citationsText = await citationsElem.getText();
            console.log("Citations: ", citationsText);
        } catch (e) {
            console.log("No citations");
        }
    }
    const allLinkUrls = await Promise.all(allLinks.map(l => l.getAttribute('href')));
    return allLinkUrls.length;
}

scrape().then(x => {
    console.log('Total: ' + x);
    driver.quit();
    driver2.quit();
});
