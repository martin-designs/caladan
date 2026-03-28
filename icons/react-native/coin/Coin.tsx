import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Coin = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M12 21.333c-5.144 0-9.333-4.189-9.333-9.333S6.851 2.667 12 2.667c5.15 0 9.333 4.189 9.333 9.333S17.144 21.333 12 21.333" /><Path fill="{color}" d="M12 2.667c5.144 0 9.333 4.189 9.333 9.333S17.144 21.333 12 21.333 2.667 17.149 2.667 12c0-5.15 4.189-9.333 9.333-9.333M12 0C5.374 0 0 5.374 0 12c0 6.625 5.374 12 12 12 6.625 0 12-5.375 12-12 0-6.626-5.375-12-12-12" /><Path fill="{color}" d="m10.814 6.816-3.393 4.238a1.51 1.51 0 0 0 0 1.897l3.393 4.238c.605.761 1.761.761 2.367 0l3.393-4.238a1.51 1.51 0 0 0 0-1.897L13.18 6.816a1.513 1.513 0 0 0-2.367 0" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Coin;