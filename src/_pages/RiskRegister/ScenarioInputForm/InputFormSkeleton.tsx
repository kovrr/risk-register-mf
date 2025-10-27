import { Skeleton } from '@/components/atoms/skeleton';

export const InputFormSkeleton = () => {
  return (
    <div className='space-y-[20px]'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-[10px]'>
          <Skeleton className='h-[40px] w-[120px]' />
          <Skeleton className='h-[40px] w-[350px]' />
        </div>
        <div className='flex'>
          <Skeleton className='h-[78px] w-[480px]' />
        </div>
        <div>
          <Skeleton className='h-[40px] w-[260px]' />
        </div>
        <div>
          <Skeleton className='h-[40px] w-[480px]' />
        </div>
        <div>
          <Skeleton className='h-[40px] w-[260px]' />
        </div>
        <div className='flex gap-[10px]'>
          <Skeleton className='h-[40px] w-[260px]' />
          <Skeleton className='h-[40px] w-[260px]' />
        </div>
        <div className='flex gap-[10px]'>
          <Skeleton className='h-[40px] w-[260px]' />
          <Skeleton className='h-[40px] w-[86px]' />
        </div>
      </div>
    </div>
  );
};
