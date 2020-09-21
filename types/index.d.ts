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
 * Stock Heatmap
 * @author Rounak Saha
 *
 * © Copyright 2020, Rounak Saha
 */
export default class StockHeatmap extends React.Component<{
    /** The width of the heatmap */
    width: number,
    /** The height of the heatmap */
    height: number
}> {
    /**
     * Set Data for the Heatmap to generate
     * @param {any[]} data The data to set
     */
    setData: (data: any[]) => void;
    /**
     * Add as extra data to existing data array.
     * @param {any} data
     */
    addData: (data: any) => void;
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
