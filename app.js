var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); //parse body data


//the following provides the routing basedon which data store method is chosen
if(config.dataStore == 'local') //use local variable as data store
{
	// sample data stored in th server
	app.locals.serverData = { "sports":[ "baseball", "hockey" , "football"] , "music":["jazz", "classic", "pop"] , "games":["GTA", "CSGO", "AC"] };  
	var router = require('./' + config.version + '/router_local');	
	app.use('/', router);
}
else if(config.dataStore == 'db') //use mysql db as data store
{
	var router = require('./' + config.version + '/router_db');	
	app.use('/', router);
}
else
app.all('*',  function (req, res)  //if config.dataStore is not set to local or db, send error message
{
    res.status(500).json({ error : 'Data storage is not configured correctly'});
});

//if the route is not caught in the routing module, the following catches everything else
app.use(function(req, res, next){
   res.status(404).send('Path not found!');
});

//error handler
app.use(function(err, req, res, next) 
{
    console.error(err.stack);
    if (res.headersSent) 
    {
        return next(err);
    }
    res.status(500).send('Something broke or incorrect data format!');
});


app.listen(config.port);

