var massahHelper = require('massah/helper')
  , helper = massahHelper.application.helper

var checkIdentifier = function(context) {
    var driver = context.driver
    var find = new RegExp('[^0-9a-z]', 'ig')
    var slug = context.params.fields['slug'].replace(find, '-').toLowerCase()
    var regex = new RegExp('\/n\/' + slug)
    driver.wait(function() {
        return driver.currentUrl(function(url, currentUrl) {
            return currentUrl.path.match(regex)
        })
    }, 5000, 'Waiting for a new board with the URL identifier')
}

module.exports = (function() {
    var library = massahHelper.getLibrary()
        .given('I create a board with identifier \'(.*)\'', function(identifier) {
            var driver = this.driver
            driver.get(helper.baseUrl + '/#create')
            driver.input('*[name="owner"]').enter('user@example.com')
            driver.input('*[name="slug"]').enter(identifier)
            if (!this.params.fields) this.params.fields = {}
            this.params.fields.slug = identifier
            driver.button('Create board').click()
            checkIdentifier(this)
        })
        .then('I expect to see the create board page elements', function(page) {
            this.driver.element('input[type="email"][name="owner"]')
            this.driver.element('input[name="board-name"]')
            this.driver.element('input[type="password"][name="password-admin"]')
            this.driver.element('input[type="password"][name="password-write"]')
            this.driver.element('input[type="password"][name="password-read"]')
            this.driver.element('select[name="grid-size"]')
            this.driver.element('select[name="grid-position"]')
            this.driver.button('Cancel')
            this.driver.button('Create board').then(
                function() {},
                function(error) {
                    throw new Error('Missing home page elements', error)
                }
            )
        })
        .given('I create a board with access passwords', function() {
            var self = this
            this.driver.get(helper.baseUrl + '/#create')
            this.driver.input('*[name="owner"]').enter('user@example.com')
            this.driver.input('*[name="password-admin"]').enter('admin')
            this.driver.input('*[name="password-write"]').clear()
            this.driver.input('*[name="password-write"]').enter('write')
            this.driver.input('*[name="password-read"]').clear()
            this.driver.input('*[name="password-read"]').enter('read')
            this.driver.button('Create board').click()
            this.driver.wait(function() {
                return self.driver.currentUrl(function(url, currentUrl) {
                    var matches = currentUrl.path.match(/\/([a-z0-9]{24}).*/)
                    if (matches) {
                        self.params.boardId = matches[1]
                        self.params.boardTitle = self.params.boardId
                        return true
                    }
                    return false
                })
            }, 5000, 'Waiting for a new board')
            this.driver.wait(function() {
                return self.driver.element('div.modal-backdrop').then(
                    function() { return false },
                    function() { return true }
                )
            }, 15000, 'Waiting for connection modal to close')
            
            this.driver.element('a[title="Settings"]').click()
            this.driver.element('a.leave').click()
        })
        .then('the board has the expected title', function() {
            var expected = (this.params.fields && this.params.fields['board-name']) ||
                this.params.boardTitle
            var selector = 'div.navbar a.board-name'
            this.driver.element(selector).text(function(title) {
                title.should.equal(expected)
            })
        })
        .then('I am redirected to the identified board', function() {
            checkIdentifier(this)
        })
    
    return library
})()
