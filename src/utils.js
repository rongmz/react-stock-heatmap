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

/**
 * Format zoom scale time
 * @param {number} seconds 
 */
export const zoomTimeFormat = (seconds) => {
  if(seconds > 59) {
    if(seconds > 3599) {
      let hrs = seconds/3600;
      return `${hrs.toFixed(2)} hour${hrs>1?'s':''}`;
    } 
    else {
      let mins = seconds/60;
      return `${mins.toFixed(2)} minute${mins>1?'s':''}`;
    }
  }
  else return `${seconds} second${seconds>1?'s':''}`;
}