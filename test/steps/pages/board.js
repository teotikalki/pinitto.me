var massahHelper = require('massah/helper')
  , helper = massahHelper.application.helper

module.exports = (function() {
    var library = massahHelper.getLibrary()
        .then('the user has the access level (.*)', function(level) {
            var driver = this.driver

            driver.element('a[title="Settings"]').click()
            driver.wait(function() {
                return driver.element('a.change-access-level').isDisplayed(function(displayed) {
                    if (!displayed) return false
                    driver.element('a.change-access-level').text(function(label) {
                        label.should.equal(
                            'Change access\n' + level
                        )
                    })
                    return true
                })
            }, 5000, 'Waiting for access level label')
        })
    
    return library
})()
