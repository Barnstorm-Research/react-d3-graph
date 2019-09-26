import React from "react";

/**
 * LinkNode component is responsible for encapsulating dot on link
 * @example

 *
 * <LinkNode id='nodeId'
 *     cx=22
 *     cy=22
 *     fill='green'
 *     opacity=1
 *     size=200
 *     strokeColor='SAME'
 *     strokeWidth=1.5
 *     className='node'
 />
 */
export default class NodeLink extends React.Component {
    render() {
        const linkNodeProps = {
            className: this.props.className,
            r: this.props.size,
            size: this.props.size,
            style: {
                fill: this.props.fill,
                stroke: this.props.strokeColor,
                strokeWidth: this.props.strokeWidth,
            },
            cx: this.props.cx,
            cy: this.props.cy,
            opacity: this.props.opacity,
        };

        return <circle {...linkNodeProps} />;
    }
}
