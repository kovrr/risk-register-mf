interface WarningIconProps {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
}

export const WarningIcon = ({
  width = '40',
  height = '40',
  color = '#FF9900',
}: WarningIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M35.4054 38.2811C37.4163 38.2811 38.3304 36.8186 37.4163 35.0515L21.146 3.05928C20.232 1.29209 18.7695 1.29209 17.8554 3.05928L1.58508 35.0515C0.671017 36.8186 1.58508 38.2811 3.59602 38.2811H35.4054Z'
        fill={color}
      />
      <path
        d='M22.0591 14.8814L20.3528 26.1549C20.17 27.2517 18.7684 27.2517 18.5856 26.1549L16.9403 14.8814C16.6356 10.4939 22.3637 10.4939 22.0591 14.8814Z'
        fill='white'
      />
      <path
        d='M19.5002 33.2843C18.0867 33.2843 16.9408 32.1384 16.9408 30.7249C16.9408 29.3114 18.0867 28.1655 19.5002 28.1655C20.9137 28.1655 22.0596 29.3114 22.0596 30.7249C22.0596 32.1384 20.9137 33.2843 19.5002 33.2843Z'
        fill='white'
      />
    </svg>
  );
};
