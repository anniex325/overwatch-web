var express = require('express');
var path = require('path');
var logger = require('morgan');
var body = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended:false }));

app.losten(app.get('port'),function(){
    console.log('Express sever listening on port ' + app.get('port'));
});
