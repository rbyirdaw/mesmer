import 'bootstrap/dist/css/bootstrap.min.css';
import { SpinnerElement } from './spinner-element';
import { AlertElement } from './alert-element';
import MesmerProteinStructure from './mesmer-protein-structure';
import MesmerGraph from './mesmer-graph';
import MesmerControls from './memser-controls';

let appHtml = document.createElement('template');
appHtml.innerHTML = `
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

  }

}