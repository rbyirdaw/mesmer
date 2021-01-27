let componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <heading>Structure Information</heading>
  <div>PDB Id: <span id="pdb-id"></span></div>
`;

export class StructureInfo extends HTMLElement {
  constructor() {
    super();

    this.shadowRootRef = this.attachShadow({mode: 'open'});
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['pdb-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRootRef.querySelector('#pdb-id').innerHTML = newValue;
  }
}