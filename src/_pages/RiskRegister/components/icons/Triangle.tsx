const BASE_COLOR = 'var(--viz-base-market)';

type Direction = 'up' | 'down' | 'right';

type Props = {
  color?: string;
  direction?: Direction;
};

export const Triangle = ({ color, direction = 'down' }: Props) => {
  const getRotation = () => {
    switch (direction) {
      case 'up':
        return 'rotate(180 7 4)';
      case 'right':
        return 'rotate(270 7 4)';
      case 'down':
      default:
        return '';
    }
  };

  return (
    <svg
      width='14'
      height='8'
      viewBox='0 0 14 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7 7.99561L0.0717964 0.495605H13.9282L7 7.99561Z'
        fill={color || BASE_COLOR}
        transform={getRotation()}
      />
    </svg>
  );
};
