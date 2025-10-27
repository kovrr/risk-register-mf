import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../atoms/arrow-left-icon';
import { Button } from '../atoms/button';

const BackWithLabel: React.FC<{ label: string }> = ({ label }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant='ghost'
      onClick={() => navigate(-1)}
      className='inline-flex w-fit text-fill-brand-primary hover:bg-transparent hover:text-fill-brand-primary'
    >
      <ArrowLeftIcon />
      <span className='text-sm'>{label}</span>
    </Button>
  );
};

export default BackWithLabel;
