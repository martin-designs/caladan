import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Scan = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M4 15a1 1 0 0 1 .993.883L5 16v3h4a1 1 0 0 1 .117 1.993L9 21H5a2 2 0 0 1-1.995-1.85L3 19v-3a1 1 0 0 1 1-1m16 0a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2h-4a1 1 0 0 1 0-2h4v-3a1 1 0 0 1 1-1m0-4a1 1 0 0 1 .117 1.993L20 13H4a1 1 0 0 1-.117-1.993L4 11zM9 3a1 1 0 0 1 0 2H5v3a1 1 0 0 1-2 0V5a2 2 0 0 1 2-2zm10 0a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0V5h-4a1 1 0 1 1 0-2z" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Scan;