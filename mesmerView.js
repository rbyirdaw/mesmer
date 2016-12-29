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
	

//==

    var link = d3.select("svg").selectAll(".g-link");

    self.forceLayout.force.links(self.forceLayout.edges);

  //link = link.data(_vis.edges);
    link =  link.data(self.forceLayout.force.links(), function(d) { /*console.log(d);*/
      return d.source + "-" + d.target; 
    });

    var linkEnter = link.enter()
	.append("g")
	.attr("class", "g-link");

    linkEnter.append("line").attr("class", "link");

    linkEnter.append("text")
	.attr("dy",".35em")
        .attr("text-anchor", "middle")
	.text(function(d) {
	        return d.distance.toFixed(2);
	 });

    link.exit().remove();


//==

    self.forceLayout.force.start();	
  }

  
  MesmerView.prototype.setListener = function(action, eveHandler) {

    if (action === "loadStructure") {
      this.structureSelect[0].addEventListener("change", function() {
	//console.log(this.value);
        eveHandler(this.value);
      }, false);

    }
  };

  
  MesmerView.prototype.setNodes = function(nodes) {
    
	this.forceLayout.nodes = nodes;

  };



  MesmerView.prototype.setEdges = function(edges) {

	this.forceLayout.edges = edges;

  };
  
  MesmerView.prototype.tick = function() {
    var node = d3.select("svg").selectAll(".g-node");
    var link = d3.select("svg").selectAll(".g-link");

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
	
//==
  link.selectAll("line")
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

//     linkText
  link.selectAll("text")
            .attr("x", function(d) {
                return ((d.source.x + d.target.x)/2);
            })
            .attr("y", function(d) {
                return ((d.source.y + d.target.y)/2);
            });

  }

  window.mesmerApp = window.mesmerApp || {};
  window.mesmerApp.View = MesmerView;

})(window);
