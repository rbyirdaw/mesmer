import { line } from "d3-shape";

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
  // i.e.,  ["SER", "TRP", "THR",...]

  let residues = [];
  if (atomLinesArray.length > 0) {
    residues = atomLinesArray.map((el) => {
      if (!el) {
        return;
      }
      const lineArray = el.split(' ');
      return lineArray.length > 4 ? lineArray[4] : undefined;
    });
  }

  return residues;
};

export const getCoordinates = (atomLinesArray) => {
  // Given array of atomic coordinates, from full structure
  // i.e., "ATOM 54 C C TRP 4 . . A 1 -4.328 -2.716 -0.248 1 0 ? C TRP 4 A 1 ",
  // return array of coordinates as [{.x1, .y1, .z1}, {.x2, .y2, .z2}, ... {.xN, .yN, .zN}]

  let coords = [];
  if (atomLinesArray.length > 0) {
    coords = atomLinesArray.map((el) => {
      if (!el) {
        return;
      }
      const lineArray = el.split(' ');
      const x = lineArray[10];
      const y = lineArray[11];
      const z = lineArray[12];
      
      return {x: x, y: y, z: z};
    });
  }

  return coords;

};

export const calcPairwiseDistances = (coords) => {
  // Given an array of 3D coordinates for 2 or more residues,
  // i.e. [{.x1, .y1, .z1}, {.x2, .y2, .z2}, ... {.xN, .yN, .zN}]
  // calculate pairwise distances.
  
  let pairwiseDist = [];
  if (coords && coords.length > 1) {
    const numObjects = coords.length;

    for (let i = 0; i < numObjects - 1; i++) {
      const obj1 = coords[i];
      if (!obj1) {
        continue
      }
      let singleDist = [];
      for (let j = i + 1; j < numObjects; j++) {
        const obj2 = coords[j];
        if (!obj2) {
          continue
        }
        const dist = Math.sqrt(Math.pow((obj2.x - obj1.x), 2) +
            Math.pow((obj2.y - obj1.y), 2) + 
            Math.pow((obj2.z - obj1.z), 2));
        singleDist.push(dist);
      }
      pairwiseDist.push(singleDist);
    }
  }

  return pairwiseDist;
}