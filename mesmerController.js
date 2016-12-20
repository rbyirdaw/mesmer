/*mesmer controller*/

(function(window) {

  function MesmerController(model, view) {

    this.model = model;
    this.view = view;

  }

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Controller = MesmerController;

})(window);
