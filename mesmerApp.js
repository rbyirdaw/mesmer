/*mesmer app init*/
(function() {
  
  var model,
      view,
      controller,
	  structures;
	  
  
  var structList = document.getElementsByName("structureSelect");
  
  structures = new mesmerApp.Structures();

  model = new mesmerApp.Model();

  view = new mesmerApp.View();

  controller = new mesmerApp.Controller(model, view);

})();
