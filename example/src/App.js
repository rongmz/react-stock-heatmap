import React from 'react';
import StockHeatmap from '@rongmz/react-stock-heatmap';
import '@rongmz/react-stock-heatmap/dist/index.css';


export default () => {

  const [loading, setLoading] = React.useState(true);
  const progressRef = React.useRef(null);
  /** @type {React.MutableRefObject<StockHeatmap>} */
  const heatmapRef = React.useRef(null);
  const [windowDim, setWindowDim] = React.useState([0, 0]);

  // ------------ Load data -------------
  React.useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/20200814_1h').then(async ({ body, headers }) => {
      const reader = body.getReader();
      // Step 2: get total length
      const contentLength = +headers.get('Content-Length');
      // Step 3: read the data
      let receivedLength = 0; // received that many bytes at the moment
      let chunks = []; // array of received binary chunks (comprises the body)
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        // console.log(`Received ${receivedLength} of ${contentLength} %=${100 * (receivedLength / contentLength)}`)
        if (progressRef.current !== null) {
          progressRef.current.innerHTML = ` Downloading ${(100 * receivedLength / contentLength).toFixed(1)}% ...`
        }
      }
      // Step 4: concatenate chunks into single Uint8Array
      let chunksAll = new Uint8Array(receivedLength); // (4.1)
      let position = 0;
      for (let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
      }
      // Step 5: decode into a string
      let result = new TextDecoder("utf-8").decode(chunksAll);
      // setdata
      if (heatmapRef.current !== null) {
        heatmapRef.current.setData(
          result.split('\n')
            .filter(v => v.trim() !== '')
            .map(v => JSON.parse(v))
        );
      }
      setLoading(false);
    })
  }, []);
  // ------------ Load data -------------

  // ---------- window update ------------
  React.useEffect(() => {
    const updateFn = () => {
      setWindowDim([
        window.innerWidth,
        window.innerHeight
      ]);
    }
    updateFn();
    window.addEventListener('resize', updateFn);
    return () => window.removeEventListener('resize', updateFn);
  }, []);
  // ---------- window update ------------

  return (
    <React.Fragment>

      {loading &&
        <div className="loadingIndicator">
          <div className="loadingSpinner">
            <div className="loader">Loading...</div>
          </div>
          <div ref={progressRef}> Downloading 0% ...</div>
        </div>}

      <StockHeatmap ref={heatmapRef} width={windowDim[0]} height={windowDim[1]} />

      <div className="btnContainer">
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60) }}>zoom 1 minute</button>
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60 * 2) }}>zoom 2 minutes</button>
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60 * 3) }}>zoom 3 minutes</button>
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60 * 4) }}>zoom 4 minutes</button>
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60 * 5) }}>zoom 5 minutes</button>
        <button onClick={() => { if (heatmapRef.current !== null) heatmapRef.current.setZoomLevel(60 * 10) }}>zoom 10 minutes</button>
      </div>
    </React.Fragment>
  )
}
