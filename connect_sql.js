var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.MYSQL_URL || "localhost",
  user: 'root',
  password: 'root',
  database: 'new_schema'
});

connection.connect(function(err) {
  if (err) {
    return console.error('1.error: ' + err.message);
  }
  console.log('2.Connected to the MySQL server.');
});

function insert(value) {
  console.log("insert");
  var sql = `INSERT INTO ECG3LTIME_Advantech(deviceID,time,data) VALUES ?`;
  var addSqlParams =[];
  var count = value[0].count;
  console.log(count)
  for (var i = 1; i <= count; i++)
    addSqlParams.push([value[i].deviceid, value[i].time, value[i].data]);
  console.log('addsql: ',addSqlParams);
  
  connection.query(sql, [addSqlParams], function (error, results, fields) {
    if (error)
    console.log('3.The solution is: ',error.message);
  });

}
module.exports.insert = insert;