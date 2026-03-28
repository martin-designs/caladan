import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Liked = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M18.494 3.801c2.095 1.221 3.569 3.7 3.504 6.592C21.86 16.5 13.5 21 12 21s-9.861-4.5-9.998-10.607c-.065-2.892 1.409-5.37 3.504-6.592C7.466 2.66 9.928 2.653 12 4.338c2.072-1.685 4.534-1.679 6.494-.537" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default Liked;