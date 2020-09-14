import React from 'react';
import styles from './styles.module.css';
// import PropTypes from 'prop-types';

/**
 * Stock Heatmap
 * @author Rounak Saha
 * © Copyright 2020, Rounak Saha
 */
export default class StockHeatmap extends React.Component {

  canvasRef = React.createRef();
  data = [];

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = this.props.width !== nextProps.width
      || this.props.height !== nextProps.height;
    if (shouldUpdate) this.updateHeatmapDimensions();
    return shouldUpdate;
  }


  /**
   * This function will be called if there is any dimension change on heatmap
   */
  updateHeatmapDimensions() {

  }

  /**
   * This method will be called after an update of internal data is performed.
   */
  updateHeatmap() {

  }

  /**
   * Set Data for the Heatmap to generate
   * @param {any[]} data The data to set
   */
  setData(data) {
    console.log('setdata called=', data);
    if (data && data.length > 0) {
      this.data = data;
      this.updateHeatmap();
    }
  }

  /**
   * Add as extra data to existing data array.
   * @param {any} data 
   */
  addData(data) {
    if (typeof (data) === 'object') {
      this.data.push(data);
      this.updateHeatmap();
    }
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
