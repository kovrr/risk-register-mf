import React from 'react';

const RestrictedOverlay = ({
  restricted,
  children,
  restrictedImagePath,
}: {
  restricted: boolean;
  children: React.ReactNode;
  restrictedImagePath: string;
}) => {
  if (restricted) {
    return (
      <div className='relative'>
        <img
          src={restrictedImagePath}
          alt='Restricted content'
          className='h-full w-full rounded-lg object-cover'
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default RestrictedOverlay;
