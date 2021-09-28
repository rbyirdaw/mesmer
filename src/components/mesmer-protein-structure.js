//fetched structure -> residues array, pair-wise distances

import { SelectStructure } from './select-structure';
import { getAtomLines, getAtomLinesByAtom, getResidues, getCoordinates, calcPairwiseDistances } from '../utils/structure-utils';

export default class MesmerProteinStructure extends HTMLElement {

  constructor() {
    super();

    customElements.define('select-structure', SelectStructure);
    this.render();
  }

  connectedCallback() {
    const structureInfo = this.querySelector('select-structure');
    structureInfo.addEventListener('structure-fetched', (e) => {
      console.log("Structure fetched in mesmer protein structure.");
      this.processStructure(e.detail.value);
    });
  }

  dispatchCustomEvent(name, eventValue) {
    this.dispatchEvent(new CustomEvent(name, {
      detail: {
        value: eventValue
      },
      bubbles: true
    }));
  }

  processStructure(fullStructure) {
    //atoms from response
    const atomLines = getAtomLines(fullStructure);
    
    //get C-alphas
    const cAlphas = getAtomLinesByAtom('CA', atomLines);
    console.log("cAlphas - ", cAlphas);
    //get C-betas
    const cBetas = getAtomLinesByAtom('CB', atomLines);
    const cBetasAdjusted = this.adjustForGly(cAlphas, cBetas);
    console.log("cBetas - ", cBetas);

    const residueStats = this.getResidueStats(cBetasAdjusted);
    this.dispatchCustomEvent('got-residue-stats', residueStats);

    const pairwiseDistStats = this.getPairwiseDistStats(cBetasAdjusted);    
    this.dispatchCustomEvent('got-pairwise-dist-stats', pairwiseDistStats);
    
  }

  adjustForGly(cAlphas, cBetas) {
    let cBetasCopy = cBetas;
    //see if we have all atoms to calculate pair-wise distances
    if (cAlphas.length > cBetasCopy.length) {
      //adjust for GLY
      cAlphas.forEach((cAlphaLine, index) => {
        if (cAlphaLine.includes('GLY')) {
          cBetasCopy.splice(index, 0, cAlphaLine);      
        }
      });
    }

    return cBetasCopy;
  }
  
  getResidueStats(cBetas) {
    const residues = getResidues(cBetas);
    const numResidues = residues.length;
    console.log("Number of residues: ", numResidues);

    return {
      "residues": residues,
      "numResidues": numResidues
    };
  }

  getPairwiseDistStats(cBetas) {
    //Pull out coords for reference atoms
    const refAtomCoords = getCoordinates(cBetas);
    console.log(refAtomCoords);

    //Calc pairwise distances
    const resPairwiseDistances = calcPairwiseDistances(refAtomCoords);

    const allDistances = resPairwiseDistances.flat();
    const _maxDistCutoff = Math.floor(Math.max(...allDistances));
    console.log("Max pair-wise distance calculated is ", _maxDistCutoff);

    return {
      "resPairwiseDistances": resPairwiseDistances,
      "maxDistCutoff": _maxDistCutoff
    };
  }
  
  render() {
    this.innerHTML = `<select-structure></select-structure>`;
  }
}