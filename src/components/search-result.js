
import { SearchResultItem } from './search-result-item';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `<ul></ul>`;

export class SearchResult extends HTMLElement {
  constructor() {
    super();
    //this.shadowRootRef = this.attachShadow({mode: 'open'});
    //this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.appendChild(componentHtml.content);

    this._resultList = [];

    customElements.define('result-item', SearchResultItem, {extends: 'li'});

    this.render();
  }

  get resultList() {
    return this._resultList;
  }

  set resultList(results) {
    this._resultList = results;
    this.render();
  }

  renderResultItems() {
    return this._resultList.map(resultText => {
      return `<li is='result-item' text=${resultText}></li>`;
    }).join('');
  }

  render() {
    this.querySelector('ul')
      .innerHTML = `${this.renderResultItems()}`;
  }
}