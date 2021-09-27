import { D3Graph } from './d3-graph';

export default class MesmerGraph extends HTMLElement {

  constructor() {
    super();

    this.d3Graph;
    this.nodes;
    this.links;
    this.linkText = d => d.dist;
    this.registerDependencies();
    this.render();
  }
  
  set residues(res) {
    this._residues = res;
    this.nodes = this.residuesToNodes(this._residues);
    this.renderD3Graph();
  }

  set resPairwiseDistances(pairwiseDist) {
    this._resPairwiseDistance = pairwiseDist;
    this.links = this.pairwiseDistToLinks(this._resPairwiseDistance);
    this.renderD3Graph();
  }

  registerDependencies() {
    customElements.define('d3-graph', D3Graph);
  }

  connectedCallback() {
    this.d3Graph = this.querySelector('d3-graph');
  }

  residuesToNodes(residues) {
    //1. Use residues array to make graph nodes
    //['SER', 'THR', ... 'LYS'] => [ {id: 'SER'}, {id: 'THR'}, ... {id: 'LYS'}]
    const graphNodes = residues.map((resName, index) => ({id: resName+" "+(index + 1)}));
    console.log(graphNodes);

    return graphNodes;
  }

  pairwiseDistToLinks(resPairwiseDistances) {
    //2. Use pairwise distances to make links
    //[[p1p2, p1p3, p1p4,...], [p2p3]]
    const graphLinks = this.getMesmerGraphLinks(resPairwiseDistances, 5, 4);

    return graphLinks;
  }

  getMesmerGraphLinks(resPairwiseDistances, distCutoffNew, resPairGapMinNew) {
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
  
  renderD3Graph() {
    this.nodes && (this.d3Graph.nodes = this.nodes);
    this.links && (this.d3Graph.links = this.links);
    this.linkText && (this.d3Graph.linkText = this.linkText);
  };

  render() {
    this.innerHTML = `<d3-graph width="600" height="400"></d3-graph`;
  }
}