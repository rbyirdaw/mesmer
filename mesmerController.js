/*mesmer controller*/

(function(window) {

  function MesmerController(model, view) {

    this.model = model;
    this.view = view;

    this.view.setListener("loadStructure", this.loadStructure);

  }

  MesmerController.prototype.loadStructure = function(value) {
    console.log("at controller "+value);
  };


  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Controller = MesmerController;

})(window);
