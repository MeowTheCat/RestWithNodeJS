var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'deal.cpg8bvjgkezo.us-east-1.rds.amazonaws.com',
  user     : '****',
  password : '****',
  database : 'rest'
});

var async  = require('async');

connection.connect(function(err) {if (err)  { next(err); } });   //conect to the database 

router.get('/', function(req, res, next)      //GET :  read all key/value
{
    var query = 'select id,content from serverdata;' ;
    var result ;
    connection.query(query, function(err, rows, fields) 
    {
        if (err)  { next(err); }
        else
        { 
            if(rows.length ==0) result ='{}';
            else 
            {
                result ='{"' + rows[0].id + '":' + rows[0].content;
                for(i=1 ; i<rows.length;i++ )
                { result = result + ', "' + rows[i].id + '":' + rows[i].content; }
                result = result +'}';    
            }
            res.json(JSON.parse(result));
        }
    });
   
});


router.get('/:key', function(req, res, next)    //GET:  read a specif key/value
{  
    var key = req.params.key;

    var query = 'select id,content from serverdata where id = "'+ key + '";' ;
    var result ;
    connection.query(query, function(err, rows, fields) 
    {
        if (err)  { next(err); }
        else
        { 
            if(rows.length ==0)  { res.json({message : "the key does not exist"});} 
            else 
            {
                result =  '{ "' + rows[0].id + '":' + rows[0].content + '}';             
                res.json(JSON.parse(result));
            }
        }
    });
   
});

router.post('/:key', function(req, res, next)      //Post:  create a new key/value
{
    var key = req.params.key;   

    // sequential execution
    async.waterfall([
    function(callback) 
    {  //check if the key exists
        var query = 'select id from serverdata where id = "'+ key + '";' ;  
        connection.query(query, function(err, rows, fields) 
        {
            if (err)  { next(err); }
            else callback(null, rows.length);
        });   
    },
    function(arg1, callback) 
    {   //insert the key/value if it does not exist
        if(arg1 == 1) { res.json({message : "the key already exists"});}
        else 
        {
            var query = "insert into serverdata (id, content) values('" + key + "', '" + JSON.stringify(req.body) + "')" ;
            connection.query(query, function(err, result) 
            {
                if (err)  { next(err); }
                else if(result.affectedRows == 1)  res.json({message : "the key: " + key + " is created"});
                else  res.json({message : "the key: " + key + " can not be created"});
            });   
        }
        callback(null, 'done');
    }
    ]);

});


router.delete('/:key', function(req, res, next)      //Delete:  delete a key/value
{
    var key = req.params.key;  

    // sequential execution
    async.waterfall([
    function(callback) 
    {  //check if the key exists
        var query = 'select id from serverdata where id = "'+ key + '";' ;  
        connection.query(query, function(err, rows, fields) 
        {
            if (err)  { next(err); }
            else callback(null, rows.length);
        });   
    },
    function(arg1, callback) 
    {   //insert the key/value if it does not exist
        if(arg1 == 0) { res.json({message : "the key does not exist"});}
        else 
        {
            var query = "delete from serverdata  where id =  '" + key + "'" ;
            connection.query(query, function(err, result) 
            {
                if (err)  { next(err); }
                else if(result.affectedRows == 1)  res.json({message : "the key: " + key + " is deleted"});
                else  res.json({message : "the key: " + key + " can not be deleted"});
            });   
        }
        callback(null, 'done');
    }
    ]);
});



router.put('/:key', function(req, res, next)      //Put:  update an existing key/value
{
    var key = req.params.key;  
    //simultaneous execution of 1, verify the key exisits; 2, update the key. We need both functions to return 1.
    async.parallel([
    function(callback){  //check if the key exists.
        var query = 'select id from serverdata where id = "'+ key + '";' ;  
        connection.query(query, function(err, rows, fields) 
        {
            if (err)  { callback(err,0) ;}
            else callback(null, rows.length);
        });   
    },
    function(callback){  //update the key if it exists
        var query = "update serverdata set content = '" + JSON.stringify(req.body) + "' where id = '"+ key + "';" ;  
        connection.query(query, function(err, result) 
        {
            if (err)  { callback(err,0) ;}
            else callback(null, result.affectedRows);
        });  
    }
    ],
    function(err, results){
        if (err)  { next(err); }
        else if(results[0] == 0) { res.json({message : "the key "+ key + " does not exist"});}
        else if(results[1] != 1) { res.json({message : "the key "+ key + " can not be updated"});}
        else  { res.json({message : "the key "+ key + " is updated"});}
    });

});


module.exports = router;