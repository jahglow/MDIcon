/**
 * Created by IvanP on 23.01.2017.
 */
import React, {PureComponent} from 'react';
/**
 * Renders an SVG material icon imported from an icon-set and passed via props
 * @param {Object} props
 * @param {Object} props.icon - imported icon definition (jsx)
 * @param {Object} props.children - imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute
 * @param {Number} [props.size=24] - icon width/height (which equals height since all MD icons have square viewbox). Any of `18|24|36|48`
 * @param {String} [props.fill='rgba(0,0,0,.85)'] - icon fill - any valid css color, fills the whole icon
 * */
export class MDIcon extends PureComponent {
  render() {
    let {fill,size,icon,children} = this.props;
    console.log(fill,size,icon,children);
    return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} width={size} height={size} viewBox="0 0 24 24" children={icon || children} />);
  }
}

MDIcon.defaultProps = {
  size: 24,
  fill: 'rgba(0,0,0,.85)'
};
