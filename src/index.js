import React from 'react';
import styles from './styles.module.css';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Format from 'd3-format';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Shape from 'd3-shape';
import * as d3Zoom from 'd3-zoom';
import { extractBidPrices, extractBidVolumes, extractMaxTradedVolume, extractMaxVolume } from './utils';

export const d3 = Object.assign(
  Object.assign(
    Object.assign({}, d3Scale, d3Array, d3Color)
    , d3Format, d3Interpolate, d3Shape
  )
  , d3Zoom
);

/**
 * Stock Heatmap
 * @author Rounak Saha
 * 
 * © Copyright 2020, Rounak Saha
 */
export default class StockHeatmap extends React.Component {

  /** @type {React.RefObject<HTMLCanvasElement>} */
  canvasRef = React.createRef();
  /** @type {CanvasRenderingContext2D} */
  drawingContext = null;

  data = [];
  windowedData = [];
  windowLength = 40;
  autoScroll = true;

  /** Default Theme colors and dimensions */
  defaults = {
    borderPadding: [0, 0, 0, 0],
    bidAskWidth: 150,
    axisYWidth: 50,
    axisXHeight: 50,
    buyColor: '#66ed91',
    textOnBuyColor: '#ffffff',
    sellColor: '#ed6666',
    textOnSellColor: '#ffffff',
    tradeColor: '#7434eb',
    axisTickSize: 6,
    axisColor: '#000000',
    xAxisTextPadding: 6,
    yAxisTextPadding: 6,
    hmWidth: () => (this.props.width - this.defaults.borderPadding[1] - this.defaults.borderPadding[3] - this.defaults.bidAskWidth - this.defaults.axisYWidth),
    hmHeight: () => (this.props.height - this.defaults.borderPadding[0] - this.defaults.borderPadding[2] - this.defaults.axisXHeight),
    clearColor: '#ffffff',
  };

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate', nextProps);
    const shouldUpdate = this.props.width !== nextProps.width
      || this.props.height !== nextProps.height;
    if (shouldUpdate) this.updateHeatmap();
    return shouldUpdate;
  }

  // -------------------START:: Lifecycle methods to retrive 2d context from updated dom-------------------------
  componentDidMount() {
    // console.log('component mouted');
    if (this.canvasRef.current !== null) {
      this.drawingContext = this.canvasRef.current.getContext('2d');
    }
  }
  componentDidUpdate() {
    // console.log('component updtated');
    if (this.canvasRef.current !== null) {
      this.drawingContext = this.canvasRef.current.getContext('2d');
    }
  }
  // -------------------END:: Lifecycle methods to retrive 2d context from updated dom---------------------------


  // ------------------ D3 Variables ---------------------
  /** @type {d3Scale.ScaleBand<string>} */
  xScale = null;
  /** @type {d3Scale.ScaleLinear<number, number>} */
  bidAskScale = null;
  /** @type {d3Scale.ScaleBand<string>} */
  yScale = null;
  /** @type {number[]} */
  yDomainValues = null;
  // ------------------ D3 Variables ---------------------


  /**
   * This function will be called if there is any dimension change on heatmap
   * This function changes the d3 scales based on windowed data
   */
  updateHeatmapDimensions() {
    console.log('heatmap dimension updated, update scale domains');
    const { width, height } = this.props;
    if (width > 0 && height > 0 && this.windowedData.length > 0) {
      // setup x-scale
      this.xScale = d3.scaleBand()
        .range([0, this.defaults.hmWidth()])
        .domain(this.windowedData.map(d => d.ts));
      // setup y-scale
      this.yDomainValues = extractBidPrices(this.windowedData).sort((a, b) => a - b);
      this.yScale = d3.scaleBand()
        .range([this.defaults.hmHeight(), 0])
        .domain(this.yDomainValues);
      // setup bid ask scale
      this.bidAskScale = d3.scaleLinear()
        .range([0, this.defaults.bidAskWidth])
        .domain([0, d3.max(extractBidVolumes(this.windowedData[this.windowedData.length - 1]))]);
    }
  }


  /**
   * This method will be called after an update of internal data is performed.
   */
  updateHeatmap() {
    if (this.drawingContext !== null) {
      // 1. update scale and dimensions
      this.updateHeatmapDimensions();

      // 2. Draw the bid ask spread heatmap
      this.clearCanvas(this.defaults.borderPadding[3], this.defaults.borderPadding[0],
        this.defaults.hmWidth(), this.defaults.hmHeight(), this.defaults.clearColor);
      this.drawMainGraph();

      // 3. Draw xy Axis
      this.drawXAxis();
      this.drawYAxis();


      // console.log('heatmap draw update');
      // this.clearCanvas(0, 0, this.defaults.hmWidth(), this.defaults.hmHeight(), '#aaaaaa');
    }
  }

  // ------------------------------ START: Canvas draw functions ---------------------------------------

  /**
   * Draws X Axis
   */
  drawXAxis() {
    // clear canvas before axis draw
    this.clearCanvas(
      this.defaults.borderPadding[3], this.defaults.borderPadding[0] + this.defaults.hmHeight(),
      this.defaults.hmWidth(), this.defaults.axisXHeight, this.defaults.clearColor
    );
    // draw axis
    this.drawingContext.save();
    this.drawingContext.beginPath();
    this.drawingContext.translate(this.defaults.borderPadding[3], this.defaults.borderPadding[0] + this.defaults.hmHeight());
    this.drawingContext.moveTo(0, 0);
    this.drawingContext.lineTo(this.defaults.hmWidth(), 0);
    this.drawingContext.textAlign = 'center';
    this.drawingContext.textBaseline = 'top';
    this.windowedData.map((d, i) => {
      let x = this.xScale(d.ts);
      this.drawingContext.moveTo(x, 0);
      this.drawingContext.lineTo(x, this.defaults.axisTickSize);
      if (i % 2 === 0)
        this.drawingContext.fillText(d.ts, x, this.defaults.axisTickSize + this.defaults.xAxisTextPadding);
    });
    this.drawingContext.lineWidth = 1.2;
    this.drawingContext.strokeStyle = this.defaults.axisColor;
    this.drawingContext.stroke();
    this.drawingContext.restore();
  }

  /**
   * Draws Y Axis
   */
  drawYAxis() {
    if (this.yDomainValues !== null) {
      // clear canvas before axis draw
      this.clearCanvas(
        this.defaults.borderPadding[3] + this.defaults.hmWidth(), this.defaults.borderPadding[0],
        this.defaults.axisYWidth, this.defaults.hmHeight() + this.defaults.axisTickSize, this.defaults.clearColor
      );
      // translate and draw
      this.drawingContext.save();
      this.drawingContext.beginPath();
      this.drawingContext.translate(this.defaults.borderPadding[3] + this.defaults.hmWidth(), this.defaults.borderPadding[0]);
      this.drawingContext.moveTo(0, 0);
      this.drawingContext.lineTo(0, this.defaults.hmHeight() + this.defaults.axisTickSize);
      this.drawingContext.textAlign = 'start';
      this.drawingContext.textBaseline = 'top';
      this.yDomainValues.map(d => {
        let y = this.yScale(d);
        this.drawingContext.moveTo(0, y);
        this.drawingContext.lineTo(this.defaults.axisTickSize, y);
        this.drawingContext.fillText(d.toFixed(2), this.defaults.axisTickSize + this.defaults.yAxisTextPadding, y, this.defaults.axisYWidth - this.defaults.axisTickSize + this.defaults.yAxisTextPadding);
      });
      this.drawingContext.lineWidth = 1.2;
      this.drawingContext.strokeStyle = this.defaults.axisColor;
      this.drawingContext.stroke();
      this.drawingContext.restore();
    }
  }

  /**
   * Draws background heatmap for both buys and sells
   */
  drawMainGraph() {
    this.drawingContext.save();
    if (this.xScale && this.yScale && this.bidAskScale && this.drawingContext !== null) {
      const maxTradedVolume = extractMaxTradedVolume(this.windowedData);
      const xh2 = this.xScale.bandwidth() * 0.5;
      const yh2 = this.yScale.bandwidth() * 0.5;
      this.windowedData.map(d => {
        const marketDepth = d.marketDepth;
        const ts = d.ts;
        const maxBidAskVol = extractMaxVolume(d);
        // draw 
        this.drawingContext.translate(this.defaults.borderPadding[3], this.defaults.borderPadding[0]);
        // draw buys
        if (marketDepth.buys && marketDepth.buys.length > 0) {
          let color = d3.color(this.defaults.buyColor).rgb();
          marketDepth.buys.map(buy => {
            color.opacity = buy.qty / maxBidAskVol;
            this.drawingContext.fillStyle = color.toString();
            this.drawingContext.fillRect(
              this.xScale(ts),
              this.yScale(buy.rate),
              this.xScale.bandwidth(),
              this.yScale.bandwidth()
            );
          });
        }
        // draw sells
        if (marketDepth.sells && marketDepth.sells.length > 0) {
          let color = d3.color(this.defaults.sellColor).rgb();
          marketDepth.sells.map(sell => {
            color.opacity = sell.qty / maxBidAskVol;
            this.drawingContext.fillStyle = color.toString();
            this.drawingContext.fillRect(
              this.xScale(ts),
              this.yScale(sell.rate),
              this.xScale.bandwidth(),
              this.yScale.bandwidth()
            );
          });
        }
        // draw trade line and size
        let color = d3.color(this.defaults.tradeColor).rgb();
        color.opacity = 1;
        this.drawingContext.lineWidth = 1;
        this.drawingContext.fillStyle = color.toString();
        const r = xh2 * (+marketDepth.lastTradedQty / maxTradedVolume);
        this.drawingContext.beginPath();
        this.drawingContext.arc(
          this.xScale(ts) /* + xh2*/,
          this.yScale(+marketDepth.lastTradedPrice) /* + yh2*/,
          r, 0, 2 * Math.PI
        );
        this.drawingContext.fill();
      });
      // draw line path
      this.drawingContext.beginPath();
      d3.line()
        .x(d => this.xScale(d.ts))
        .y(d => this.yScale(+d.marketDepth.lastTradedPrice))
        .curve(d3.curveLinear)
        .context(this.drawingContext)
        (this.windowedData);
      this.drawingContext.lineWidth = 1;
      this.drawingContext.strokeStyle = this.defaults.tradeColor;
      this.drawingContext.stroke();
    }
    this.drawingContext.restore();
  }

  /**
   * Clear the canvas area
   * @param {number} x x coordinate
   * @param {number} y y xoordinate
   * @param {number} w width
   * @param {number} h height
   * @param {string} color color string
   */
  clearCanvas(x, y, w, h, color) {
    // console.log('clear canvas area', x, y, w, h, color);
    if (this.drawingContext !== null) {
      this.drawingContext.save();
      this.drawingContext.fillStyle = color || this.defaults.clearColor;
      this.drawingContext.fillRect(x, y, w, h);
      this.drawingContext.restore();
    }
  }

  // ------------------------------ END: Canvas draw functions ---------------------------------------

  /**
   * Set Data for the Heatmap to generate
   * @param {any[]} data The data to set
   */
  setData(data) {
    console.log('setdata called=', data);
    if (data && data.length > 0) {
      this.data = data;
      this.updateWindowedData();
    }
  }

  /**
   * Add as extra data to existing data array.
   * @param {any} data 
   */
  addData(data) {
    if (typeof (data) === 'object') {
      this.data.push(data);
      this.updateWindowedData();
    }
  }

  /**
   * This updates the data in array to be viewed in graph
   */
  updateWindowedData() {
    if (this.autoScroll || (this.windowedData.length === 0)) {
      this.windowedData = this.data.slice(-this.windowLength);
    }
    this.updateHeatmap();
  }

  /**
   * Render Function
   */
  render() {
    const { width, height } = this.props;
    console.log('heatmap rendered', width, height, this.data);
    return (
      <canvas ref={this.canvasRef} width={width || 300} height={height || 150} className={styles.mapCanvas}></canvas>
    );
  }
}
