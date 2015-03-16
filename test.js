var http = require('http');
http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("Hello World\n");
}).listen(41001, 'mathlab.utsc.utoronto.ca');
console.log('Server running at http://mathlab.utsc.utoronto.ca:41001/');
