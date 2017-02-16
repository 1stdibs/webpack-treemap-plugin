import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import TreeMapCell from './TreeMapCell';

 class TreeMap extends Component {
    render(){
        let graphics;
        if (this.props.stats.get('chunks').size) {
            const notFullDepth = this.props.stats.get('selectedDepth') < this.props.stats.getIn(['chunks', this.props.open]).tree.height;
            graphics = this.props.stats.getIn(['chunks', this.props.open]).vis.map((item, index) => {
                return <TreeMapCell
                            hoveredDupe={this.props.stats.get('dupeName')}
                            key={index}
                            data={item}
                            dispatch={this.props.dispatch}
                            showName={notFullDepth || this.props.stats.get('zoomed')}
                            fullValue={this.props.stats.getIn(['chunks', this.props.open]).fullValue}
                        />;
            });
        }
        return (<div>
          <svg width={900} height={600}>
            {graphics}
          </svg>
        </div>);
    }
};

TreeMap.PropTypes = {
    stats: PropTypes.instanceOf(Map),
    open: PropTypes.number,
    dispatch: PropTypes.func
};

export default TreeMap;
