var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:8080');

/*describe("Testing database table creation", function() {
	it('should have status code 200 after tables have been made and with correct password.', function(done) {
		server
			.get('/api/createTables/test')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 404, for invalid password.', function(done) {
		server
			.get('/api/createTables/wrongpass')
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
			.get('/api/dropTables/test')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 404, for invalid password.', function(done) {
		server
			.get('/api/dropTables/wrongpass')
			.expect(404)
			.end(function(err, res) {
				res.status.should.equal(404);
				done();
			});
	}).timeout(5000);
});*/

describe("Testing get Nasa Star differences", function() {
	it('should have status code 200 after all differences have been pushed.', function(done) {
		server
			.get('/api/getNasaStarDiff')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 200 after 10 differences have been pushed.', function(done) {
		server
			.get('/api/getNasaStarDiff?limit=10&offset=0')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				res.body.length.should.equal(10);
				done();
			});
	}).timeout(5000);
});

describe("Testing get Nasa System differences", function() {
	it('should have status code 200 after all differences have been pushed.', function(done) {
		server
			.get('/api/getNasaSystemDiff')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(5000);

	it('should have status code 200 after 10 differences have been pushed.', function(done) {
		server
			.get('/api/getNasaSystemDiff?limit=10&offset=0')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				res.body.length.should.equal(10);
				done();
			});
	}).timeout(5000);
});

describe("Testing get Nasa Planet differences", function() {
	it('should have status code 200 after all differences have been pushed.', function(done) {
		server
			.get('/api/getNasaPlanetDiff')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				done();
			});
	}).timeout(100000);

	it('should have status code 200 after 10 differences have been pushed.', function(done) {
		server
			.get('/api/getNasaPlanetDiff?limit=10&offset=0')
			.expect(200)
			.end(function(err, res) {
				res.status.should.equal(200);
				res.body.length.should.equal(10);
				done();
			});
	}).timeout(10000);
});