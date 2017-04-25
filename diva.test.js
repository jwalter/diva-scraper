var fs = require('fs');
var diva = require('./diva')

test('Returns empty object for empty html', () => {
    expect(diva('').authors).toHaveLength(0);
});

test('Includes all authors', () => {
    const html = fs.readFileSync('detailsPage01.html');
    expect(diva(html).authors).toHaveLength(8);
})