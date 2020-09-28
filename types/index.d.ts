import React from 'react';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Format from 'd3-format';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Shape from 'd3-shape';
import * as d3Timer from 'd3-timer';
import * as d3Ease from 'd3-ease';

export const d3: typeof d3Scale & typeof d3Array & typeof d3Color & typeof d3Format & typeof d3Interpolate & typeof d3Shape & typeof d3Ease & typeof d3Timer;

/**
 * Stock Heatmap configurations.
 */
export interface StockHeatmapOptions {
  /** Border Padding: [ top, right, bottom, left ] */
  borderPadding?: number[];
  /** Bid Ask Graph Width */
  bidAskWidth?: number,
  /** Y Axis Width  */
  axisYWidth?: number,
  /** X Axis Height */
  axisXHeight?: number,
  /** Buy Color (RBG format)  */
  buyColor?: string,
  /** Contrast text color on top of buy color (RBG format) */
  textOnBuyColor?: string,
  /** Sell Color (RBG format) */
  sellColor?: string,
  /** Contrast text color on top of sell color (RBG format) */
  textOnSellColor?: string,
  /** Contrast text color on top of background color (RBG format) */
  textOnBackground?: string,
  /** Contrast text highlight color on top of background color (RBG format) */
  textHighlightOnBackground?: string,
  /** Price line color (RBG format) */
  tradeColor?: string,
  /** Axis tick hight */
  axisTickSize?: number,
  /** Axis line color contrast to background color (RBG format) */
  axisColor?: string,
  /** X Axis padding between tick and text */
  xAxisTextPadding?: number,
  /** Y Axis padding between tick and text */
  yAxisTextPadding?: number,
  /** Padding between Main graph and Bid ask graph */
  bidAskGraphPaddingLeft?: number,
  /** Bid ask graph transition animation duration (miliseconds) */
  bidAskTransitionDuration?: number,
  /** Trade volume circle maximum radius */
  volumeCircleMaxRadius?: number,
  /** Seconds to accumulate to calculate running buy/sell ratio. */
  runningRatioSeconds?: number,
  /** Graph background color (RBG format) */
  clearColor?: string,
}

/** Data format for the Stock heatmap graph */
export interface StockData {
  /** Market depth data at this data point */
  marketDepth: {
    lastTradedPrice: number,
    lastTradedQty: number,
    priceChangeAmt: number,
    priceChangePct: number,
    lastTradedTS: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    avgPrice: number,
    buyOrderVolume: number,
    buys: { rate: number, orders: number, qty: number }[],
    sellOrderVolume: number,
    sells: { rate: number, orders: number, qty: number }[]
  },
  /** Timestamp for this data point HH:mm:ss */
  ts: string,
  /** The Stock symbol */
  tradingsymbol: string,
  /** Currently pending orders for this data point */
  pendingOrders: any[]
}

/**
 * Stock Heatmap
 * @author Rounak Saha
 *
 * © Copyright 2020, Rounak Saha
 */
export default class StockHeatmap extends React.Component<{
  /** The width of the heatmap */
  width: number,
  /** The height of the heatmap */
  height: number,
  /** Stock Heatmap configurations */
  options: StockHeatmapOptions,
}> {
  /**
   * Set Data for the Heatmap to generate
   * @param {StockData[]} data The data to set
   */
  setData: (data: StockData[]) => void;
  /**
   * Add as extra data to existing data array.
   * @param {StockData} data
   */
  addData: (data: StockData) => void;
  /**
   * This sets the Heatmap Zoom level aka. window.
   * @param {number} zoom The seconds to zoom into
   */
  setZoomLevel: (zoom: number) => void;

  /**
 * Move the position of data window within the main data.
 * @param {number} position The target position of the window to be moved to.
 */
  moveDataWindow: (position: number) => void
}
