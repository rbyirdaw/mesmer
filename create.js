
var _vis = {};

//=============================================================================

function init() {
    _vis = {
        resData: [],
	pwDist: [],
	pwDistMin: 12,
        resPairGap: 3,
	nodes: [],
	edges: [],
	force: undefined,
//        node: undefined,
//        link: undefined,
	numRes: undefined
    };

$(document).ready(function() {

    $("[name='minDist']").html(_vis.pwDistMin);

    $("input[name='pwDistMinSelect']")
	.on("change", function() {
		_vis.pwDistMin = +this.value;
		$("[name='minDist']").html(this.value);
		console.log(this.value);

		getResNodesEdges();
		setNodesLinks();
    });

    $("[name='resPairGap']").html(_vis.resPairGap);

    $("input[name='resPairGapSelect']")
	.on("change", function() {
		_vis.resPairGap = +this.value;
		$("[name='resPairGap']").html(this.value);
		console.log(this.value);

		getResNodesEdges();
		setNodesLinks();
    });

  });
    
}//init
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
	getResNodesEdges();

	build_force_layout();
	setNodesLinks();
      });
	
}//read_pdb_csv


//rand_pw_distances();
//=============================================================================

init();
createDisplay("coordinates/1le1.csv");



