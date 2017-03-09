/*mesmer app init*/
(function() {
  
  var view,
      controller;

  view = new mesmerApp.View();

  controller = new mesmerApp.Controller(view);

  //load default
  controller.loadStructure("1le1.csv");

})();
