/*mesmer app init*/
(function() {
  
  var model,
      view,
      controller;

  model = new mesmerApp.Model();

  view = new mesmerApp.View();

  controller = new mesmerApp.Controller(model, view);

})();
