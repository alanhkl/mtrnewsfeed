
Feature('Advance search');

Scenario('test something', (I) => {
    I.amOnPage("./en/index.html");
    I.wait(2);
    I.see("Search for a charging location");
    I.waitForInvisible('.map .overlay');
    I.fillField('#evcmap_index', 'kowloon bay');
    I.wait(1);
    I.pressKey('Enter');
    I.wait(2);
    I.see("九龍灣");
});
