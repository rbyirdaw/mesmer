import { SearchInput } from './search-input';
import { SearchResult } from './search-result';


export class TextSearch extends HTMLElement {
  constructor() {
    super();
    this.shadowRootRef = this.attachShadow({mode: 'open'});

    customElements.define('search-input', SearchInput);
    customElements.define('search-result', SearchResult);

    this._resultList = [];

    this.render();
  }

  get resultList() {
    return this.shadowRootRef.querySelector('search-result').resultList;
  }

  set resultList(results) {
    this.shadowRootRef.querySelector('search-result').resultList = results;
  }
  
  render() {
    this.shadowRootRef.innerHTML = `
      <search-input></search-input>
      <search-result></search-result>
    `;
  }
}