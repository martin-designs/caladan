import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Ellipse, Line, Polyline, Polygon, LinearGradient, RadialGradient, Stop, Defs, Mask, Use, Symbol, Text, TSpan } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const ShoppingCartFill = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><Path fill={color} d="m20.99 6.131-1.143 6.272a2.25 2.25 0 0 1-2.213 1.847H6.76l.413 2.25H17.25A2.25 2.25 0 1 1 15 18.75c0-.256.044-.51.131-.75H9.62a2.25 2.25 0 1 1-3.825-.712L3.197 3H1.5a.75.75 0 0 1 0-1.5h1.697a1.5 1.5 0 0 1 1.472 1.228l.46 2.522H20.25a.74.74 0 0 1 .572.272.72.72 0 0 1 .169.61" /></Svg>;
export default ShoppingCartFill;