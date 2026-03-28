import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Audio = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M19.07 12.01a1 1 0 0 1 .85 1.132A8.004 8.004 0 0 1 13 19.938V21a1 1 0 0 1-2 0v-1.062a8.005 8.005 0 0 1-6.919-6.796 1 1 0 1 1 1.98-.284 6.002 6.002 0 0 0 11.878 0 1 1 0 0 1 1.131-.848M12 2a5 5 0 0 1 5 5v5a5 5 0 1 1-10 0V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Audio;