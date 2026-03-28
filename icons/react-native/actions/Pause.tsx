import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Pause = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M8 4a1 1 0 0 1 .993.883L9 5v14a1 1 0 0 1-1.993.117L7 19V5a1 1 0 0 1 1-1m8 0a1 1 0 0 1 .993.883L17 5v14a1 1 0 0 1-1.993.117L15 19V5a1 1 0 0 1 1-1" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Pause;