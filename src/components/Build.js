import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {changeDepth, openChunk, backToTop} from '../actions';
import TreeMap from './TreeMap';
import Select from 'react-select';
import './Build.css';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';


class Build extends Component {
    changeDepth(e) {
        this.props.dispatch(changeDepth(Number(e.target.value)));
    }

    backToTop() {
        this.props.dispatch(backToTop());
    }

    chunkSelecter(chunks) {
        return (<Select
            className="select-boxes column"
            resetValue={{value: 0}}
            options={chunks.toArray()}
            value={this.props.stats.get('open')}
            placeholder="Select a Chunk"
            onChange={(e) => this.props.dispatch(openChunk(e.value))}
          />);
    }

    depthSlider() {
        if (!this.props.stats.get('chunks').size) {
            return;
        }
        const height = this.props.stats.getIn(['chunks', this.props.stats.get('open')]).tree.height;
        return <div className="column columns depth-slider">
            <label className="column is-4 label"> Tree Depth </label>
            <input
                type="range"
                className="column is-8"
                onChange={(e) => this.changeDepth(e)}
                min={1}
                max={height}
                value={Math.min(this.props.stats.get('selectedDepth'), height)}
                step={1}
            />
        </div>
    }

    render() {
        const chunkSelect = this.props.stats.get('chunks').map((item, index) => {
            return {value: index, label: item.name}
        });
        let treemap;
        let chunkSelecter;
        if (this.props.stats) {
            treemap = <TreeMap dispatch={this.props.dispatch} open={this.props.stats.get('open')} stats={this.props.stats} />;
            chunkSelecter = this.chunkSelecter(chunkSelect);
        }
        const depthSlider = this.depthSlider();
        let fileSizes;
        let backToTopButton;
        if(this.props.stats.get('zoomed')){
            backToTopButton = <div className="column"><button className="button back-to-top" onClick={() => this.backToTop()}> Back To Top </button></div>;
        }

        return (
            <div className="build-item">
                <div className="section columns treemap-inputs">
                    {chunkSelecter}
                    {depthSlider}
                </div>
                <div className="section">
                    <div style={{width: 900}} className="columns">
                    {fileSizes}
                    {backToTopButton}
                    </div>
                    {treemap}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
  const { stats } = state;

  return {
    stats
  };
}

Build.propTypes = {
    dispatch: PropTypes.func.isRequired,
    stats: PropTypes.instanceOf(Map)
}



export default connect(mapStateToProps)(Build);
