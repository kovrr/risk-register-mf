import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/atoms/tabs';
import type React from 'react';
import type { FC } from 'react';

type Tab = {
  label: string;
  key: string;
  content: React.ReactNode;
};

type Props = {
  defaultTab: string;
  tabs: Tab[];
  testIdPrefix: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
  tabsClassName?: string;
};

export const MasGenericTabs: FC<Props> = ({
  defaultTab,
  tabs,
  testIdPrefix,
  tabsListClassName = 'flex justify-start gap-4 rounded-3xl bg-white pl-4',
  tabsContentClassName = 'p-4',
  tabsClassName = '',
}) => {
  return (
    <div className='flex h-full flex-col'>
      <Tabs
        defaultValue={defaultTab}
        className={`flex h-full flex-col ${tabsClassName}`}
      >
        <TabsList className={tabsListClassName}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.key}
              className='text-fill-base-secondary font-medium" rounded-none border-b-2 border-transparent px-1 font-semibold data-[state=active]:border-b-2 data-[state=active]:border-fill-brand-primary data-[state=active]:bg-transparent data-[state=active]:text-fill-brand-primary data-[state=active]:shadow-none'
              data-testid={`${testIdPrefix}-tab-${tab.key}`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.key}
            value={tab.key}
            className={tabsContentClassName}
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
