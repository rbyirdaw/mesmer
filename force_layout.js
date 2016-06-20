
//=============================================================================

function getResNodesEdges() {
  var resNodesEdges = {
    nodes: [],
    edges: []
  },
  i, j, numEdges;

  numEdges = 0;
  for (i = 0; i < _vis.numRes; i++) {
    resNodesEdges.nodes.push({resNum: i, resID:"", resName:""});
    for (j = i; j < _vis.numRes; j++) {
      if ( (j !== i) && (_vis.pwDist[i][j] > 12) ) {
        resNodesEdges.edges.push({source: i, target: j, "distance": _vis.pwDist[i][j]});
      } //if j !== i
    }
  } //for i

  return resNodesEdges;

} //getResNodesEdges


//=============================================================================

function build_force_layout() {

  var resNodesEdges = getResNodesEdges();			
  var width = 640,
      height = 480;

 
  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

  
  var colors = d3.scale.category20();

  var force = d3.layout.force()
    .size([width, height])
    .nodes(resNodesEdges.nodes)				
    .links(resNodesEdges.edges)
    .linkDistance([150])
    .charge([-700])
    .start();

  var link = svg.selectAll(".link")
    .data(resNodesEdges.edges)
    .enter()
    .append("g")
    .attr("class", "link");

  link
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);
    
  var node = svg.selectAll(".node")
    .data(resNodesEdges.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag);

  node
    .append("circle")
    .attr("r", 10)
    .style("fill", function(d, i) {
      return colors(i);
    })


  //Begin node + edge additions

  node.append("text")
    .attr("dy",".35em")
    .attr("text-anchor","middle")
    .text(function(d) {
        return d.resNum;
      });

  var linkText = link.append("text")
    .attr("dy",".35em")
//    .attr("x", function(d) { return d.source.x; } )
  //  .attr("y", function(d) { return d.source.y; } )
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.distance;
      });

  force.on('tick', function(e) {

    node
      .attr("transform", function(d) { return "translate(" + d.x +"," + d.y +")"; });

    link.selectAll("line")
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

     linkText
            .attr("x", function(d) {
                return ((d.source.x + d.target.x)/2);
            })
            .attr("y", function(d) {
                return ((d.source.y + d.target.y)/2);
            });

  });



//  force.start();
//  force.alpha(0);

} // build_force_layout


