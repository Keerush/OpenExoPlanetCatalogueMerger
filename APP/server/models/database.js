var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql9.freemysqlhosting.net',
  user     : 'sql9142844',
  password : 'yiZUzq27ZS',
  database : 'sql9142844'
});

connection.connect();

// Create tables.
var tableNames = ' Names(' +
	'id INT NOT NULL PRIMARY KEY,' +
	'name VARCHAR(20) NOT NULL' +
	')';

connection.query('CREATE TABLE' + tableNames, function(err, res){
	if (!err) {
		console.log('Created table Names.');
	} else {
		console.log('Cannot create' + tableNames);
	}
});


connection.query('SELECT * from test', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();