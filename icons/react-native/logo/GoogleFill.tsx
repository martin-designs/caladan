import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const GoogleFill = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M12 5.5a6.5 6.5 0 1 0 6.326 8H13a1.5 1.5 0 1 1 0-3h7a1.5 1.5 0 0 1 1.5 1.5 9.5 9.5 0 1 1-2.801-6.736 1.498 1.498 0 0 1-.48 2.448 1.5 1.5 0 0 1-1.636-.321A6.48 6.48 0 0 0 12 5.5" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default GoogleFill;