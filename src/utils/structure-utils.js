
export const getAtomLines = (fullStructure) => {
  // Given a full structure from modelServer API,
  // return the lines with atomic coordinates in an array.
  // i.e., "ATOM 54 C C TRP 4 . . A 1 -4.328 -2.716 -0.248 1 0 ? C TRP 4 A 1 "

  if (typeof fullStructure === 'string') {
    const firstAtom = fullStructure.indexOf('ATOM');
    const lastAtom = fullStructure.indexOf('HETATM');
    const atomLines = firstAtom && lastAtom && fullStructure.substring(firstAtom, lastAtom);
    const atomLinesArray = atomLines && atomLines.split('\n');   
    return atomLinesArray;
  }
};

export const getAtomLinesByAtom = (atom, atomLinesArray) => {
  // Given array of atomic coordinates, residue, atom etcc... lines, from full structure,
  // i.e., "ATOM 54 C C TRP 4 . . A 1 -4.328 -2.716 -0.248 1 0 ? C TRP 4 A 1 ",
  // return an array filterd by atom.

  let filteredAtomLines = [];
  if (atomLinesArray.length > 0) {
    filteredAtomLines = atomLinesArray.filter(atomLine => atomLine.indexOf(` ${atom} `) !== -1);
  }

  return filteredAtomLines;
};

export const getResidues = (atomLinesArray) => {
  // Given array of atomic coordinates, from full structure
  // i.e., "ATOM 54 C C TRP 4 . . A 1 -4.328 -2.716 -0.248 1 0 ? C TRP 4 A 1 ",
  // return array of residues

  let residues = [];
  if (atomLinesArray.length > 0) {
    residues = atomLinesArray.map((el) => el.split(' ')[4]);
  }

  return residues;
}