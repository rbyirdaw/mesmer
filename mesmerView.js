/*mesmer view*/

(function(window) {

  function MesmerView() {

    this.structureSelect = document.querySelector("[name='structureSelect']");
    this.maxDistSelect = document.querySelector("[name='maxDistSelect']");
    this.resPairGapSelect = document.querySelector("[name='resPairGapSelect']");
    this.maxDist = document.querySelector("[name='maxDist']");
    this.resPairGapMin = document.querySelector("[name='resPairGapMin']");
    this.toggleFreeRes = document.querySelector("[name='toggleFreeRes']");
	
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

    if (d3.select("svg")) {
      d3.select("svg").remove();
      d3.select('.svg-holder').append('svg')
          .attr('width', 640)
          .attr('height', 480);
    }
	
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
	      return d.resID+"\n"+(d.resNum);
	    });

	node.exit().remove();	
	

//==

    self.setLinks();

//==

    self.forceLayout.force.start();	
  }

//==============================================================================
  MesmerView.prototype.toggleNodes = function(nodes, hide) {
  
    var allNodes = d3.selectAll(".g-node")[0];

    for (i = 0; i < nodes.length; i++) {
      if (hide) {
        d3.select(allNodes[nodes[i]])
	    .style({'display': 'none'});
      } else {
        d3.select(allNodes[nodes[i]])
	    .style({'display': 'block'});
      }
    }

  }

//==============================================================================

  MesmerView.prototype.update = function() {
    this.setLinks();
    this.forceLayout.force.start();	
  }

//==============================================================================

  MesmerView.prototype.setLinks = function() {

    var self = this;
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


  };
//==============================================================================
  
  MesmerView.prototype.setListener = function(action, eveHandler) {
    var self = this;

    if (action === "loadStructure") {
      this.structureSelect.addEventListener("change", function() {
	//console.log(this.value);
        eveHandler(this.value);
      }, false);

    } else if (action === "setMaxDist") {
      this.maxDistSelect.addEventListener("change", function() {
	//console.log(this.value);
	self.maxDist.innerHTML = this.value;
        eveHandler(+this.value);
      }, false);

    } else if (action === "setResPairGapMin") {
      this.resPairGapSelect.addEventListener("change", function() {
	//console.log(this.value);
	self.resPairGapMin.innerHTML = this.value;
        eveHandler(+this.value);
      }, false);
    } else if (action === "toggleFreeRes") {
      this.toggleFreeRes.addEventListener("change", function() {
        eveHandler(this.checked);
      }, false);
    }


  };



//==============================================================================

  MesmerView.prototype.setMaxDist = function(value) {
    this.maxDist.innerHTML = value;
    this.maxDistSelect.value = value;
  };

//==============================================================================

  MesmerView.prototype.setResPairGapMin = function(value) {
    this.resPairGapMin.innerHTML = value;
    this.resPairGapSelect.value = value;
  };
  
//==============================================================================
  
  MesmerView.prototype.setRangeMax = function(rangeName, rangeMax) {

    if (rangeName === 'maxDistSelect') {
    } else if (rangeName === 'resPairGapSelect') {

      this.resPairGapSelect.max = rangeMax;

    }

}

//==============================================================================

  MesmerView.prototype.setNodes = function(nodes) {
    
	this.forceLayout.nodes = nodes;

  };

//==============================================================================

  MesmerView.prototype.setEdges = function(edges) {

	this.forceLayout.edges = edges;

  };

//==============================================================================  

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
