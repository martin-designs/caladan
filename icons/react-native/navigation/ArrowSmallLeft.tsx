import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const ArrowSmallLeft = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M9.464 12.707a1 1 0 0 1 0-1.414l2.829-2.829A1 1 0 0 1 14 9.172v5.656a1 1 0 0 1-1.707.708z" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default ArrowSmallLeft;