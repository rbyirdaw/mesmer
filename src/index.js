
import 'bootstrap/dist/css/bootstrap.min.css';
import { D3Graph } from './components/d3-graph';
import { SelectStructure } from './components/select-structure';
import { getAtomLines, getAtomLinesByAtom, getResidues, getCoordinates, calcPairwiseDistances } from './utils/structure-utils';
import { SpinnerElement } from './components/spinner-element';
import { AlertElement } from './components/alert-element';

customElements.define('spinner-element', SpinnerElement);
customElements.define('alert-element', AlertElement);
customElements.define('select-structure', SelectStructure);
customElements.define('d3-graph', D3Graph);
document.getElementById('mesmer-root')
  .innerHTML = `
    <style>
      #mesmer-root {
        position: relative;
      }
    </style>
    <alert-element></alert-element>
    <spinner-element></spinner-element>
    <select-structure></select-structure>
    <d3-graph width="600" height="400"></d3-graph>
  `;

const mesmerGraph = document.querySelector('d3-graph');
//active values - Mesmer states
let cAlphas;
let cBetas;
let residues;
let resPairwiseDistances = [];
let _distCutoff = 5;
let _maxDistCutoff = 5;
let _resPairGapMin = 5;
let _maxResPairGap = 5;
const MIN_RESIDUES = 4;
const MAX_RESIDUES = 80;



const spinnerEl = document.querySelector('spinner-element');

const structureInfo = document.querySelector('select-structure');
structureInfo.addEventListener('xhr-state', (e) => {
  spinnerEl.enabled = e.detail.value;
});

structureInfo.addEventListener('structure-fetched', (e) => {
  //atoms from response
  const atomLines = getAtomLines(e.detail.value);
  
  //get C-alphas
  cAlphas = getAtomLinesByAtom('CA', atomLines);
  console.log("cAlphas - ", cAlphas);
  //get C-betas
  cBetas = getAtomLinesByAtom('CB', atomLines);
  console.log("cBetas - ", cBetas);

  //see if we have all atoms to calculate pair-wise distances
  if (cAlphas.length > cBetas.length) {
    //adjust for GLY
    cAlphas.forEach((cAlphaLine, index) => {
      if (cAlphaLine.includes('GLY')) {
        cBetas.splice(index, 0, cAlphaLine);      
      }
    });
  }

  residues = getResidues(cBetas);
  const numResidues = residues.length;
  console.log("Number of residues: ", numResidues);
  if (numResidues < MIN_RESIDUES) { 
    console.warn("Error with structure.");
    showAlert("error", "Number of residues < " + MIN_RESIDUES);
  } else if (numResidues > MAX_RESIDUES) {
    //show alert
    console.warn("Number of residues is too large.");
    showAlert("error", "Number of residues > " + MAX_RESIDUES);
  } else {
    //continue on
    //maximum res pair gap
    _maxResPairGap = residues.length - 1;
    console.log(residues);
    
    //update min res pair gap control with initial and max value
    const minResGapControl = document.querySelector("#min-res-gap");
    minResGapControl.setAttribute('max', _maxResPairGap);
    minResGapControl.setAttribute('value', _resPairGapMin);
    document.querySelector("#min-res-gap-value").innerText = _resPairGapMin;

    //Pull out coords for reference atoms
    const refAtomCoords = getCoordinates(cBetas);
    console.log(refAtomCoords);


    //Calc pairwise distances
    resPairwiseDistances = calcPairwiseDistances(refAtomCoords);
    console.log(resPairwiseDistances);
    //Next get maximum distance calculated
    const allDistances = resPairwiseDistances.flat();
    _maxDistCutoff = Math.floor(Math.max(...allDistances));
    console.log("Max pair-wise distance calculated is ", _maxDistCutoff);

    //Now we can update the control
    const distCutoffControl = document.querySelector("#max-distance");
    distCutoffControl.setAttribute('max', _maxDistCutoff);
    distCutoffControl.setAttribute('value', _distCutoff);
    document.querySelector("#max-distance-value").innerText = _distCutoff;

    //Render default view
    //1. Use residues array to make graph nodes
    //['SER', 'THR', ... 'LYS'] => [ {id: 'SER'}, {id: 'THR'}, ... {id: 'LYS'}]
    const graphNodes = residues.map((resName, index) => ({id: resName+" "+(index + 1)}));
    console.log(graphNodes);

    //2. Use pairwise distances to make links
    //[[p1p2, p1p3, p1p4,...], [p2p3]]
    const graphLinks = getMesmerGraphLinks(resPairwiseDistances, 5, 4);

    //3. Render
    renderMesmerGraph(graphNodes, graphLinks, d => d.dist);

    //DONE :)    
  }

});

