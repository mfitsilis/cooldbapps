var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nodeq = require("node-q");
var conn;
var conn2;
var result=0;
var port=3000;

nodeq.connect({host: "localhost", port: 5900}, function(err, con) { if (err) throw err; conn=con; });
nodeq.connect({host: "localhost", port: 5901}, function(err, con) { if (err) throw err; conn2=con; });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(favicon(__dirname + '/public/favicon.ico'));

var out=0;
app.use(express.static('public'));
io.on('connection', function(socket){  //conn.k is async?
  var allConnectedClients = Object.keys(io.sockets.connected);
  var clientsCount = io.engine.clientsCount ;
  //console.log(clientsCount);
  //console.log(allConnectedClients);
  
  socket.on('query', function(msg){

	var sessionid=socket.id;
	//qparse:{$[exit in parse x;; .Q.s eval parse x]} /define in q
	conn.k(".j.j "+msg.substr(0,300), function(err, res) {
	var ret;
	console.log(msg);
	
	if (err) { /*console.log("bad query");*/ ret="bad query"; } else { result=res; } 
	 if(ret=="bad query") result=ret;
		try{ //replace null values in the json
		  result=result.toString().replace(/:null,/g,":0,").replace(/:null}/g,":0}").replace(/null/g," ").replace(/<.*?>/g," "); //replace null,<...> and <.../>
		//  console.log(result);
		 // console.log("result:"+result);
		  io.to(sessionid).emit('query', result);
		} catch(eee) {} //console.log may crash?	
	});
  });
  
  socket.on('sendmsg', function(msg){
	var sessionid=socket.id;
	var ret;
	if(msg.length>1){ //at least ok
		msg=msg.replace(/(\r\n|\n|\r)/gm,"\\\\n");
		console.log(msg);
		try{
			conn2.ks('{ s:`$ ";" vs x ;s0:s 0;s1:s 1;msg,:(.z.Z;s0;s1) }"'+msg.substr(0,300)+'"', function(err, res) {
			//conn2.ks(msg, function(err, res) {
			//console.log(msg);
				 if (err) { ret="bad query"; } else { result=res; } 
				 if(ret=="bad query") result=ret;
				 else {
						io.to(sessionid).emit('sendmsg',"sent");
				 }
		
			});
		} catch(eee) {} //console.log may crash?
	}
  });
  
}); //end of io.on

http.listen(port, function(){
  console.log('listening on port '+port);
});

//conn.close();
