import * as React from 'react';
import Svg, { Path, G, ClipPath, Rect, Circle, Defs } from 'react-native-svg';
interface Props {
  size?: number;
  color?: string;
}
const CoinCoin = ({
  size = 24,
  color = '#000000',
  ...props
}: Props) => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}><G clipPath="url(#a)"><Path fill="{color}" fillRule="evenodd" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m-1.414 3.757a2 2 0 0 1 2.701-.116l.127.116 2.829 2.829a2 2 0 0 1 .116 2.701l-.116.127-2.829 2.829a2 2 0 0 1-2.701.116l-.127-.116-2.829-2.829a2 2 0 0 1-.116-2.701l.116-.127zM12 9.172 9.172 12 12 14.828 14.828 12z" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="{color}" d="M0 0h24v24H0z" /></ClipPath></Defs></Svg>;
export default CoinCoin;