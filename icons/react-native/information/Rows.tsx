import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Ellipse, Line, Polyline, Polygon, LinearGradient, RadialGradient, Stop, Defs, Mask, Use, Symbol, Text, TSpan } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Rows = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><Path fill={color} fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 2h14v4H5zm0 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zm0 2h14v4H5z" clipRule="evenodd" /></Svg>;
export default Rows;