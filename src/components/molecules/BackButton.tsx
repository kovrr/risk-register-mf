import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../atoms/arrow-left-icon';
import { Button } from '../atoms/button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant='outline'
      onClick={() => navigate(-1)}
      className='flex h-[34px] w-[34px] items-center rounded-[5px] border-fill-brand-primary text-fill-brand-primary hover:bg-transparent hover:text-fill-brand-primary'
    >
      <ArrowLeftIcon />
    </Button>
  );
};

export default BackButton;
