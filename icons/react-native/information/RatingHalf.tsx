import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const RatingHalf = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M13.08 2.868a1.25 1.25 0 0 0-2.16 0L8.126 7.665 2.697 8.842a1.25 1.25 0 0 0-.667 2.054l3.7 4.141-.56 5.525a1.25 1.25 0 0 0 1.748 1.27L12 19.592l5.082 2.24a1.25 1.25 0 0 0 1.748-1.27l-.56-5.525 3.7-4.14a1.25 1.25 0 0 0-.667-2.055l-5.428-1.176zM12 17.523c.172 0 .344.035.504.106l4.206 1.854-.463-4.573a1.25 1.25 0 0 1 .312-.959l3.062-3.427-4.492-.973a1.25 1.25 0 0 1-.816-.592L12 4.987z" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default RatingHalf;