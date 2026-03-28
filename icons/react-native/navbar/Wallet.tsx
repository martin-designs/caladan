import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Wallet = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M16 4a1 1 0 0 1 .117 1.993L16 6H5.5a.5.5 0 0 0-.09.992L5.5 7H19a2 2 0 0 1 1.995 1.85L21 9v9a2 2 0 0 1-1.85 1.995L19 20H5a2 2 0 0 1-1.995-1.85L3 18V6.5a2.5 2.5 0 0 1 2.336-2.495L5.5 4zM5 8.95V18h14V9H5.5q-.171 0-.337-.022zM15.5 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Wallet;