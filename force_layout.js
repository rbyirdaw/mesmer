

function build_force_layout() {

//  var resNodesEdges = getResNodesEdges();			
  var width = 640,
      height = 480;

 
  var svg = d3.select('.svg_holder').append('svg')
    .attr('width', width)
    .attr('height', height);

  
  _vis.force = d3.layout.force()
    .size([width, height])
    .nodes(_vis.nodes)				
    .links(_vis.edges)
    .linkDistance([150])
    .charge([-700])
    .on("tick", tick);
//    .start();

/*
  var _vis.link = svg.selectAll(".link")
    .data(resNodesEdges.edges)
    .enter()
    .append("g")
    .attr("class", "link");

  _vis.link
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);
    
  var _vis.node = svg.selectAll(".node")
    .data(resNodesEdges.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag);

  _vis.node
    .append("circle")
    .attr("r", 10)
    .style("fill", function(d, i) {
      return colors(i);
    });

    addNodesEdges();
*/
} // build_force_layout

function setNodesLinks() {
  var color = d3.scale.category20();
  var node = d3.select("svg").selectAll(".g-node"),
      link = d3.select("svg").selectAll(".g-link");

  //Begin node + edge additions

  //link = link.data(_vis.edges);
  link =  link.data(_vis.force.links(), function(d) { console.log(d);
    return d.source.resNum + "-" + d.target.resNum; 
  });

  var linkEnter = link.enter()
	.append("g")
	.attr("class", "g-link");

  linkEnter.append("line").attr("class", "link");

  linkEnter.append("text")
	.attr("dy",".35em")
        .attr("text-anchor", "middle")
	.text(function(d) {
	        return d.distance;
	 });

  link.exit().remove();


  node = node.data(_vis.nodes, function(d) {return d.resNum; } );
//  node = node.data(_vis.nodes);
  var nodeEnter = node.enter()
	.append("g")
	.attr("class", "g-node")
	.call(_vis.force.drag);

	nodeEnter.append("circle")		
		.attr("r", 16)
		.attr("fill", function(d) { return color(d.resNum);});

	nodeEnter.append("text")
	    .attr("dy",".35em")
	    .attr("text-anchor", "middle")
	    .text(function(d) { 
	        return d.resNum;
	 });

  node.exit().remove();

  _vis.force.start();

/*
  _vis.node.append("text")
    .attr("dy",".35em")
    .attr("text-anchor","middle")
    .text(function(d) {
        return d.resNum;
      });

  var linkText = _vis.link.append("text")
    .attr("dy",".35em")
//    .attr("x", function(d) { return d.source.x; } )
  //  .attr("y", function(d) { return d.source.y; } )
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.distance;
      });
*/

}

function tick() {
//  force.on('tick', function(e) {

  var node = d3.select("svg").selectAll(".g-node"),
      link = d3.select("svg").selectAll(".g-link");

  node
	.selectAll("circle")
	.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
 node.selectAll("text")
          .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            });

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


//  force.start();
//  force.alpha(0);




