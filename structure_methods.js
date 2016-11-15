



//=============================================================================

function getResNodesEdges() {
  var i, j, numEdges;
  
  _vis.edges = [];
  _vis.linkedNodes = [];
  numEdges = 0;
  for (i = 0; i < _vis.numRes; i++) {

    for (j = i; j < _vis.numRes; j++) {
      if ( (j !== i) && 
		(Math.abs(i - j) >= _vis.resPairGapMin) &&
		(_vis.pwDist[i][j] <= _vis.pwDistMax) ) {
	
	_vis.edges.push({source: i, target: j, "distance": _vis.pwDist[i][j]});
	//track linked nodes as well
	if (_vis.linkedNodes.indexOf(i) === -1) {
	  _vis.linkedNodes.push(i);
	}
	if (_vis.linkedNodes.indexOf(j) === -1) {
	  _vis.linkedNodes.push(j);
	}
	
      } //if j !== i
    }
  } //for i


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
