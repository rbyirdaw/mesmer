/*mesmer controller*/

(function(window) {

  function MesmerController(view) {

    this.view = view;
    this.modelList = {};
    this.activeModel = undefined;
    
    this.freeNodes = [];
    this.hideFreeNodes = false;

    this.resPairGapMin = 3;
    this.view.setResPairGapMin(this.resPairGapMin);

    this.pwDistMax = 6;
    this.view.setMaxDist(this.pwDistMax);

    var self = this;
    this.view.setListener("loadStructure", function(fileName) {
      self.loadStructure(fileName);
    });

    this.view.setListener("setMaxDist", function(value) {
      self.setMaxDist(value);
    });
    this.view.setListener("setResPairGapMin", function(value) {
      self.setResPairGapMin(value);
    });
    this.view.setListener("toggleFreeRes", function(value) {
      self.toggleFreeRes(value);
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
        self.view.setRangeMax('resPairGapSelect', data.length);

      });//d3.text

    } else {

      var pwDist = self.modelList[value].getPWdistances();
 
      var edges = self.getEdges(pwDist);
      self.view.setEdges(edges);

      var nodes = self.getNodes(self.modelList[value].getResData());
      self.view.setNodes(nodes);
	
      self.view.create();
        
    }

    self.activeModel = value;

  };

//==============================================================================

  MesmerController.prototype.setMaxDist = function(value) {

    this.pwDistMax = value;

    var pwDist = this.modelList[this.activeModel].getPWdistances(); 

    this.view.toggleNodes(this.freeNodes, false);

    var edges = this.getEdges(pwDist);
    
    if (this.hideFreeNodes) {
      this.view.toggleNodes(this.freeNodes, true);
    }

    this.view.setEdges(edges);
    this.view.update();
  };

//==============================================================================

  MesmerController.prototype.setResPairGapMin = function(value) {
    this.resPairGapMin = value;

    var pwDist = this.modelList[this.activeModel].getPWdistances(); 

    this.view.toggleNodes(this.freeNodes, false);

    var edges = this.getEdges(pwDist);

    if (this.hideFreeNodes) {
      this.view.toggleNodes(this.freeNodes, true);
    }

    this.view.setEdges(edges);
    this.view.update();
  };

//==============================================================================

  MesmerController.prototype.toggleFreeRes = function(value) {

    this.hideFreeNodes = value;
    this.view.toggleNodes(this.freeNodes, value);
  
  }


//==============================================================================

  MesmerController.prototype.getEdges = function(pwDist) {
  
    var i, j;
    var edges = [];
    var numRes = pwDist.length;
    var iLinked;

    this.freeNodes = [];

    for (i = 0; i <= numRes; i++) {
      this.freeNodes.push(i);
    }



    for (i = 0; i < numRes; i++) {
      
//      iLinked = false;
//      this.freeNodes.push(i);

      for (j = i; j <= numRes; j++) {
        
        if (j !== i) {
	  
          if ( (Math.abs(i - j) >= this.resPairGapMin) &&
	      (pwDist[i][j] <= this.pwDistMax) ) {

	    edges.push({source: i, target: j, "distance": pwDist[i][j]});

//            iLinked = true;
            if (this.freeNodes.indexOf(i) !== -1) {
              this.freeNodes.splice(this.freeNodes.indexOf(i), 1);
            }
            if (this.freeNodes.indexOf(j) !== -1) {
              this.freeNodes.splice(this.freeNodes.indexOf(j), 1);
            }

	  }

        } //(j != i)

      }//j

/*
      if (!iLinked) {
        this.freeNodes.push(i); 
        if (i === (numRes - 1)) {
          this.freeNodes.push(numRes);
        }

      } else if (iLinked && (this.freeNodes.indexOf(i) !== -1) ) {
        this.freeNodes.splice(this.freeNodes.indexOf(i), 1);
      }
*/

    
    }//i

    //console.log(this.freeNodes.sort());

    return edges;

  };


//==============================================================================

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
