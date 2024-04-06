import React, { createContext, ReactNode, useState } from 'react';

interface NavContextProps {
  buttons: ButtonInfo[] | null;
  ctaButton: ButtonInfo | null;
  setButtons: React.Dispatch<React.SetStateAction<ButtonInfo[] | null>>;
  setCtaButton: React.Dispatch<React.SetStateAction<ButtonInfo | null>>;
}

interface ButtonInfo {
  name: string;
  url: string;
}

const NavContext = createContext<NavContextProps>({
  buttons: null,
  ctaButton: null,
  setButtons: async () => {},
  setCtaButton: async () => {},
});
export default NavContext;

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [buttons, setButtons] = useState<ButtonInfo[] | null>([]);
  const [ctaButton, setCtaButton] = useState<ButtonInfo | null>(null);
  return <NavContext.Provider value={{ buttons, ctaButton, setButtons, setCtaButton }}>{children}</NavContext.Provider>;
};
