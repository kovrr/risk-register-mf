interface XIconProps {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
}

export const XIcon = ({
  width = '11',
  height = '11',
  color = '#FF2323',
}: XIconProps) => {
  return (
    <svg width={width} height={height} viewBox='0 0 11 11' fill='none'>
      <path d='M1 1L10 10' stroke={color} strokeWidth='2' />
      <path d='M10 1L1 10' stroke={color} strokeWidth='2' />
    </svg>
  );
};
