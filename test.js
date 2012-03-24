var osc = require('./osc.js');

var client = new osc.Client( 8000, '192.168.144.197' );
// client.sendSimple( '/3/xy3', [0.1, 0.3, 0.5] );
console.log(client);





// slightly more complex
var msg = new osc.Message( '/draw' );
msg.append('hello');
msg.append(0.5);
msg.append(0.5);
msg.append(0.0);
msg.append(0);
msg.append(0);
// console.log(msg);
client.send(msg);

process.exit(1);

