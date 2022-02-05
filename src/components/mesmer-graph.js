import { D3Graph } from './d3-graph';
import { memoize } from '../utils/js-utils';

export default class MesmerGraph extends HTMLElement {

  constructor() {
    super();

    this.memoized = {};

    this.d3Graph;
    this.nodes;
    this.links;
    this.linkText = d => d.dist;

    this._distCutoff = 5;
    this._resPairGapMin = 4;

    this.graphHeight = this.getHeight();
    this.graphWidth = this.getWidth();

    this.registerDependencies();
    this.render();
  }

  getWidth() {
    let width = this.getAttribute('graph-width');
    if (width === "null") {
      width = window.innerWidth;
    }
    return width;
  }

  getHeight() {
    let height = this.getAttribute('graph-height');
    if (height === "null") {
      height = window.innerHeight - 250;
    }
    return height;
  }
  
  set residues(res) {
    this._residues = res;
    this.nodes = this.residuesToNodes(this._residues);
    this.renderD3Graph();

    this.memoized.getMesmerGraphLinks = null;
  }

  set resPairwiseDistances(pairwiseDist) {
    this._resPairwiseDistances = pairwiseDist;
    this.links = this.getMesmerGraphLinks(this._distCutoff, this._resPairGapMin);
    this.renderD3Graph();
  }

  set distCutoff(value) {
    this._distCutoff = value;
    this.links = this.getMesmerGraphLinks(this._distCutoff, this._resPairGapMin);
    this.renderD3Graph();
  }

  set resPairGapMin(value) {
    this._resPairGapMin = value;
    this.links = this.getMesmerGraphLinks(this._distCutoff, this._resPairGapMin);
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

  getMesmerGraphLinks = (distCutoff, resPairGapMin) => {
    if (this.memoized && typeof this.memoized.getMesmerGraphLinks === 'function') {
      return this.memoized.getMesmerGraphLinks(distCutoff, resPairGapMin);
    } else {
      this.memoized.getMesmerGraphLinks = memoize((distCutoff, resPairGapMin) => { 
        let graphLinks = [];
        this._resPairwiseDistances.forEach((singleDist, i) => {
          const res1Index = i;
          singleDist.forEach((dist, j) => {
            const res2Index = i + j + 1;
            if (!distCutoff || (distCutoff && dist <= distCutoff) && (res2Index - res1Index >= resPairGapMin)) {
              graphLinks.push({"source": res1Index, "target": res2Index, "dist": dist.toFixed(3)})
            }
          });
        });
        return graphLinks;
      });

      return this.memoized.getMesmerGraphLinks(distCutoff, resPairGapMin);
    }

  };
  
   renderD3Graph() {
    this.nodes && (this.d3Graph.nodes = this.nodes);
    this.links && (this.d3Graph.links = this.links);
    this.linkText && (this.d3Graph.linkText = this.linkText);
  };

  render() {
    this.innerHTML = `<d3-graph width=${this.graphWidth} height=${this.graphHeight}></d3-graph`;
  }
}