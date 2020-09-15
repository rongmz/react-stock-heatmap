/**
 * Extract buy/sell bid prices from data points
 * @param {any[]} data 
 * @returns {number[]}
 */
export const extractBidPrices = (data) => {
  const set = new Set(data.map(d => {
    const marketDepth = d.marketDepth;
    if (marketDepth) {
      let buys = marketDepth.buys.map(b => +b.rate);
      let sells = marketDepth.sells.map(b => +b.rate);
      return buys.concat(sells, [+marketDepth.lastTradedPrice]);
    }
    return [];
  }).reduce((acc, val) => acc.concat(val), []));
  return Array.from(set);
}

/**
 * Extract buy/sell bid volumnes from a single data point
 * @param {any} data 
 * @returns {number[]}
 */
export const extractBidVolumes = (data) => {
  const marketDepth = data.marketDepth;
  if (marketDepth) {
    let buys = marketDepth.buys.map(b => +b.qty);
    let sells = marketDepth.sells.map(b => +b.qty);
    return buys.concat(sells);
  }
  else return [];
}

/**
 * Extract max volume (buy or sell) for a data point
 * @param {any} data 
 * @returns {number}
 */
export const extractMaxVolume = (data) => {
  const vols = extractBidVolumes(data).sort((a, b) => a - b);
  if (vols.length > 0) return vols[vols.length - 1];
  else return 1;
}

/**
 * Extract max traded volume within a given set of datapoints
 * @param {any[]} data 
 * @returns {number}
 */
export const extractMaxTradedVolume = (data) => {
  let vols = data.map(d => {
    if (d.marketDepth) return +d.marketDepth.lastTradedQty;
    else return 0;
  }).sort((a, b) => a - b);
  if (vols.length > 0) return vols[vols.length - 1];
  else return 1;
}