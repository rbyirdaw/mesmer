/*mesmer view*/

(function(window) {

  function MesmerView() {

    this.structureSelect = document.getElementsByName("structureSelect");
    this.pwDistSelect = document.getElementsByName("pwDistSelect");
    this.resPairGapSelect = document.getElementsByName("resPairGapSelect");

  }

  MesmerView.prototype.setListener = function(action, eveHandler) {

    if (action === "loadStructure") {
      this.structureSelect[0].addEventListener("change", function() {
	console.log(this.value);
        eveHandler(this.value);
      }, false);

    }
  }

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.View = MesmerView;

})(window);
