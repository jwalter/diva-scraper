var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const url = 'http://liu.diva-portal.org/smash/resultList.jsf?dswid=-6418&language=en&searchType=RESEARCH&query=&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%7B%22dateIssued%22%3A%7B%22from%22%3A%222016%22%2C%22to%22%3A%222016%22%7D%7D%2C%7B%22organisationId%22%3A%223801%22%2C%22organisationId-Xtra%22%3Atrue%7D%2C%7B%22publicationTypeCode%22%3A%5B%22article%22%5D%7D%5D%5D&aqe=%5B%5D&noOfRows=250&sortOrder=author_sort_asc&onlyFullText=false&sf=all';


var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get(url);

var dataItems = driver.findElement(By.id('formSmash:items:resultList_list'));
driver.findElements(By.css("#formSmash\\:items\\:resultList_list > .ui-datalist-item")).then(elems => {
    
    console.log('Total number of search hits: ' + elems.length);
    elems.forEach(elem => 
        elem.findElement(By.tagName('a'))
        .then(link => link.getText().then(text => console.log(text))));
});

driver.quit();