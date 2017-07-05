const ldfetch = require('ldfetch');
const n3 = require('n3');
const base_url = "http://linked.open.gent/parking/";

function fetchUrl(url, amount, max, state) {
  let fetch = new ldfetch();

  return new Promise((resolve) => {
    fetch.get(url).then(response => {
      state.addTriples(response.triples);
      state.addPrefixes(response.prefixes);
      return response;
    }).then(response => {
      if (amount < max) {
        let responseStore = new n3.Store();
        responseStore.addTriples(response.triples);
        responseStore.addPrefixes(response.prefixes);

        let prevUrl = responseStore.getTriples(null,"hydra:previous")[0].object;
        return fetchUrl(prevUrl, amount+1, max, state);
      } else {
        return state;
      }
    }).then(res => resolve(res));
  })
}

global.gatherData = function (max) {
  return fetchUrl(base_url, 0, max, new n3.Store());
};

global.chart = require('chart.js');
global.moment = require('moment');