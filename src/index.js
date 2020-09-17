import React from 'react';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Format from 'd3-format';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Shape from 'd3-shape';
import * as d3Zoom from 'd3-zoom';
import * as d3Timer from 'd3-timer';
import * as d3Ease from 'd3-ease';
import { extractBidPrices, extractBidVolumes, extractMaxTradedVolume, extractMaxVolume, zoomTimeFormat } from './utils';

export const d3 = Object.assign(
  Object.assign(
    Object.assign({}, d3Scale, d3Array, d3Color)
    , d3Format, d3Interpolate, d3Shape
  )
  , d3Zoom, d3Ease, d3Timer
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
  windowPosition = 0;
  autoScroll = true;

  /** Default Theme colors and dimensions */
  defaults = {
    borderPadding: [5, 5, 0, 0],
    bidAskWidth: 100,
    axisYWidth: 50,
    axisXHeight: 50,
    buyColor: '#388e3c',
    textOnBuyColor: '#ffffff',
    sellColor: '#d32f2f',
    textOnSellColor: '#ffffff',
    textOnBackground: '#000000',
    tradeColor: '#7434eb',
    axisTickSize: 6,
    axisColor: '#000000',
    xAxisTextPadding: 6,
    yAxisTextPadding: 6,
    bidAskGraphPaddingLeft: 10,
    bidAskTransitionDuration: 500,
    hmWidth: () => (this.props.width - this.defaults.borderPadding[1] - this.defaults.borderPadding[3] - this.defaults.bidAskWidth - this.defaults.axisYWidth),
    hmHeight: () => (this.props.height - this.defaults.borderPadding[0] - this.defaults.borderPadding[2] - this.defaults.axisXHeight),
    clearColor: '#ffffff',
  };

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate', nextProps);
    const shouldUpdate = this.props.width !== nextProps.width
      || this.props.height !== nextProps.height;
    if (shouldUpdate) {
      this.detachMouseListeners();
    }
    return shouldUpdate;
  }

  // -------------------START:: Lifecycle methods to retrive 2d context from updated dom-------------------------
  componentDidMount() {
    // console.log('component mouted');
    if (this.canvasRef.current !== null) {
      this.drawingContext = this.canvasRef.current.getContext('2d');
      this.updateHeatmap();
      this.attachMouseListeners();
    }
  }
  componentDidUpdate() {
    // console.log('component updtated');
    if (this.canvasRef.current !== null) {
      this.drawingContext = this.canvasRef.current.getContext('2d');
      this.updateHeatmap();
      this.attachMouseListeners();
    }
  }
  componentWillUnmount() {
    this.detachMouseListeners();
  }
  // -------------------END:: Lifecycle methods to retrive 2d context from updated dom---------------------------


  // ------------------ START:: Mouse Event listeners -------------------
  isMouseDown = false;
  mouseDownX = 0;

  /**
   * Attaches mouse interaction event listeners
   */
  attachMouseListeners = () => {
    if (this.canvasRef.current !== null) {
      this.canvasRef.current.addEventListener('mousedown', this.eventMouseDown);
      this.canvasRef.current.addEventListener('mousemove', this.eventMouseMove);
      this.canvasRef.current.addEventListener('mouseup', this.eventMouseUp);
      this.canvasRef.current.addEventListener('wheel', this.eventZoomWheel);
    }
  }

  /**
   * Detaches mouse interaction event listeners
   */
  detachMouseListeners = () => {
    if (this.canvasRef.current !== null) {
      this.canvasRef.current.removeEventListener('mousedown', this.eventMouseDown);
      this.canvasRef.current.removeEventListener('mousemove', this.eventMouseMove);
      this.canvasRef.current.removeEventListener('mouseup', this.eventMouseUp);
      this.canvasRef.current.removeEventListener('wheel', this.eventZoomWheel);
    }
  }

  /**
   * Mouse down event on canvas
   * @param {MouseEvent} e 
   */
  eventMouseDown = (e) => {
    // console.log('eventMouseDown', e);
    this.isMouseDown = true;
    this.mouseDownX = e.x;
  }

  /**
   * Mouse move event on canvas
   * @param {MouseEvent} e 
   */
  eventMouseMove = (e) => {
    if (this.isMouseDown) {
      // Mouse drag, scroll the time series
      const dragLength = e.x - this.mouseDownX;
      const moveDataPointsCount = Math.floor(Math.abs(dragLength) / this.xScale.bandwidth());
      if (moveDataPointsCount > 0) this.mouseDownX = e.x;
      // const moveDataPointDirection = dragLength >= 0 ? 'right' : 'left';
      // console.log('drag x=', dragLength, moveDataPointsCount, this.windowPosition);
      this.moveDataWindow(this.windowPosition + moveDataPointsCount * (dragLength >= 0 ? -1 : 1));
    }
    else {
      // normal mouse move

    }
  }

  /**
   * Mouse up event on canvas
   * @param {MouseEvent} e 
   */
  eventMouseUp = (e) => {
    // console.log('eventMouseUp',e);
    this.isMouseDown = false;
    this.mouseDownX = 0;
  }

  /**
   * Wheel event on canvas to zoom
   * @param {WheelEvent} e 
   */
  eventZoomWheel = (e) => {
    const direction = e.deltaY < 0 ? 'zoom-in' : 'zoom-out';
    let l = 0, l2 = 0;
    switch (direction) {
      case 'zoom-in':
        l = Math.max(this.windowLength - 1, 3);
        break;
      case 'zoom-out':
        l = Math.min(this.windowLength + 1, this.data.length - 1);
        break;
    }
    l2 = this.windowLength - l;
    this.windowLength = l;
    this.moveDataWindow(this.windowPosition + l2);
    // console.log('zoom Level=', this.windowLength);
  }

  // ------------------ END:: Mouse Event listeners ---------------------


  // ------------------ D3 Variables ---------------------
  /** @type {d3Scale.ScaleBand<string>} */
  xScale = null;
  /** @type {d3Scale.ScaleLinear<number, number>} */
  bidAskScale = null;
  /** @type {d3Scale.ScaleBand<string>} */
  yScale = null;
  /** @type {number[]} */
  yDomainValues = null;
  /** @type {d3Timer.Timer} */
  bidAskAnimTimer = null;
  /** @type {{[key:number]:number}} */
  bidAskBarAnimConfig = {};
  // ------------------ D3 Variables ---------------------

  /**
   * This function will be called if there is any dimension change on heatmap
   * This function changes the d3 scales based on windowed data
   */
  updateHeatmapDimensions = () => {
    // console.log('heatmap dimension updated, update scale domains');
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
  updateHeatmap = () => {
    if (this.drawingContext !== null) {
      // console.log('heatmap update req');
      // 1. update scale and dimensions
      this.updateHeatmapDimensions();

      // 2. Draw the bid ask spread heatmap
      this.clearCanvas(this.defaults.borderPadding[3], this.defaults.borderPadding[0],
        this.defaults.hmWidth(), this.defaults.hmHeight(), this.defaults.clearColor);
      this.drawMainGraph();

      // 3. Draw xy Axis
      this.drawXAxis();
      this.drawYAxisAndBidAskGraph();

      // 4. Draw buy-to-sell ratio
      this.drawBuy2SellRatio();

      // console.log('heatmap draw update');
      // this.clearCanvas(0, 0, this.defaults.hmWidth(), this.defaults.hmHeight(), '#aaaaaa');
    }
  }

  // ------------------------------ START: Canvas draw functions ---------------------------------------

  /**
   * Draw buy/sell ratio at bottom right corner
   */
  drawBuy2SellRatio = () => {
    if (this.windowedData.length > 0) {
      // dimension
      const d = this.windowedData[this.windowedData.length - 1];
      const x = this.defaults.borderPadding[3] + this.defaults.hmWidth() + this.defaults.axisTickSize;
      const y = this.defaults.borderPadding[0] + this.defaults.hmHeight() + this.defaults.axisTickSize;
      const w = this.props.width - x;
      const h = this.props.height - y;
      this.clearCanvas(x, y, w, h, this.defaults.clearColor);
      let textHeight = (h - 15) / 2;
      this.drawingContext.save();
      this.drawingContext.textAlign = 'center';
      this.drawingContext.textBaseline = 'middle';
      this.drawingContext.font = `bold ${textHeight}px sans-serif`;
      this.drawingContext.fillText((d.marketDepth.buyOrderVolume / d.marketDepth.sellOrderVolume).toFixed(2), x + w / 2, y + textHeight / 2);
      this.drawingContext.fillText('Buy/Sell', x + w / 2, y + textHeight * 1.5 + 5);
      this.drawingContext.restore();
    }
  }

  /**
   * Draws X Axis
   */
  drawXAxis = () => {
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
    const assumedTextWidth = this.drawingContext.measureText('77:77:77').width + 20;
    const bandInterval = parseInt(assumedTextWidth / (this.xScale?.bandwidth() || 1)) || 1;
    // console.log('bandInterval=', bandInterval);
    this.windowedData.map((d, i) => {
      let x = this.xScale(d.ts);
      this.drawingContext.moveTo(x, 0);
      this.drawingContext.lineTo(x, this.defaults.axisTickSize);
      if (i % bandInterval === 0)
        this.drawingContext.fillText(d.ts, x, this.defaults.axisTickSize + this.defaults.xAxisTextPadding);
    });
    this.drawingContext.textAlign = 'left';
    this.drawingContext.fillText(`Zoom Level:  ${zoomTimeFormat(this.windowLength)}`, 20, this.defaults.axisTickSize + this.defaults.xAxisTextPadding + 20);
    let w = this.drawingContext.measureText(`Zoom Level:  ${zoomTimeFormat(this.windowLength)}`).width;
    if (this.windowedData.length > 0)
      this.drawingContext.fillText(`LTP:  ${this.windowedData[this.windowedData.length - 1].marketDepth.lastTradedPrice
        }     LTQ:  ${this.windowedData[this.windowedData.length - 1].marketDepth.lastTradedQty
        }`, 20 + w + 20, this.defaults.axisTickSize + this.defaults.xAxisTextPadding + 20);
    this.drawingContext.lineWidth = 1.2;
    this.drawingContext.strokeStyle = this.defaults.axisColor;
    this.drawingContext.stroke();
    this.drawingContext.restore();
  }

  /**
   * Draws Y Axis and Bid Ask graph at the same time
   */
  drawYAxisAndBidAskGraph = () => {
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
      let maxTextWidth = 0;
      this.yDomainValues.map(d => {
        let y = this.yScale(d);
        this.drawingContext.moveTo(0, y);
        this.drawingContext.lineTo(this.defaults.axisTickSize, y);
        this.drawingContext.fillText(d.toFixed(2), this.defaults.axisTickSize + this.defaults.yAxisTextPadding, y + 2, this.defaults.axisYWidth - this.defaults.axisTickSize + this.defaults.yAxisTextPadding);
        let tw = this.drawingContext.measureText(d.toFixed(2)).width;
        maxTextWidth = maxTextWidth >= tw ? maxTextWidth : tw;
      });
      this.drawingContext.lineWidth = 1.2;
      this.drawingContext.strokeStyle = this.defaults.axisColor;
      this.drawingContext.stroke();
      this.drawingContext.restore();

      // Now I will draw the bid ask strength graph,
      const x = this.defaults.borderPadding[3] + this.defaults.hmWidth() + maxTextWidth + this.defaults.axisTickSize + this.defaults.yAxisTextPadding + this.defaults.bidAskGraphPaddingLeft;
      const y = this.defaults.borderPadding[0];
      this.drawBidAskGraph(x, y);
    }
  }

  /**
   * Draw and animate Bid Ask graph
   * @param {number} x 
   * @param {number} y 
   */
  drawBidAskGraph = (x, y) => {
    if (this.windowedData.length > 0) {
      if (this.bidAskAnimTimer !== null) {
        this.bidAskAnimTimer.stop();
        this.bidAskAnimTimer = null;
      }
      this.bidAskAnimTimer = d3.timer(elapsed => {
        // compute how far through the animation we are (0 to 1)
        const t = Math.min(1, d3.easeCubic(elapsed / this.defaults.bidAskTransitionDuration));

        // ----------------draw--------------------
        // console.log('drawing bid ask graph');
        this.clearCanvas(
          x, y, this.defaults.bidAskWidth, this.defaults.hmHeight() + this.defaults.axisTickSize, this.defaults.clearColor
        );
        const h = this.yScale.bandwidth() - 2;
        const d = this.windowedData[this.windowedData.length - 1];
        const maxBidAskVol = extractMaxVolume(d);
        this.drawingContext.save();
        this.drawingContext.translate(x, y);
        this.drawingContext.lineWidth = 0;
        this.drawingContext.textBaseline = 'middle';
        const drawBars = (arr, color, textColor) => {
          arr.map(v => {
            this.drawingContext.fillStyle = color;
            const l = this.defaults.bidAskWidth * (+v.qty / maxBidAskVol);
            // save v bars length
            this.bidAskBarAnimConfig[v.rate] = d3.interpolateNumber(this.bidAskBarAnimConfig[v.rate] || 0, l)(t);
            this.drawingContext.fillRect(0, this.yScale(v.rate), this.bidAskBarAnimConfig[v.rate], h);
            let tw = this.drawingContext.measureText(v.qty).width;
            if (this.defaults.bidAskWidth - this.bidAskBarAnimConfig[v.rate] - 2 >= tw) {
              // text outside bar
              this.drawingContext.textAlign = 'start';
              this.drawingContext.fillStyle = this.defaults.textOnBackground;
              this.drawingContext.fillText(v.qty, this.bidAskBarAnimConfig[v.rate] + 2, this.yScale(v.rate) + h / 2 + 1);
            } else {
              this.drawingContext.textAlign = 'end';
              this.drawingContext.fillStyle = textColor;
              this.drawingContext.fillText(v.qty, this.bidAskBarAnimConfig[v.rate] - 2, this.yScale(v.rate) + h / 2 + 1);
            }
          });
        }
        drawBars(d.marketDepth.buys, this.defaults.buyColor, this.defaults.textOnBuyColor);
        drawBars(d.marketDepth.sells, this.defaults.sellColor, this.defaults.textOnSellColor);
        this.drawingContext.restore();
        // ----------------draw--------------------

        // if this animation is over
        if (t === 1) this.bidAskAnimTimer.stop();
      });
    }
  }

  /**
   * Draws background heatmap for both buys and sells
   */
  drawMainGraph = () => {
    this.drawingContext.save();
    if (this.xScale && this.yScale && this.bidAskScale && this.drawingContext !== null) {
      const maxTradedVolume = extractMaxTradedVolume(this.windowedData);
      const xh2 = this.xScale.bandwidth() * 0.5;
      const yh2 = this.yScale.bandwidth() * 0.5;
      this.drawingContext.translate(this.defaults.borderPadding[3], this.defaults.borderPadding[0]);
      this.windowedData.map(d => {
        const marketDepth = d.marketDepth;
        const ts = d.ts;
        const maxBidAskVol = extractMaxVolume(d);
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
  clearCanvas = (x, y, w, h, color) => {
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
  setData = (data) => {
    // console.log('setdata called=', data);
    if (data && data.length > 0) {
      this.data = data;
      this.updateWindowedData();
    }
  }

  /**
   * Add as extra data to existing data array.
   * @param {any} data 
   */
  addData = (data) => {
    if (typeof (data) === 'object') {
      this.data.push(data);
      this.updateWindowedData();
    }
  }

  /**
   * This updates the data in array to be viewed in graph
   */
  updateWindowedData = () => {
    // console.log('window data updated');
    this.moveDataWindow(this.data.length - this.windowLength - 1);
  }

  /**
   * Move the position of data window within the main data.
   * @param {number} position The target position of the window to be moved to.
   */
  moveDataWindow = (position) => {
    if (position !== this.windowPosition && position > -1 && position < this.data.length - this.windowLength) {
      // move position only if within valid range
      this.windowedData = this.data.slice(position, position + this.windowLength);
      this.windowPosition = position;
      if (this.windowPosition === this.data.length - this.windowLength - 1) {
        // enable auto scroll
        this.autoScroll = true;
      }
      // console.log('moveDataWindow = ', position, this.windowPosition, this.windowLength, this.data.length, this.autoScroll, this.windowedData);
      // update the map
      this.updateHeatmap();
    }
  }

  /**
   * This sets the Heatmap Zoom level aka. window.
   * @param {number} zoom The seconds to zoom into
   */
  setZoomLevel = (zoom) => {
    let l = Math.min(Math.max(zoom, 3), this.data.length - 1);
    let l2 = this.windowLength - l;
    this.windowLength = l;
    this.moveDataWindow(this.windowPosition + l2);
  }

  /**
   * Render Function
   */
  render() {
    const { width, height } = this.props;
    // console.log('heatmap rendered', width, height, this.data);
    return (
      <canvas ref={this.canvasRef} width={width || 300} height={height || 150}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}></canvas>
    );
  }
}
