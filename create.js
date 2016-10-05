
var _vis = {};

//=============================================================================

function init() {
    _vis = {
        resData: [],
	pwDist: [],
	pwDistMin: 12,
	numRes: undefined
    };

$(document).ready(function() {
    $("input[name='pwDistMinSelect']")
	.on("change", function() {
		_vis.pwDistMin = this.value;
		$(".pwDistMinDisplay").html(this.value);
		console.log(this.value);
	});
  });
}
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
function createDisplay(fileName) {

  d3.csv(fileName,
      function(d) {
        return {resNum: +d.resNum, resID: d.resID, x: +d.x, y: +d.y, z: +d.z} ;
      },
      function(data) {      
        _vis.resData = data;

        _vis.numRes = _vis.resData.length;
        console.log(_vis.numRes+" CA atoms read.");

	build_primary_sequence_display();

	calc_pw_distances();

	build_force_layout();
      });
	
}//read_pdb_csv


//rand_pw_distances();
//=============================================================================

init();
createDisplay("coordinates/1le1.csv");



