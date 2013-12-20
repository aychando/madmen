var express   = require('express'),
    http      = require('http'),
    madmen    = require('../lib'),
    mongoose  = require('mongoose'),
    // setting  'app' to the return of express() function, which is an application with only defaults
    // which we modify using the express functions (e.g. app.use(), app.get(), app.configure().. )
    app       = express();

// defining schema of mongoDB
var kittySchema = mongoose.Schema({
    name: String,
    age: String,
    food: String
});
// compiling schema to a model
var Kitten = mongoose.model('Kitten', kittySchema);

mongoose.connect('mongodb://localhost/madmen_example');

app.configure(function(){
  app.set('view engine', 'jade');
});

// dev defines the root 'route', specified as '/kittens', the base url we define everything at
// calling the 'madmen' function and passing in the object as a param
// mounting madmen subapp @ '/admin'

var adminSubapp = madmen({
  routes : { 
    '/kittens' : 'Kitten'
  },
  basePath : '/admin'
})

// adminSubapp is the return of madmen() as an object (the express app!)
app.use('/admin', adminSubapp);

var server = http.createServer(app);
server.listen(3001, function(){
  console.log('Express server listening on port 3001');
});


(function a(){console.log('Hi')})();

