/*mesmer model*/

(function(window) {
  
  function MesmerModel() {

    this.name = undefined;
    this.numRes = undefined;
    this.resData = undefined;
    this.pwDist = [];

  }

  MesmerModel.prototype.create = function(data) {

    this.resData = data;
    this.numRes = data.length;

    this.calcPWdistance();

  };

  MesmerModel.prototype.getResData = function() {
    return this.resData;
  }

  MesmerModel.prototype.calcPWdistance = function() {

    var i, j;

    for (i = 0; i < (this.numRes - 1); i++) {

      this.pwDist[i] = [];

      for (j = (i + 1); j < this.numRes; j++) {
        this.pwDist[i][j] = Math.sqrt(
	    Math.pow((this.resData[i].x - this.resData[j].x), 2) +
	    Math.pow((this.resData[i].y - this.resData[j].y), 2) +
	    Math.pow((this.resData[i].z - this.resData[j].z), 2) );
      }//j	
    }//i

  };

  MesmerModel.prototype.getPWdistances = function() {
    return this.pwDist;
  }

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Model = MesmerModel;

})(window);