const getMesmerGraphLinks = (resPairwiseDistances, distCutoffNew, resPairGapMinNew) => {
  const distCutoff = distCutoffNew || _distCutoff;
  const resPairGapMin = resPairGapMinNew || _resPairGapMin;

  let graphLinks = [];
  resPairwiseDistances.forEach((singleDist, i) => {
    const res1Index = i;
    singleDist.forEach((dist, j) => {
      const res2Index = j + 1;
      if (!distCutoff || (distCutoff && dist <= distCutoff) && (res2Index - res1Index >= resPairGapMin)) {
        graphLinks.push({"source": res1Index, "target": res2Index, "dist": dist.toFixed(3)})
      }
    });
  });

  return graphLinks;
}

const renderMesmerGraph = (nodes, links, linkText) => {
  nodes && (mesmerGraph.nodes = nodes);
  links && (mesmerGraph.links = links);
  linkText && (mesmerGraph.linkText = linkText);
};

const createRangeInput = (min, max, id, label, onChangeCallback) => {
  const rangeEl = document.createElement('input');
  rangeEl.setAttribute('type', 'range')
  rangeEl.setAttribute('min', min || 0);
  rangeEl.setAttribute('max', max || 1);
  rangeEl.setAttribute('step', 1);
  rangeEl.setAttribute('id', id || "range-id");

  rangeEl.addEventListener('change', onChangeCallback);

  const rangeValue = document.createElement('span');
  rangeValue.setAttribute('id', id+'-value');
  rangeValue.innerText = 0;

  const rangeLabel = document.createElement('label');
  rangeLabel.setAttribute('id', id+"-wrapper");
  rangeLabel.innerText = label;

  rangeLabel.appendChild(rangeValue);
  rangeLabel.appendChild(rangeEl);
  return rangeLabel;

};

const createGraphControls = () => {
  const resMaxDistance = createRangeInput(1, _maxDistCutoff, "max-distance", 
      "Maximum distance (Å): ", onMaxDistanceChange);
  
  const minResPairGap = createRangeInput(1, _maxResPairGap, "min-res-gap", 
      "Minimum residue pair gap: ", onMinResGapChange);

  const controlsWrapper = document.createElement('div');
  controlsWrapper.setAttribute('id', 'controls-wrapper');

  controlsWrapper.appendChild(resMaxDistance);
  controlsWrapper.appendChild(minResPairGap);

  const mesmerRoot = document.getElementById('mesmer-root');
  mesmerRoot.appendChild(controlsWrapper);
};

const onMaxDistanceChange = (e) => {
  _distCutoff = e.target.value;
  console.log("Max distance range changed: ", _distCutoff);
  //update value displayed (span is sibling element)
  e.target.previousElementSibling.innerText = _distCutoff;
  //get new links using new maximum distance
  const graphLinks = getMesmerGraphLinks(resPairwiseDistances, _distCutoff, _resPairGapMin);
  //replot
  renderMesmerGraph(undefined, graphLinks, undefined);

};

const onMinResGapChange = (e) => {
  _resPairGapMin = e.target.value;
  console.log("Minimum residue gap changed: ", e.target.value);
  //update value displayed (span is sibling element)
  e.target.previousElementSibling.innerText = _resPairGapMin;  
  //get new links using new res pair gap minimum
  const graphLinks = getMesmerGraphLinks(resPairwiseDistances, _distCutoff, _resPairGapMin);
  //replot
  renderMesmerGraph(undefined, graphLinks, undefined);
}

const showAlert = (alertType, alertText) => {
  const alertEl = document.querySelector('alert-element');
  alertEl.alertText = alertText;
  alertEl.alertType = alertType;
  alertEl.enabled = true;  
}
window.onload = () => {
  createGraphControls();
};
