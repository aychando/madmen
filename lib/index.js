var _         = require('lodash'),
    express   = require('express'),
    app       = express(),
    mongoose  = require('mongoose');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.set('views', __dirname + '/views');
});


var controller = {

  index : function(option,req,res) {
    var model = mongoose.model(option.modelName);

    model.find({}, function(err, docs){
      res.render('index',{
        models : docs,
        fullPath : option.basePath
      })
    });
  },

  show : function(option, req, res) {
    var model = mongoose.model(option.modelName);
    var modelId = req.params.id;
    model.findById(modelId, function(err, doc){
      res.render('show', { 
        action : option.basePath + "/" + modelId,
        model : doc,
        fullPath : option.basePath
      });
    });
  },

  new : function(option, req, res) {
    var model = mongoose.model(option.modelName);
    var newModel = new model();
    res.render('new', {
      model : newModel,
      action : option.basePath + "/" + 'create'
    });
  },

  create : function(option, req, res) {
    var model = mongoose.model(option.modelName);
    // JSON.parse will parse valid JSON doc and create an object from that
    console.log(JSON.parse(req.body.modelDataTextArea));
    var newModel = new model(JSON.parse(req.body.modelDataTextArea));
    newModel.save(function(err){
      res.redirect(option.basePath);
    });
  },

  edit : function(option, req, res) {
    var model = mongoose.model(option.modelName);
    var modelId = req.params.id;
    model.findById(modelId, function(err, doc){
      res.render('new', {
        //  _.omit takes in an object and removes the properties in second param.
        // toObject converts weird mongoose format to object we can user
        model : _.omit(doc.toObject(), [ "_id", "__v"]),
        // action is getting the full path here, / is important too 
        action : option.basePath + "/" + modelId
      });
    });
  },

  update : function(option, req, res) {
    var model = mongoose.model(option.modelName);
    var modelId = req.params.id;
    var updatemodelValues = JSON.parse(req.body.modelDataTextArea);
    model.update( {_id : modelId}, updatemodelValues,
      function(err){
        res.redirect(option.basePath);
    });
  },

  destroy : function( option, req, res) {
    var model = mongoose.model(option.modelName);
    var modelId = req.params.id;
    model.remove( {_id : modelId}, function(err){
      res.redirect(option.basePath);
    });
  }

}

// the value of madmen is equal to this module.exports.
// madmen is called in example/index via require, and the module.exports function is what is being returned to example/index
// module.exports is a node specific convention. 

// this is the return of madmen = require('..lib'), defined by the developer (example/index.js)
// module.exports being the return of express
module.exports = function(options) {

  // options = the object we passed when we called madmen in example/index
  // _.forOwn loops over properties in an object that are defined by a developer (options.routes here)
  // _.forOwn params ( first param = object , second param = function to call on each property-value pair in that obj)
  _.forOwn(options.routes, function(modelName, route){
   
    // this object is passed into the controllers
    //
    var controllerOption = {
      modelName : modelName,
      basePath : options.basePath + route
    };
   
    // Setup routes for each model  

    // Index
    // controller.index is the function (defined in the controllers)
    app.get(route, controller.index.bind(null, controllerOption));
    // New
    app.get(route+'/new', controller.new.bind(null, controllerOption));
    // Create
    app.post(route+'/create', controller.create.bind(null, controllerOption));
    // Show
    app.get(route+'/:id', controller.show.bind(null, controllerOption));
    // Edit
    app.get(route+'/:id/edit', controller.edit.bind(null, controllerOption));
    // Update
    app.post(route+'/:id', controller.update.bind(null, controllerOption));
    // Delete
    // to get the server to read delete, have to get the server to send a specific thing.. 
    app.del(route+'/:id', controller.destroy.bind(null, controllerOption));

  });
  
  // this is the return of the madmen function! 
  return app;
}