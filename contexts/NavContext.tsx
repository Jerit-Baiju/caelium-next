"use client"
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface NavLink {
  name: string;
  url: string;
}

interface NavbarContextData {
  ctaButton: NavLink;
  setCtaButton: Dispatch<SetStateAction<NavLink>>;
  navLinks: NavLink[];
  setNavLinks: Dispatch<SetStateAction<NavLink[]>>;
}

const NavbarContext = createContext<NavbarContextData | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

// Navbar Provider component
export const NavbarProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ctaButton, setCtaButton] = useState<NavLink>({ name: '', url: '' });
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);


  return <NavbarContext.Provider value={{ ctaButton, setCtaButton, navLinks, setNavLinks}}>{children}</NavbarContext.Provider>;
};
