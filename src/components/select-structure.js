import { PdbSearch } from './pdb-search';
import { StructureInfo } from './structure-info';
import { getProteinStructure } from '../services';

export class SelectStructure extends HTMLElement {
  constructor() {
    super();

    customElements.define('pdb-search', PdbSearch);
    customElements.define('structure-info', StructureInfo);
    this.render();
  }

  connectedCallback() {
    this.querySelector('pdb-search').addEventListener('pdb-selected', (e) => {
      this.handlePdbSelection(e.detail.value);
    })
  }

  handlePdbSelection(pdbId) {
    console.log("Got pdb selection: ", pdbId);
    this.querySelector('structure-info').setAttribute('pdb-id', pdbId);
    getProteinStructure(pdbId).then( (fullStructure) => {
      this.dispatchEvent(new CustomEvent('structure-fetched', {
        detail: {
          value: fullStructure
        },
        bubbles: true
      }))
    })
  }

  render() {
    this.innerHTML = `
      <pdb-search></pdb-search>
      <structure-info pdb-id=""></structure-info>
    `;
  }

}