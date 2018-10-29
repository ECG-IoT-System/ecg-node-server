var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '',
  user: 'root',
  password: 'root',
  database: 'new_schema'
});


function insert(value) {
  console.log("insert");
  var sql = 'INSERT INTO ECG3LTIME_Advantech(deviceid,time,data) VALUES(?,?,?)';
  var addSqlParams = [];
  var count = value[0].count;
  for (var i = 1; i <= count; i++)
    addSqlParams.push([value[i].deviceid, value[i].time, value[i].data]);
  console.log(addSqlParams);
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
   
    console.log('Connected to the MySQL server.');
  });
  
  connection.query(sql, [addSqlParams], function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

}
module.exports.insert = insert;