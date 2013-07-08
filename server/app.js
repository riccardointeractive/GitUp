var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , querystring = require('querystring');

app.listen(80);

function handler (req, res) {
    var path = req.url;
    var qs = "";
    var qsOffset = req.url.indexOf("?");

    if (qsOffset > -1) {
        path = req.url.substring(0, qsOffset);
        qs = req.url.substring(qsOffset + 1);
    }

    if (path == "/") {
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
    }
    else if (path == "/chair-status") {
        var params = querystring.parse(qs);
        var chairState = (params.value == "true" ? true : false);
        io.sockets.emit('chair', {type : "update", value: chairState, isConnected : 1});
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    }
}

io.sockets.on('connection', function (socket){
    console.log("New socket connection made");
    socket.emit('chair', {type : "init", value:  null, isConnected : null});
});


//io.sockets.emit('chair', {type : "disconnect", isConnected : chairState.isConnected});