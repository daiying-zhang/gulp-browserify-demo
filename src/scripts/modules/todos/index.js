var view = require('./src/view');
var model = require('./src/model');
var controller = require('./src/controller');

view.initialize('#j-todos');

controller.initialize(view, model);
