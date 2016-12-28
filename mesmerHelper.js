/*memser structures*/
(function(window) {

  function MesmerStructures() {
    this.structures = {};
  }
  
  MesmerStructures.prototype.read = function(fileNP, pdbID) {
    var self = this;

    d3.text(fileNP, function(text) {

      self.structures[pdbID] = d3.csv.parse(text, function(d) {
	    console.log(d);
		return {resNum: +d.resNum, resID: d.resID, x: +d.x, y: +d.y, z: +d.z} ;
      });
    });
 
  };
  
  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Structures = MesmerStructures;
  
})(window);