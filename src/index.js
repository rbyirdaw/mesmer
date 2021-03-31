
import { D3Graph } from './components/d3-graph';
import { SelectStructure } from './components/select-structure';
import { getAtomLines, getAtomLinesByAtom, getResidues, getCoordinates, calcPairwiseDistances } from './utils/structure-utils';

//customElements.define('pdb-search', PdbSearch);
customElements.define('select-structure', SelectStructure);
customElements.define('d3-graph', D3Graph);
document.getElementById('mesmer-root')
  .innerHTML = `
    <select-structure></select-structure>
    <d3-graph width="600" height="400"></d3-graph>
  `;

const mesmerGraph = document.querySelector('d3-graph');
let cBetas;
let residues;
let resPairwiseDistances = [];

const structureInfo = document.querySelector('select-structure');
structureInfo.addEventListener('structure-fetched', (e) => {
  //atoms from response
  const atomLines = getAtomLines(e.detail.value);
  //filter on C-betas
  cBetas = getAtomLinesByAtom('CB', atomLines);
  //TO-DO: get 3d distances, given atom lines with 3d coords
  //OR do we make the same table as before
  console.log(cBetas);

  residues = getResidues(cBetas);
  console.log(residues);

  //Pull out coords for c-betas
  const cBetaCoords = getCoordinates(cBetas);
  console.log(cBetaCoords);
  //Calc pairwise distances
  const resPairwiseDistances = calcPairwiseDistances(cBetaCoords);
  console.log(resPairwiseDistances);
  
  //Render default view
  //1. Use residues array to make graph nodes
  //['SER', 'THR', ... 'LYS'] => [ {id: 'SER'}, {id: 'THR'}, ... {id: 'LYS'}]
  const graphNodes = residues.map(resName => ({id: resName}));
  console.log(graphNodes);
  //2. Use pairwise distances to make links
  //[[p1p2, p1p3, p1p4,...], [p2p3]]
  let distCutoff = 5;
  let graphLinks = [];
  resPairwiseDistances.forEach((singleDist, i) => {
    singleDist.forEach((dist, j) => {
      if (!distCutoff || (distCutoff && dist <= distCutoff)) {
        graphLinks.push({"source": i, "target": j + 1, "dist": dist})
      }
    });
  });
  console.log(graphLinks);

  //3. Render
  mesmerGraph.nodes = graphNodes;
  mesmerGraph.links = graphLinks;
  mesmerGraph.linkText = d => d.dist;

  //DONE :)
});

