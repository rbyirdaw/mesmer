import { SpinnerElement } from './spinner-element';
import { AlertElement } from './alert-element';
import MesmerProteinStructure from './mesmer-protein-structure';
import MesmerGraph from './mesmer-graph';
import MesmerControls from './memser-controls';

let appHtml = document.createElement('template');
appHtml.innerHTML = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
  <alert-element></alert-element>
  <spinner-element></spinner-element>
  <mesmer-protein-structure></mesmer-protein-structure>
`;

export default class MesmerApp extends HTMLElement {
  constructor() {
    super();

    this.registerDependencies();
    this.shadowRootRef = this.attachShadow({mode: 'open'});
    this.shadowRootRef.appendChild(appHtml.content.cloneNode(true));
  }

  registerDependencies() {
    customElements.define('spinner-element', SpinnerElement);
    customElements.define('alert-element', AlertElement);
    customElements.define('mesmer-protein-structure', MesmerProteinStructure);

  }

  connectedCallback() {    
    const spinnerEl = this.shadowRootRef.querySelector('spinner-element');

    const mesmerStruct = this.shadowRootRef.querySelector('mesmer-protein-structure');
    mesmerStruct.addEventListener('xhr-state', (e) => {
      spinnerEl.enabled = e.detail.value;
      console.log("mesmer struct ", e.detail.value)
    });

    mesmerStruct.addEventListener('pdb-search-error', (e) => {
      this.showAlert('error', 'Pdb search error.');
    });
  }

  showAlert = (alertType, alertText) => {
    const alertEl = this.shadowRootRef.querySelector('alert-element');
    alertEl.alertText = alertText;
    alertEl.alertType = alertType;
    alertEl.enabled = true;  
  }

}