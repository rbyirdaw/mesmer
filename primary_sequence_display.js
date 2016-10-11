function add(res, terminus) {
  var newRes = '<div class="c2 C ' + terminus + ' ">';
  newRes += '<div class="l2" ' + 'data-resID="' + res.resID + '"' +
    ' data-resNum="' + res.resNum + '">' + 
    res.resID + 
    '<br>' +
    res.resNum +
    '</div>';
    newRes += '</div>';

  //$(newRes).insertAfter(".c2:last");

  $("#primary-seq").append(newRes);
}

//=============================================================================

function attachListener() {
  $(".c2:last").on("click", function() {
    alert("clicked " + $(this).text() + " " +
      $(this).children(".l2").data("resid") + " " +
      $(this).children(".l2").data("resnum"));
  });

}

//=============================================================================

//$(document).ready(function() {
function build_primary_sequence_display() {

  $.each(_vis.resData, function(index, value) {
    var terminus = "";
    if (index === 0) {
      terminus = "N_terminus";
    } else if (index === _vis.resData.length - 1) {
      terminus = "C_terminus";
    }
    add(value, terminus);
    attachListener();

    /*Data must be appended after element is inserted
    $(".c2:last").data({"resNum": structures[0].seq[index].resNum,
    	"resID": structures[0].seq[index].resID})
    	*/
  });

}
//});
