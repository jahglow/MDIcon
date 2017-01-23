/**
 * Created by IvanP on 23.01.2017.
 */
import React from 'react';
export class MDIcon extends React.Component {
  /**
   * Renders an SVG material icon imported from an icon-set and passed via props
   * @param {Object} props
   * @param {Object} props.icon - imported icon definition (jsx)
   * @param {Object} props.children - imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute
   * @param {Number} [props.width=24] - icon width (which equals height since all MD icons have square viewbox). Any of `18|24|36|48`
   * @param {String} [props.fill='rgba(0,0,0,.85)'] - icon fill - any valid css color, fills the whole icon
   * */
  constructor(props){
    super(props);
  }
  render() {
    return this.props.icon || this.props.children? (
      <svg xmlns="http://www.w3.org/2000/svg" fill={this.props.fill} width={this.props.width} height={this.props.width} viewBox="0 0 24 24">{this.props.icon?this.props.icon:this.props.children?this.props.children:null}</svg>
    ) : null;
  }
}

MDIcon.defaultProps = {
  width: 24,
  fill: 'rgba(0,0,0,.85)'
};
