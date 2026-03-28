import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const EllipsisVertical = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M12 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default EllipsisVertical;