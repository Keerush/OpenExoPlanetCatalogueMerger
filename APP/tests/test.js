var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:8080');

describe("Testing database table creation", function() {
	it('should have status code 200 after tables have been made and with correct password.', function(done) {
		server
			.get('/createTables/test')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 404, for invalid password.', function(done) {
		server
			.get('/createTables/wrongpass')
			.expect(404)
			.end(function(err, res) {
				res.status.should.equal(404);
				done();
			});
	}).timeout(5000);
});

describe("Testing database table deletion", function() {
	it('should have status code 200 after tables have been dropped and with correct password.', function(done) {
		server
			.get('/dropTables/test')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 404, for invalid password.', function(done) {
		server
			.get('/dropTables/wrongpass')
			.expect(404)
			.end(function(err, res) {
				res.status.should.equal(404);
				done();
			});
	}).timeout(5000);
});