var express   = require('express'),
    http      = require('http'),
    madmen    = require('../lib'),
    mongoose  = require('mongoose'),
    app       = express();

// defining schema of mongoDB
var kittySchema = mongoose.Schema({
    name: String,
    age: String,
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
app.use('/admin', madmen( {
  routes : { 
    '/kittens' : 'Kitten'
  },
  basePath : '/admin'
}));

var server = http.createServer(app);
server.listen(3001, function(){
  console.log('Express server listening on port 3001');
});


app.use(madmen({
  routes : {
    route :
  }
  basePath : 
})

  )