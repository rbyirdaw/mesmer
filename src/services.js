
const pdbSearchApi = 'https://search.rcsb.org/rcsbsearch/v1/query?json=';
const modelServerApi = 'https://models.rcsb.org/v1/';
const pdbEntryServiceApi = 'https://data.rcsb.org/rest/v1/core/entry/'

const httpClient = (url, requestOptions) => {
  return fetch(url, requestOptions);  
};

export const searchPdbEntry = (searchValue) => {

  let encodedSearchValue = encodeURI(JSON.stringify(searchValue));
  //let response = await httpClient(pdbSearchApi + `%7B"query":%7B"type":"terminal","service":"text","parameters":%7B"value":"thymidine%20kinase"%7D%7D,"return_type":"entry"%7D`);

  return new Promise((resolve, reject) => {
    httpClient(pdbSearchApi + encodedSearchValue)
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType || !contentType.includes('application/json')) {
          reject("Response error.")
        } else {
          resolve(response.json());
        }
      });
  });

};

export const getProteinStructure = (pdbId) => {
 
  return new Promise((resolve, reject) => {
    if (!pdbId) {
      reject("Invalid input.")
    } else {
      pdbId = pdbId.toLowerCase();
      const searchParams = `${pdbId}/full?encoding=cif&copy_all_categories=false`;
      httpClient(modelServerApi + searchParams)
        .then(response => {
          if (!response.ok) {
            reject("Response error.");
          } else {
            resolve(response.text());
          }
        });
      }
  });

};

export const getPdbEntry = (pdbId) => {
  return new Promise((resolve, reject) => {
    if (!pdbId) {
      reject("Invalid input.")
    } else {
      pdbId = pdbId.toLowerCase();
      httpClient(pdbEntryServiceApi + pdbId)
        .then(response => {
          if (!response.ok) {
            reject("Response error.")
          } else {
            resolve(response.json());
          }
        });
    }
  });
}