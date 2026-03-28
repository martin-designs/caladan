import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Earn = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M4 17V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v12a1 1 0 0 1 .351 1.936l-8 3a1 1 0 0 1-.702 0l-8-3A1 1 0 0 1 4 17m9-11a1 1 0 0 0-2 0v1h-1a2.5 2.5 0 1 0 0 5h4a.5.5 0 0 1 0 1H9a1 1 0 0 0 0 2h2v1a1 1 0 0 0 2 0v-1h1a2.5 2.5 0 0 0 0-5h-4a.5.5 0 1 1 0-1h5a1 1 0 1 0 0-2h-2z" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Earn;