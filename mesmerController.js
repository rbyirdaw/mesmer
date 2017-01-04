/*mesmer controller*/

(function(window) {

  function MesmerController(view) {

    this.view = view;
    this.modelList = {};

    this.resPairGapMin = 3;
    this.pwDistMax = 6;

    var self = this;
    this.view.setListener("loadStructure", function(fileName) {
	self.loadStructure(fileName);
    });

  }
  
//==============================================================================  

  MesmerController.prototype.loadStructure = function(value) {
    console.log("at controller "+value);

    var data = undefined;
    var self = this;

    if (self.modelList[value] === undefined) {

      d3.text("coordinates/"+value, function(text) {

        data = d3.csv.parse(text, function(d) {
	    //console.log(d);
	 	  return {resNum: +d.resNum, resID: d.resID, x: +d.x, y: +d.y, z: +d.z} ;
        });

        var newModel = new mesmerApp.Model();
        newModel.create(data);
        self.modelList[value] = newModel;

        var pwDist = newModel.getPWdistances();
 
        var edges = self.getEdges(pwDist);
        self.view.setEdges(edges);

        var nodes = self.getNodes(data);
        self.view.setNodes(nodes);
	
        self.view.create();

      });//d3.text

    } else {

      var pwDist = self.modelList[value].getPWdistances();
 
      var edges = self.getEdges(pwDist);
      self.view.setEdges(edges);

      var nodes = self.getNodes(self.modelList[value].getResData());
      self.view.setNodes(nodes);
	
      self.view.create();
        
    }


  };

  MesmerController.prototype.getEdges = function(pwDist) {
  
    var i, j;
    var edges = [];
    var numRes = pwDist.length;

    for (i = 0; i < numRes; i++) {

      for (j = i; j < numRes; j++) {
        
        if ( (j !== i) &&
	    (Math.abs(i - j) >= this.resPairGapMin) &&
	    (pwDist[i][j] <= this.pwDistMax) ) {

	  edges.push({source: i, target: j, "distance": pwDist[i][j]});
	}

      }//j

    }//i

    return edges;

  };


  MesmerController.prototype.getNodes = function(data) {

    var i;
    var nodes = [];

    for (i = 0; i < data.length; i++) {
      nodes.push({resNum: data[i].resNum, resID: data[i].resID});
    }

    return nodes;

  };


  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.Controller = MesmerController;

})(window);
