'use client';
import { ReactNode, createContext, useState } from 'react';

interface NavContextProps {
  navLinks: NavLink[];
  setNavLinks: any;
  ctaButton: NavLink;
  setCtaButton: any;
}

const NavContext = createContext<NavContextProps>({
  navLinks: [],
  setNavLinks: () => {},
  ctaButton: { name: '', url: '#' },
  setCtaButton: () => {},
});
export default NavContext;

interface NavLink {
  name: string;
  url: string;
}

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [navLinks, setNavLinks] = useState<NavLink[]>([{ name: 'sample', url: 'sample' }]);
  const [ctaButton, setCtaButton] = useState<NavLink>({name: 'Get Started', url: '/get-started'});

  return <NavContext.Provider value={{ navLinks, setNavLinks, ctaButton, setCtaButton }}>{children}</NavContext.Provider>;
};
