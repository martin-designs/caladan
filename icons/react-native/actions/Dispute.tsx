import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Ellipse, Line, Polyline, Polygon, LinearGradient, RadialGradient, Stop, Defs, Mask, Use, Symbol, Text, TSpan } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const Dispute = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><Path fill={color} fillRule="evenodd" d="M17.295 3.7a2.7 2.7 0 0 0-.931.439c-.101.075-2.698 2.653-5.772 5.729L5.005 15.46l-1.063 2.339-1.062 2.34.389.39.389.391H4.3l2.12-.962 2.119-.963 5.612-5.607c5.714-5.71 5.83-5.833 6.039-6.331.169-.403.212-.986.109-1.477-.186-.889-.991-1.694-1.88-1.88a3 3 0 0 0-1.125 0m.92 2.096c.11.11.125.153.125.345v.219l-5.49 5.49-5.49 5.49-.605.272c-.332.15-.612.264-.622.254-.01-.009.102-.285.249-.612l.267-.594 5.465-5.473c3.006-3.01 5.502-5.49 5.546-5.51.157-.071.42-.015.555.119m-6.542 13.267c-.37.114-.673.546-.673.957 0 .385.318.809.69.919.176.053.699.061 3.81.061 4.083 0 3.879.015 4.197-.303.183-.183.303-.46.303-.697 0-.402-.312-.827-.69-.939-.298-.089-7.35-.087-7.637.002" clipRule="evenodd" /></Svg>;
export default Dispute;