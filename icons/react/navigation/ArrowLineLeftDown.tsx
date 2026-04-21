import * as React from 'react';
interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}
const ArrowLineLeftDown = ({
  size = 24,
  ...props
}: Props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={size} height={size} {...props}><path fill="currentColor" fillRule="evenodd" d="M17.24 5.443c-.141.063-1.28 1.18-5.21 5.108L7 15.58v-2.843c0-3.232.01-3.121-.303-3.434A1.05 1.05 0 0 0 6 9c-.236 0-.514.121-.694.3C4.981 9.626 5 9.328 5 14s-.019 4.374.306 4.7c.317.316.059.3 4.694.3 4.641 0 4.377.017 4.697-.303.183-.183.303-.46.303-.697s-.12-.514-.303-.697c-.313-.313-.202-.303-3.434-.303H8.42l5.029-5.03c3.928-3.93 5.045-5.069 5.108-5.21a1.02 1.02 0 0 0-.2-1.117 1.02 1.02 0 0 0-1.117-.2" clipRule="evenodd" /></svg>;
export default ArrowLineLeftDown;