/*mesmer view*/

(function(window) {

  function MesmerView() {

    this.structureSelect = document.getElementsByName("structureSelect");
    this.pwDistSelect = document.getElementsByName("pwDistSelect");
    this.resPairGapSelect = document.getElementsByName("resPairGapSelect");
	
	this.forceLayout = {
	  force: undefined,
      nodes: undefined,
      links: undefiend,

      color: d3.scale.category20();	  
	};

  }
  
  MesmerView.prototype.create = function() {
	
    this.forceLayout.force = d3.layout.force()
        .nodes(this.forceLayout.nodes)
		.linkDistance([150])
		.charge([-150])
		.on("tick", tick);
		
    var node = d3.select("svg").selectAll(".g-node");		
	  
  }

  MesmerView.prototype.setListener = function(action, eveHandler) {

    if (action === "loadStructure") {
      this.structureSelect[0].addEventListener("change", function() {
	console.log(this.value);
        eveHandler(this.value);
      }, false);

    }
  };

  MesmerView.prototype.setNodes = function(nodes) {
    
	this.forceLayout.nodes = nodes;

  };



  MesmerView.prototype.setEdges = function(edges) {


  };

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.View = MesmerView;

})(window);
