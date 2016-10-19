



//=============================================================================

function getResNodesEdges() {
  var 
/*resNodesEdges = {
    nodes: [],
    edges: []
  },
*/
  i, j, numEdges;

  numEdges = 0;
  for (i = 0; i < _vis.numRes; i++) {
    //resNodesEdges.nodes.push({resNum: i, resID:"", resName:""});
    _vis.nodes.push({resNum: i, resID:"", resName:""});
    for (j = i; j < _vis.numRes; j++) {
      if ( (j !== i) && (_vis.pwDist[i][j] > _vis.pwDistMin) ) {
//        resNodesEdges.edges.push({source: i, target: j, "distance": _vis.pwDist[i][j]});
	_vis.edges.push({source: i, target: j, "distance": _vis.pwDist[i][j]});
      } //if j !== i
    }
  } //for i

//  return resNodesEdges;

} //getResNodesEdges


//=============================================================================

/*
function rand_pw_distances() {

  for (var i = 0; i < numRes; i++) {
    pw_distances[i] = [];
    tempStr = "";
    for (var j = (i + 1); j < numRes; j++) {
      pw_distances[i][j] = 1 + Math.floor(Math.random() * 12);
      tempStr += (pw_distances[i][j] + " ");
    }
    console.log(tempStr);
  }

}
*/
//=============================================================================
function calc_pw_distances() {

  for (var i = 0; i < _vis.numRes; i++) {
    _vis.pwDist[i] = [];
    tempStr = "";
    for (var j = (i + 1); j < _vis.numRes; j++) {
      _vis.pwDist[i][j] = Math.sqrt(
				Math.pow( (_vis.resData[i].x - _vis.resData[j].x), 2 ) +
				Math.pow( (_vis.resData[i].y - _vis.resData[j].y), 2) + 
				Math.pow( (_vis.resData[i].z - _vis.resData[j].z), 2) 
				).toFixed(2);
      tempStr += (_vis.pwDist[i][j] + " ");
    }
    //console.log(tempStr);
  }

}

//=============================================================================
