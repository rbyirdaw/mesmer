/*mesmer model*/

(function(window) {
  
  function MesmerModel() {

    this.name = undefined;
    this.numRes = undefined;
    this.resData = undefined;
    this.pwDist = [];

  }

  MesmerModel.prototype.calcPWdistance = function() {

  };

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Model = MesmerModel;

})(window);
