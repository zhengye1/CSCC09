{"changed":true,"filter":false,"title":"app.js","tooltip":"/app.js","value":"// app.js Node.js server\n\n\"use strict;\"   // flag JS errors \n\n/* Module dependencies:\n *\n * require() loads a nodejs \"module\" - basically a file.  Anything\n * exported from that file (with \"exports\") can now be dotted off\n * the value returned by require(), in this case e.g. eatz.api\n * The convention is use the same name for variable and module.\n */\nvar http = require('http'),   // ADD CODE\n    // NOTE, use the version of \"express\" linked to the assignment handout\n    express = require('express'), // Express Web framework   ... ADD CODE\n    fs = require(\"fs\"),\n    // config exports an object that defines attributes such as \"port\"\n    config = require(\"./config\");  // app's local config - port#, etc\n    eatz = require('./routes/eatz.js');  // route handlers   ... ADD CODE\n\nvar app = express();  // Create Express app server\n\n// Configure app server\napp.configure(function() {\n    // use PORT environment variable, or local config file value\n    app.set('port', process.env.PORT || config.port);\n    //app.set('ip address', process.env.IP);\n\n    // change param value to control level of logging  ... ADD CODE\n    app.use(express.logger(config.env));  // 'default', 'short', 'tiny', 'dev'\n\n    // use compression (gzip) to reduce size of HTTP responses\n    app.use(express.compress());\n\n    // session config\n    app.use(express.cookieParser());           // populates req.signedCookies\n    app.use(express.session({key: config.sessionKey,\n        secret: config.sessionSecret,\n        cookie: {maxAge:config.sessionTimeout} }));\n    \n    // parses HTTP request-body and populates req.body\n    app.use(express.bodyParser({\n        uploadDir: __dirname + '/public/img/uploads',\n        keepExtensions: true\n    }));\n\n    // Perform route lookup based on URL and HTTP method,\n    // Put app.router before express.static so that any explicit\n    // app.get/post/put/delete request is called before static\n    app.use(app.router);\n\n    // location of app's static content ... may need to ADD CODE\n    app.use('/public',  express.static(__dirname + \"/public\"));\n\n    // return error details to client - use only during development\n    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));\n});\n\n// App routes (API) - route-handlers implemented in routes/eatz.js\n\n// Heartbeat test of server API\napp.get('/', eatz.api);\n\n// Retrieve a single dish by its id attribute\napp.get('/dishes/:id', eatz.getDish);\napp.get('/dishes', eatz.getDishes);\napp.post('/dishes', eatz.addDish);\napp.put('/dishes/:id', eatz.editDish);\napp.delete('/dishes/:id', eatz.deleteDish);\n\n\n// Upload an image file and perform image prossing on it\napp.post('/dishes/image', eatz.uploadImage);\n\n// User signup\napp.post('/auth', eatz.signup);\n\n// handle isAuth\napp.get('/auth', eatz.isAuth);\n\n//login logout handler\napp.put('/auth', eatz.auth);\n\napp.use('*', function(req, res){\n    res.send(404, '<h3>Can you check your URL?</h3>');\n});\n\n/*var options = {\n  key: fs.readFileSync('key.pem'),  // RSA private-key\n  cert: fs.readFileSync('cert.pem')  // RSA public-key certificat\n};*/\n\n// Start HTTPS serve\nvar a  = http.createServer(app).listen(app.get('port'), process.env.IP, function () {\n    console.log(\"Express server listening on port %d in %s mode\",\n    \t\tapp.get('port'), config.env); \n});\n\n\n\n\n\n\n","undoManager":{"mark":89,"position":100,"stack":[[{"group":"doc","deltas":[{"start":{"row":93,"column":34},"end":{"row":93,"column":35},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":94,"column":2},"end":{"row":94,"column":3},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":94,"column":1},"end":{"row":94,"column":2},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":94,"column":0},"end":{"row":94,"column":1},"action":"remove","lines":["}"]},{"start":{"row":94,"column":0},"end":{"row":94,"column":1},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":94,"column":0},"end":{"row":94,"column":1},"action":"insert","lines":["}"]}]}],[{"group":"doc","deltas":[{"start":{"row":84,"column":2},"end":{"row":84,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":84,"column":3},"end":{"row":85,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":4},"end":{"row":92,"column":5},"action":"remove","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":4},"end":{"row":92,"column":5},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":66},"end":{"row":92,"column":67},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":67},"end":{"row":92,"column":68},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":68},"end":{"row":92,"column":69},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":69},"end":{"row":92,"column":70},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":70},"end":{"row":92,"column":71},"action":"insert","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":71},"end":{"row":92,"column":72},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":72},"end":{"row":92,"column":73},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":73},"end":{"row":92,"column":74},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":73},"end":{"row":92,"column":74},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":73},"end":{"row":92,"column":74},"action":"insert","lines":["("]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":74},"end":{"row":92,"column":75},"action":"insert","lines":["'"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":75},"end":{"row":92,"column":76},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":76},"end":{"row":92,"column":77},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":77},"end":{"row":92,"column":78},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":78},"end":{"row":92,"column":79},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":78},"end":{"row":92,"column":79},"action":"remove","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":77},"end":{"row":92,"column":78},"action":"remove","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":77},"end":{"row":92,"column":78},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":78},"end":{"row":92,"column":79},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":78},"end":{"row":92,"column":79},"action":"remove","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":78},"end":{"row":92,"column":79},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":79},"end":{"row":92,"column":80},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":80},"end":{"row":92,"column":81},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":81},"end":{"row":92,"column":82},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":82},"end":{"row":92,"column":83},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":83},"end":{"row":92,"column":84},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":84},"end":{"row":92,"column":85},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":85},"end":{"row":92,"column":86},"action":"insert","lines":["'"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":86},"end":{"row":92,"column":87},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":87},"end":{"row":92,"column":88},"action":"insert","lines":[","]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":88},"end":{"row":92,"column":89},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":1},"end":{"row":89,"column":2},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":1},"end":{"row":89,"column":2},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":5},"end":{"row":25,"column":6},"action":"remove","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":4},"end":{"row":25,"column":5},"action":"remove","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":41},"end":{"row":25,"column":42},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":41},"end":{"row":25,"column":42},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":4},"end":{"row":25,"column":5},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":25,"column":5},"end":{"row":25,"column":6},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":66},"end":{"row":92,"column":87},"action":"remove","lines":["app.get('ip address')"]},{"start":{"row":92,"column":66},"end":{"row":92,"column":80},"action":"insert","lines":["process.env.IP"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":42},"end":{"row":11,"column":43},"action":"remove","lines":["E"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":42},"end":{"row":11,"column":43},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":42},"end":{"row":11,"column":43},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":42},"end":{"row":11,"column":43},"action":"insert","lines":["E"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":8},"end":{"row":11,"column":9},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":8},"end":{"row":11,"column":9},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":8},"end":{"row":11,"column":9},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":24},"end":{"row":11,"column":25},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":13},"end":{"row":92,"column":14},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":27},"end":{"row":92,"column":36},"action":"remove","lines":["options, "]},{"start":{"row":92,"column":27},"end":{"row":92,"column":28},"action":"insert","lines":["x"]}]}],[{"group":"doc","deltas":[{"start":{"row":92,"column":27},"end":{"row":92,"column":28},"action":"remove","lines":["x"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":1},"end":{"row":95,"column":2},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":0},"end":{"row":95,"column":1},"action":"remove","lines":["}"]},{"start":{"row":95,"column":0},"end":{"row":95,"column":1},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":1},"end":{"row":95,"column":2},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":0},"end":{"row":95,"column":1},"action":"insert","lines":["}"]}]}],[{"group":"doc","deltas":[{"start":{"row":86,"column":0},"end":{"row":86,"column":1},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":86,"column":1},"end":{"row":86,"column":2},"action":"insert","lines":["*"]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":2},"end":{"row":89,"column":3},"action":"insert","lines":["*"]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":3},"end":{"row":89,"column":4},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":3},"end":{"row":89,"column":4},"action":"remove","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":91,"column":20},"end":{"row":91,"column":21},"action":"remove","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":89,"column":3},"end":{"row":89,"column":4},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"remove","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":1},"end":{"row":95,"column":2},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":1},"end":{"row":95,"column":2},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":2},"end":{"row":95,"column":3},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":3},"end":{"row":96,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":3},"end":{"row":96,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":95,"column":3},"end":{"row":96,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":97,"column":0},"end":{"row":98,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":98,"column":0},"end":{"row":99,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":98,"column":0},"end":{"row":99,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":97,"column":0},"end":{"row":98,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":96,"column":0},"end":{"row":97,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":97,"column":0},"end":{"row":98,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":98,"column":0},"end":{"row":99,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":99,"column":0},"end":{"row":100,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":100,"column":0},"end":{"row":101,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":101,"column":0},"end":{"row":102,"column":0},"action":"insert","lines":["",""]}]}]]},"ace":{"folds":[],"scrolltop":980,"scrollleft":0,"selection":{"start":{"row":102,"column":0},"end":{"row":102,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":80,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1418955797304}