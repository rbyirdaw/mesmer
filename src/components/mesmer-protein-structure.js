import { SelectStructure } from './select-structure';
import { getAtomLines, getAtomLinesByAtom, getResidues, getCoordinates, calcPairwiseDistances } from '../utils/structure-utils';

export default class MesmerProteinStructure extends HTMLElement {

  constructor() {
    super();

    customElements.define('select-structure', SelectStructure);
    this.render();
  }

  render() {
    this.innerHTML = `<select-structure></select-structure>`;
  }
}