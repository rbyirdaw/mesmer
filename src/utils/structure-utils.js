
export const getAtomLines = (fullStructure) => {
  // Given a full structure from modelServer API,
  // return the lines with atomic coordinates.

  if (typeof fullStructure === 'string') {
    const firstAtom = fullStructure.indexOf('ATOM');
    const lastAtom = fullStructure.indexOf('HETATM');
    const atomLines = firstAtom && lastAtom && fullStructure.substring(firstAtom, lastAtom);
    const atomLinesArray = atomLines && atomLines.split('\n');   
    return atomLinesArray;
  }
};

export const getAtomLinesByAtom = (atom, atomLinesArray) => {
  // Given array of atomic coordinate, residue, atom etcc... lines,
  // return an array filterd by atom.

  let filteredAtomLines = [];
  if (atomLinesArray.length > 0) {
    filteredAtomLines = atomLinesArray.filter(atomLine => atomLine.indexOf(` ${atom} `) !== -1);
  }

  return filteredAtomLines;
};

