
const pdbSearchApi = `https://search.rcsb.org/rcsbsearch/v1/query`;
const modelServerApi = `https://models.rcsb.org/v1/`;

const httpClient = () => {
  
};

export const searchPdbEntry = (searchValue) => {

};

export const getProteinStructure = (pdbId = '2LZM') => {
  const searchParams = `${pdbId}/full?encoding=cif&copy_all_categories=false`;

};

