/*mesmer view*/

(function(window) {

  function MesmerView() {

    this.structureSelect = document.getElementsByName("structureSelect");
    this.pwDistSelect = document.getElementsByName("pwDistSelect");
    this.resPairGapSelect = document.getElementsByName("resPairGapSelect");
	
	this.forceLayout = {
	  force: undefined,
      nodes: undefined,
      links: undefined,

      color: d3.scale.category20()  
	};

  }

//==============================================================================
  
  MesmerView.prototype.create = function() {
	
	var self = this;
	
    self.forceLayout.force = d3.layout.force()
		.size([640, 480])
        .nodes(self.forceLayout.nodes)
		.linkDistance([150])
		.charge([-150])
		.on("tick", self.tick);
	
    var node = d3.select("svg").selectAll(".g-node");
	node = node.data(self.forceLayout.nodes);

	var nodeEnter = node.enter()
		.append("g")
		.attr("class", "g-node")
		.call(self.forceLayout.force.drag);

	nodeEnter.append("circle")		
		.attr("r", 26)
		.attr("fill", function(d) { 
		  return self.forceLayout.color(d.resNum);
		});

	nodeEnter.append("text")
	    .attr("dy",".35em")
	    .attr("text-anchor", "middle")
	    .text(function(d) { 
	      return d.resID+"\n"+(d.resNum+1);
	    });

	node.exit().remove();	
	

    self.forceLayout.force.start();	
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
  
  MesmerView.prototype.tick = function() {
    var node = d3.select("svg").selectAll(".g-node");

    node.selectAll("circle")
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
	node.selectAll("text")
		.attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        });
	
  }

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.View = MesmerView;

})(window);
