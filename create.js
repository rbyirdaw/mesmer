
var _vis = {};

//=============================================================================

$(document).ready(function() {

    $("[name='maxDist']").html(_vis.pwDistMax);
    $("input[name='pwDistSelect']").val(_vis.pwDistMax);
    $("input[name='pwDistSelect']")
	.on("change", function() {
		_vis.pwDistMax = +this.value;
		$("[name='maxDist']").html(this.value);
		console.log(this.value);

		getResNodesEdges();
		setLinks();
		_vis.force.start();
    	});

    $("[name='resPairGapMin']").html(_vis.resPairGapMin);
    $("input[name='resPairGapSelect']").val(_vis.resPairGapMin);

    $("input[name='resPairGapSelect']")
	.on("change", function() {
		_vis.resPairGapMin = +this.value;
		$("[name='resPairGapMin']").html(this.value);
		console.log(this.value);

		getResNodesEdges();
		setLinks();
		_vis.force.start();
    	});

    $("select[id='structures']")
	.on("change", function() {
		console.log(this.value);

		//clear object and init
		_vis = {};
		init();
		//clear
		d3.select("svg").remove();
		//begin loading new structure
		createDisplay(this.value);

		//TODO: not updating
		$("input[name='resPairGapSelect']").attr("max", _vis.numRes);
	
        });

    $("input[name='hideFreeRes']").prop("checked", _vis.hideFreeRes);
    $("input[name='hideFreeRes']")
	.on("change", function () { 
	  _vis.hideFreeRes = this.checked;
	  console.log("hide free res" + this.checked);
	});

  });//document.ready
    
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
	numRes: undefined,
	//for structures with > 80 residues,
	//provide user option to hide residues not matching filter criteria (free)
        hideFreeRes: true
    };

}//init

//=============================================================================

function createDisplay(fileName) {

  d3.csv("coordinates/"+fileName,
      function(d) {
	_vis.nodes.push({resNum: +d.resNum, resID: d.resID, resName:""});
        return {resNum: +d.resNum, resID: d.resID, x: +d.x, y: +d.y, z: +d.z} ;
      },
      function(data) {

        _vis.resData = data;

        _vis.numRes = _vis.resData.length;
        console.log(_vis.numRes+" CA atoms read.");

	//hold-off on primary sequence display - somewhat redundant for now
//	build_primary_sequence_display();

	calc_pw_distances();
	getResNodesEdges();

	build_force_layout();
	setLinks();
	_vis.force.start();

	$("input[name='resPairGapSelect']").attr("max",_vis.numRes);

      });
	
}//read_pdb_csv


//rand_pw_distances();
//=============================================================================

init();
createDisplay("1le1.csv");



