/*jshint expr: true*/
var expect = require('chai').expect,
	assert = require('assert'),
	Browser = require('zombie');

require('chai').should();

var browser = new Browser({
		site: "http://localhost:3000"
	});

describe('Given I visit the root URL', function(done) {

	before(function(done) {
		browser.visit('/', done);
	});

	it("then the page loads fine", function() {
		browser.statusCode.should.equal(200);
	});
});