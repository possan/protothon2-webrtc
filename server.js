var osc = require('./osc.js');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var multipart = require("multipart");
var formidable = require('formidable');
var sys = require('sys');
var querystring = require('querystring');

app.listen(8001);

var lastx,lasty,lastz,lastuid;

/*
 * Handle file upload
 */
function upload_file( req, res ) {
  
	var form = new formidable.IncomingForm();

	// Parse file.
  	form.parse(req, function(err, fields, files) {

  	if(files.file){

			// Read file.			
			fs.readFile(files.file.path, function(err, data){

		  	// Save file.
				fs.writeFile('uploads/test.bin', 
					data, 
					'utf8', 
					function (err) {
						if (err){
							// throw err;
							res.writeHead(200, {'content-type': 'text/plain'});
							res.write(JSON.stringify({
								isSucessful: false,
								message: 'Something went wrong!'					
							}));
							res.end();
						} else {
							// Sucess.
							res.writeHead(200, {'content-type': 'text/plain'});
							res.write(JSON.stringify({
								isSucessful: true,
								message: 'File was saved!'
							}));
							res.end();
						}
				});
			});
		} else {
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write(JSON.stringify({
				isSucessful: false,
				message: 'Did not receive any file!'					
			}));
			res.end();
		}
  });
}


function handler (req, res) {
	console.log(req.url, req);
	if( req.url == '/' || req.url == '' ) {
  		fs.readFile(__dirname + '/tracking2.html',
  			function (err, data) {
    			if (err) {
      			res.writeHead(500);
      			return res.end('Error loading index.html');
    		}
			res.writeHead(200);
    		res.end(data);
  		});
	}
	else if( req.url == '/feed' )
	{
		res.writeHead(200);
		res.end(lastuid+','+lastx+','+lasty+','+lastz);
	}
	else if( req.url == '/up' ) { 
		if (req.method == 'POST') {
    		console.log("[200] " + req.method + " to " + req.url);
			var all = '';
    		req.on('data', function(chunk) {
	 			all += chunk;
	 		} );
    		req.on('end', function() {
      			// empty 200 OK response for now
				console.log(all);
				var all = querystring.parse(all);
				console.log(all);
				// all = all.substring(5);
      			fs.writeFile("test.svg", all, function(err) {
				    if(err) {
				        console.log(err);
				    } else {
				        console.log("The file was saved!");
				    }
				});
				res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      			res.end();
    		});
 		}
    	// upload_file(req, res);
//		res.writeHead(200);
//		res.end('thanks');
	}
	else if( req.url == '/test.svg' ) { 
	  	fs.readFile(__dirname + '/test.svg',
	  		function (err, data) {
	    		if (err) {
	     			res.writeHead(500);
	    			return res.end('Error loading test.svg');
	    		}
				res.writeHead(200, {'Content-Type': 'image/svg+xml'});
	    		res.end(data);
	 		}
		);
	}
	else
	{
		res.writeHead(404);
		res.end();
		
	}
}

var client = new osc.Client( 8000, '192.168.144.197' );
var client2 = new osc.Client( 8000, '192.168.144.52' );
console.log(client);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('draw', function (data) {
    // console.log('got draw',data);

	lastx = data.x;
	lasty = data.y;
	lastz = data.z;
	lastuid = data.uid;

	var msg = new osc.Message( '/draw' );
	msg.append(data.uid);
	msg.append(data.x);
	msg.append(data.y);
	msg.append(data.z);
	msg.append(0);
	msg.append(0);
	// console.log(msg);
	client.send(msg);
	client2.send(msg);
	
  });
});




/*









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


*/


