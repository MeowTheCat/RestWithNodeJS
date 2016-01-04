var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next)      //GET :  read all key/value
{
    res.json(req.app.locals.serverData );
});


router.get('/:key', function(req, res,next)    //GET:  read a specif key/value
{  
    var key = req.params.key;
    if(req.app.locals.serverData.hasOwnProperty(key)) 
    { 
        var obj = JSON.parse('{"' + key + '": ' + JSON.stringify(req.app.locals.serverData[key]) +  '}');
    	res.json(obj);
    }
    else { res.json({message : "the key does not exist"})};
});

router.post('/:key', function(req, res, next)      //Post:  create a new key/value
{
    var key = req.params.key;
    if(!req.app.locals.serverData.hasOwnProperty(key)) 
    {
	    var str = '{';
        for (var index in req.app.locals.serverData) 
        {
    		str =  str + '"' + index + '": ' + JSON.stringify(req.app.locals.serverData[index]) + ',';
		}
        str = str  + '"' + key + '": ' + JSON.stringify(req.body) + '}';
        req.app.locals.serverData = JSON.parse(str);
    	res.json({message : "the key: " + key + " is created"})
    }
    else { res.json({message : "the key already exists"})};
});


router.delete('/:key', function(req, res, next)      //Delete:  delete a key/value
{
    var key = req.params.key;  
    if(req.app.locals.serverData.hasOwnProperty(key)) 
    {
	    var str = '{';
        for (var index in req.app.locals.serverData) 
        {
    		if(index != key )
    	    { 
    	      if(str == '{') str =  str + '"' + index + '": ' + JSON.stringify(req.app.locals.serverData[index]) ;
    	      else str =  str + ',' + '"' + index + '": ' + JSON.stringify(req.app.locals.serverData[index]) ;
    	    }
		}
        str = str + '}';
        req.app.locals.serverData = JSON.parse(str);
    	res.json({message : "the key: " + key + " is deleted"})
    }
    else { res.json({message : "the key does not exist"})};
});



router.put('/:key', function(req, res, next)      //Put:  update an existing key/value
{
    var key = req.params.key;  
    if(req.app.locals.serverData.hasOwnProperty(key)) 
    {
	    var str = '{';
        for (var index in req.app.locals.serverData) 
        {
    		if(index != key )
    	    { 
    	      if(str == '{') str =  str + '"' + index + '": ' + JSON.stringify(req.app.locals.serverData[index]) ;
    	      else str =  str + ','  + '"' + index + '": ' + JSON.stringify(req.app.locals.serverData[index]) ;
    	    }
    	    if(index == key )
    	    { 
    	      if(str == '{') str =  str + '"' + key + '": ' + JSON.stringify(req.body) ;
    	      else str =  str + ',' + '"' + key + '": ' + JSON.stringify(req.body) ;
    	    }
		}
        str = str + '}';
        req.app.locals.serverData = JSON.parse(str);
    	res.json({message : "the key: " + key + " is updated"})
    }
    else { res.json({message : "the key "+ key + " does not exist"});}
});



module.exports = router;