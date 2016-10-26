
var _vis = {};

//=============================================================================

function init() {
    _vis = {
        resData: [],
	pwDist: [],
	pwDistMax: 6,
        resPairGapMin: 3,
	nodes: [],
	edges: [],
	force: undefined,
//        node: undefined,
//        link: undefined,
	numRes: undefined
    };

$(document).ready(function() {

    $("[name='maxDist']").html(_vis.pwDistMax);
    $("input[name='pwDistSelect']").val(_vis.pwDistMax);
    $("input[name='pwDistSelect']")
	.on("change", function() {
		_vis.pwDistMax = +this.value;
		$("[name='maxDist']").html(this.value);
		console.log(this.value);

		getResNodesEdges();
		setNodesLinks();
    });

    $("[name='resPairGapMin']").html(_vis.resPairGapMin);
    $("input[name='resPairGapSelect']").val(_vis.resPairGapMin);
    $("input[name='resPairGapSelect']")
	.on("change", function() {
		_vis.resPairGapMin = +this.value;
		$("[name='resPairGapMin']").html(this.value);
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
	_vis.nodes.push({resNum: +d.resNum, resID:"", resName:""});
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
//createDisplay("coordinates/1le1.csv");
createDisplay("coordinates/1l2y.csv");
//createDisplay("coordinates/4hhb.csv");



