import { TextSearch } from './text-search';
import { searchPdbEntry } from '../services';

export class PdbSearch extends HTMLElement {
  constructor() {
    super();
    customElements.define('text-search', TextSearch);

    this.render();
  }

  connectedCallback() {
    const textSearchEl = this.querySelector('text-search');
    textSearchEl.shadowRoot.addEventListener('value-input', (e) => {
      const searchString = e.detail.value;
      if (!searchString) {
        textSearchEl.resultList = [];
      } else {        
        let pdbSearchObj = {
          "query": {
            "type": "terminal",
            "service":  "text",
            "parameters": {
              "value": e.detail.value
            }          
          },
          "return_type": "entry"
        };
  
        searchPdbEntry(pdbSearchObj)
          .then(pdbList => {
            const pdbs = pdbList.result_set.map(el => el.identifier);
            textSearchEl.resultList = pdbs;
          });         
      }
    });

    textSearchEl.shadowRoot.addEventListener('item-clicked', (e) => {
      console.log("Clicked item is ", e.detail.value);
      textSearchEl.resultList = [];
      this.dispatchPdbSelected(e.detail.value);
    })
  }

  dispatchPdbSelected(selectedPdbId) {
    this.dispatchEvent(new CustomEvent('pdb-selected', {
      detail: {
        value: selectedPdbId
      },
      bubbles: true
    }));
  }

  render() {
    this.innerHTML = `
      <text-search main-label="Search PDB"></text-search>
    `;
  }
}