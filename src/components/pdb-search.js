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
    });

  }

  render() {
    this.innerHTML = `
      <text-search></text-search>
    `;
  }
}