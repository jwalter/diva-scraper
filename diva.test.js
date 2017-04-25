var fs = require('fs');
var diva = require('./diva')

test('Returns empty object for empty html', () => {
    expect(diva('').authors).toHaveLength(0);
});

test('Includes all authors', () => {
    const html = fs.readFileSync('detailsPage01.html');
    expect(diva(html).authors).toHaveLength(8);
});

test('Author names are trimmed', () => {
    const html = fs.readFileSync('detailsPage01.html');
    expect(diva(html).authors[0].name).toEqual('Abrahamsson, Annelie');
});

test('Includes title', () => {
    const html = fs.readFileSync('detailsPage01.html');
    expect(diva(html).title).toEqual('Dense breast tissue in postmenopausal women is associated with a pro-inflammatory microenvironment in vivo');
});

test('Organisation', () => {
    const html = fs.readFileSync('detailsPage01.html');
    expect(diva(html).authors[0].organisation).toEqual('Linköping University, Department of Clinical and Experimental Medicine, Division of Clinical Sciences. Linköping University, Faculty of Medicine and Health Sciences.');
});