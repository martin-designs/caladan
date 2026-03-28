import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const NotificationSuccessFill = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.535 6.381-4.95 4.95-2.12-2.121a1 1 0 0 0-1.415 1.414l2.758 2.758a1.1 1.1 0 0 0 1.556 0l5.586-5.586a1 1 0 0 0-1.415-1.415" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default NotificationSuccessFill;