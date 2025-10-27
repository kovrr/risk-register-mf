interface ExitIconProps {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
}

export const ExitIcon = ({
  width = '11',
  height = '11',
  color = '#7A7F86',
}: ExitIconProps) => {
  return (
    <svg width={width} height={height} viewBox='0 0 12 12' fill='none'>
      <g id='Frame'>
        <path
          id='Vector'
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M0 0.705882L11.25 12L12 11.2941L0.75 0L0 0.705882Z'
          fill={color}
        />
        <path
          id='Vector_2'
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M0 11.2941L11.25 0L12 0.705882L0.75 12L0 11.2941Z'
          fill={color}
        />
      </g>
    </svg>
  );
};
