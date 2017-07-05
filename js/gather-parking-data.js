const ldfetch = require('ldfetch');
const n3 = require('n3');
const base_url = "http://linked.open.gent/parking/";

function fetchUrl(url, amount, state) {
  let fetch = new ldfetch();

  return new Promise((resolve) => {
    fetch.get(url).then(response => {
      state.addTriples(response.triples);
      state.addPrefixes(response.prefixes);
      return response;
    }).then(response => {
      if (amount < 5) {
        let responseStore = new n3.Store();
        responseStore.addTriples(response.triples);
        responseStore.addPrefixes(response.prefixes);

        let prevUrl = responseStore.getTriples(null,"hydra:previous")[0].object;
        console.log("previous: " + prevUrl);
        return fetchUrl(prevUrl, amount+1, state);
      } else {
        return state;
      }
    }).then(res => resolve(res));
  })
}

global.gatherData = function () {
  fetchUrl(base_url, 0, new n3.Store()).then(res => {
    console.log("Done!");
    console.log(res);
  });
  return 100;
};