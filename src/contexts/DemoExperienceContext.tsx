import React from 'react';

interface ModalTitle {
  title: string;
}

interface ContextProps {
  showDemoModal: (modalContents: ModalTitle) => void;
}

export const DemoExperienceContext = React.createContext<ContextProps>({
  showDemoModal: () => null,
});

export const DemoExperienceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showDemoModal = ({ title }: ModalTitle) => {
    // Option 1: No-op for microfrontend (disable demo restrictions)
    // Option 2: Show simple alert
    // Option 3: Implement proper modal later
    console.log('Demo modal:', title);
  };

  return (
    <DemoExperienceContext.Provider value={{ showDemoModal }}>
      {children}
    </DemoExperienceContext.Provider>
  );
};
