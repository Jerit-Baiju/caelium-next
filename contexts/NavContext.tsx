'use client';
import { DropDown, NavLink } from '@/helpers/props';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface NavbarContextData {
  ctaButton: NavLink | null;
  setCtaButton: Dispatch<SetStateAction<NavLink | null>>;
  navLinks: NavLink[] | null;
  setNavLinks: Dispatch<SetStateAction<NavLink[] | null>>;
  dropDown: { name: string; options: NavLink[] } | null;
  setDropDown: Dispatch<SetStateAction<{ name: string; options: NavLink[] } | null>>;
  defaultCtaButton: NavLink | null;
  viewSM: boolean;
  setViewSM: Dispatch<SetStateAction<boolean>>;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  resetToDefaultNav: () => void;
  setCloudNav: () => void;
}

const NavbarContext = createContext<NavbarContextData | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

let defaultNavLinks: NavLink[] = [
  { name: 'Cloud', url: '/cloud' },
  { name: 'Write', url: '/crafts/create' },
  { name: 'Settings', url: '#' },
];

let cloudNavLinks: NavLink[] = [
  { name: 'Files', url: '/cloud/files' },
  { name: 'Photos', url: '/cloud/photos' },
  { name: 'Recent', url: '/cloud/recent' },
  { name: 'Shared', url: '/cloud/shared' },
];

let cloudDropdown: DropDown = {
  name: 'New',
  options: [
    { name: 'Upload File', url: '/cloud/upload' },
    { name: 'Create Folder', url: '/cloud/create-folder' },
    { name: 'Import', url: '/cloud/import' },
  ],
};

let createDropdown: DropDown = {
  name: 'Create',
  options: [
    { name: 'Event', url: '/calendar/create' },
    { name: 'ToDo', url: '/todo' },
  ],
};

let defaultCtaButton: NavLink = { name: 'Get Started', url: '/get-started' };
let cloudCtaButton: NavLink = { name: 'Upgrade Storage', url: '/cloud/upgrade' };

export const NavbarProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ctaButton, setCtaButton] = useState<NavLink | null>(defaultCtaButton);
  const [navLinks, setNavLinks] = useState<NavLink[] | null>(defaultNavLinks);
  const [dropDown, setDropDown] = useState<DropDown | null>(createDropdown);
  const [viewSM, setViewSM] = useState<boolean>(true);
  const [showNav, setShowNav] = useState<boolean>(true);
  
  const resetToDefaultNav = () => {
    setNavLinks(defaultNavLinks);
    setDropDown(createDropdown);
    setCtaButton(defaultCtaButton);
  };
  
  const setCloudNav = () => {
    setNavLinks(cloudNavLinks);
    setDropDown(cloudDropdown);
    setCtaButton(cloudCtaButton);
  };
  
  return (
    <NavbarContext.Provider
      value={{
        ctaButton,
        setCtaButton,
        navLinks,
        setNavLinks,
        dropDown,
        setDropDown,
        defaultCtaButton,
        viewSM,
        setViewSM,
        showNav,
        setShowNav,
        resetToDefaultNav,
        setCloudNav,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
