
This is RESTful API implemented with  node.js/express as the http server

1,How to run the app?
Unzip the files. Then in Linux/Mac command window, go to the unzipped directory and run "sudo node app.js"  (using sudo because node is using port 80)

2,Versioning.
The API version could be set in config.js ( version =1.0 or 2.0), which will in turn use different routing scripts.
(1.0 and 2.0 have identical files in this demo)

3,How to Test the API?
You could use any tool of your choice or use "curl" command, I'm using a Chrome Extension call postman (https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) to mock http request.

4, API
get  /   will return all key/value                                              i.e.   /
get  /key  will return a specific key/value if it exists                        i.e.   /sports
post /key  with value as JSON format will add a key/value if it does not exist  i.e.   /animal   ["cats", "dogs"] 
put  /key   with value as JSON format will update a key/value if it exists      i.e    /animal   ["rats", "birds"]
delete /key  will delete a key/value if it exists                               i.e    /animal

5,backing store
There are 2 backing stores which can be set in config.js
1, Server variable. This is used when config.dataStore= 'local';
2, MySQL database. This is used when config.dataStore= 'db';

6. asynchronous handling:
simultaneous:
2.0/router_db.js  router.put('/:key', function(req, res, next){} 
With async library, the call of two SQL query are run simultaneous and their results are returned to one single callback function

chained 
2.0/router_db.js   router.delete('/:key', function(req, res, next){}  
With async library, the 2nd query will only be run after the 1st query is finished.


