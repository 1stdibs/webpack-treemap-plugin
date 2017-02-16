import React, { Component, PropTypes } from 'react';
import {Tooltip} from 'pui-react-tooltip';
import {OverlayTrigger} from 'pui-react-overlay-trigger';
import {hoverDupe, zoomOnNode} from '../actions';
import getTextWidth from '../utils/getTextWidth';
const replaceTilde = str => str === "~" ? "node_modules" : str;

class TreeMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weight: 1,
            stroke: false
        };
    }
    shouldComponentUpdate(nextprops, nextstate) {
        if (this.props.data.x0 !== nextprops.x0 || this.props.data.y0 !== nextprops.y0) {
            return true;
        }
        if (this.props.data.x1 !== nextprops.x1 || this.props.data.y1 !== nextprops.y1) {
            return true;
        }
        if(this.state.weight !== nextstate.weight){
            return true;
        }
        return !!this.props.data.data.dupeName;
    }
    onEnter() {
        this.props.dispatch(hoverDupe(this.props.data.data.dupeName || ''));
        this.setState({weight: 4, stroke: true});
    }
    onLeave() {
        this.setState({weight: 1, stroke: false});
    }
    onClick() {
        this.props.dispatch(zoomOnNode(this.props.data.copy()))
    }
    render() {
        const name = this.props.data.ancestors().map(data => replaceTilde(data.data.name)).reverse().join(' / ');
        const width = this.props.data.x1 - this.props.data.x0;
        const height = this.props.data.y1 - this.props.data.y0;
        const percent = this.props.data.value/this.props.fullValue;
        let stroke = this.state.stroke;
        let weight = this.state.weight;
        let textElement;
        if (this.props.hoveredDupe && this.props.data.data.dupeName === this.props.hoveredDupe) {
            stroke = '#84fffa';
            weight = 4;
        }
        if (this.props.showName && height > 20 && width > 17) {
            const text = replaceTilde(this.props.data.data.name);
            const textWidth = getTextWidth(text, "10pt sans-serif");
            textElement = (<text
                        x={this.props.data.x0 + 2}
                        y={this.props.data.y0 + 15}
                        textAnchor='start'
                        stroke="#fff"
                        fill="#fff"
                        style={{
                            fontFamily: "sans-serif",
                            fontSize: "10pt"
                        }}                        
                    >
                        {(width-2) < textWidth ? "..." : text}
                   </text>);
        }
        return <OverlayTrigger placement="top" overlay={<Tooltip>{name}: {(percent*100).toFixed(2)}%</Tooltip>}>
            <g>
                <rect
                    onClick={() => this.onClick()}
                    x={this.props.data.x0}
                    y={this.props.data.y0}
                    width={width}
                    height={height}
                    stroke={stroke ? "#c0ffee" : this.props.data.data.baseColor}
                    fill={this.props.data.data.color || "transparent"}
                    strokeWidth={weight}
                    onMouseEnter={() => this.onEnter()}
                    onMouseLeave={() => this.onLeave()}
                />
                {textElement}
            </g>
        </OverlayTrigger>;
    }
};

TreeMap.propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
    hoveredDupe: PropTypes.string,
    showName: PropTypes.bool,
    fullValue: PropTypes.number,
};

export default TreeMap;
