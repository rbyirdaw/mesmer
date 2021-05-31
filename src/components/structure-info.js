import { getPdbEntry } from '../services';

let componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <heading>Structure Information</heading>
  <div>PDB Id: <span id="pdb-id"></span></div>
  <div>Citation: <span id="citation"></span></div>
  <style>
    :host {
      display: block;
    }
  </style>

`;

export class StructureInfo extends HTMLElement {
  constructor() {
    super();

    this.shadowRootRef = this.attachShadow({mode: 'open'});
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.pdbId;
    this.citation;
  }

  static get observedAttributes() {
    return ['pdb-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {      
      this.pdbId = newValue;
      this.onPdbIdChange(newValue);
    }    
  }

  onPdbIdChange(pdbId) {
    getPdbEntry(pdbId).then(entry => {
      const { citation } = entry;
      this.updateCitation(citation);
      this.render();
    });
  }

  updateCitation(citation) {
    const {journal_abbrev, page_first, page_last, rcsb_authors, title, year} = citation[0];
    const authors = rcsb_authors.join(', ');
    this.citation = `${authors}, (${year}), ${title}, ${journal_abbrev}, ${page_first}:${page_last}`;
  }

  render() {
    this.shadowRootRef.querySelector('#pdb-id').innerHTML = this.pdbId;
    this.shadowRootRef.querySelector('#citation').innerHTML = this.citation;
  }
}