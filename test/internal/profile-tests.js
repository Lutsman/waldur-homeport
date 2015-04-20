var auth = require('../helpers/auth.js'),
  users = [auth.getUser('Charlie'), auth.getUser('Walter')],
  testData = [
    {
      email: 'testemail1@example.com',
      emailFail: 'testemail1example.com'
    },
    {
      email: 'testemail2@example.com',
      emailFail: 'testemail2@examplecom'
    },
  ];
for(var i=0; i < users.length; i++) {
  var user = users[i];
  var data = testData[i];

  (function(user, data) {
    describe('Test ' + user.username + ' can go to "profile" page:', function() {

      it('I should be able to login', function() {
        auth.login(user);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/dashboard/');
      });

      it('I should be able to go to profile', function() {
        element(by.css('li.dropdown.user-box a')).click();
        element(by.cssContainingText('li.dropdown.user-box ul li:nth-child(1) a', 'Profile')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/profile/');
        expect(element(by.css('.profile-name')).getText()).toContain(user.username);
      });

      it('I should be able to edit profile', function() {
        var currentEmail = element(by.css('.profile-info a')).getText();

        function setEmail(email) {
          element(by.model('controller.user.email')).clear();
          element(by.model('controller.user.email')).sendKeys(email);
          element(by.css('.btn.btn-primary')).click();
        }

        element(by.css('.profile-view .controls > li:nth-child(1) > a')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/profile/edit/');
        expect(element(by.css('.profile-name')).getText()).toContain(user.username);
        setEmail(data.emailFail);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/profile/edit/');
        expect(element(by.css('.profile-view .error')).getText()).toEqual('Enter a valid email address.');

        setEmail(data.email);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/profile/');
        expect(element(by.css('.profile-info a')).getText()).toEqual(data.email);

        // reset email
        element(by.css('.profile-view .controls > li:nth-child(1) > a')).click();
        setEmail(currentEmail);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/profile/');

      });

      it('I should be able to logout', function() {
        auth.logout();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/');
      });
    });
  })(user, data);

}