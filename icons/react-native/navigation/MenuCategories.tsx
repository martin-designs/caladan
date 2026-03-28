import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const MenuCategories = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M4.5 17.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M20 18a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zM4.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M20 11a1 1 0 0 1 .117 1.993L20 13H9a1 1 0 0 1-.117-1.993L9 11zM4.5 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M20 4a1 1 0 0 1 .117 1.993L20 6H9a1 1 0 0 1-.117-1.993L9 4z" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default MenuCategories;