import { SpinnerElement } from './spinner-element';
import { AlertElement } from './alert-element';
import MesmerProteinStructure from './mesmer-protein-structure';
import MesmerGraph from './mesmer-graph';
import MesmerGraphControls from './mesmer-graph-controls';

export default class MesmerApp extends HTMLElement {
  constructor() {
    super();

    this.registerDependencies();
    this.shadowRootRef = this.attachShadow({mode: 'open'});

    this.graphHeight = this.getAttribute('graph-height');
    this.graphWidth = this.getAttribute('graph-width');

    this.MAX_RESIDUES = 200;

    this.render();
  }

  registerDependencies() {
    customElements.define('spinner-element', SpinnerElement);
    customElements.define('alert-element', AlertElement);
    customElements.define('mesmer-protein-structure', MesmerProteinStructure);
    customElements.define('mesmer-graph', MesmerGraph);
    customElements.define('mesmer-graph-controls', MesmerGraphControls);
  }

  connectedCallback() {    
    const spinnerEl = this.shadowRootRef.querySelector('spinner-element');
    const mesmerStruct = this.shadowRootRef.querySelector('mesmer-protein-structure');
    const mesmerGraph = this.shadowRootRef.querySelector('mesmer-graph');
    const mesmerGraphControls = this.shadowRootRef.querySelector('mesmer-graph-controls');

    mesmerStruct.addEventListener('xhr-state', (e) => {
      spinnerEl.enabled = e.detail.value;
      console.log("mesmer struct ", e.detail.value)
    });
    mesmerStruct.addEventListener('pdb-search-error', (e) => {
      this.showAlert('error', 'Pdb search error.');
    });
    mesmerStruct.addEventListener('got-residue-stats', (e) => {
      console.log("mesmer struct got residue stats: ", e.detail.value);
      const { residues, numResidues } = e.detail.value;      
      mesmerGraph.residues = residues;

      mesmerGraphControls.maxResPairGap = numResidues - 1;

      if (numResidues > this.MAX_RESIDUES) {
        this.showAlert('warning', 'Max number of residues exceeded: '+ numResidues);
      } else if (numResidues < 1) {
        this.showAlert('error', 'Invalid number of residues: ' + numResidues);
      }
    });
    mesmerStruct.addEventListener('got-pairwise-dist-stats', (e) => {
      console.log("mesmer struct got residue stats: ", e.detail.value);
      const pairwiseDistStats = e.detail.value;
      mesmerGraph.resPairwiseDistances = pairwiseDistStats.resPairwiseDistances;

      mesmerGraphControls.maxDistCutoff = pairwiseDistStats.maxDistCutoff;
    });

    mesmerGraphControls.addEventListener('max-distance-change', (e) => {
      const distCutoffNew = e.detail.value;
      mesmerGraph.distCutoff = distCutoffNew;
    });
    mesmerGraphControls.addEventListener('min-res-pair-gap-change', (e) => {
      const resPairGapMinNew = e.detail.value;
      mesmerGraph.resPairGapMin = resPairGapMinNew;
    });

  }

  // UX
  showAlert = (alertType, alertText) => {
    const alertEl = this.shadowRootRef.querySelector('alert-element');
    alertEl.alertText = alertText;
    alertEl.alertType = alertType;
    alertEl.enabled = true;  
  }

  render() {
    this.shadowRootRef.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
      <alert-element></alert-element>
      <spinner-element></spinner-element>
      <mesmer-protein-structure></mesmer-protein-structure>
      <mesmer-graph graph-width=${this.graphWidth} graph-height=${this.graphHeight}></mesmer-graph>
      <mesmer-graph-controls></mesmer-graph-controls>    
    `;

  }

}