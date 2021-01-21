import { PdbSearch } from './components/pdb-search';

customElements.define('pdb-search', PdbSearch);
document.getElementById('mesmer-root')
  .innerHTML = `<pdb-search></pdb-search>`;