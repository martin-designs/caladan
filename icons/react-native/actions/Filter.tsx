import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Filter = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M14 17a1 1 0 0 1 .117 1.993L14 19h-4a1 1 0 0 1-.117-1.993L10 17zm3-6a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm3-6a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Filter;