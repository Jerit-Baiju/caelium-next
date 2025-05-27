'use client';
import { DropDown, NavLink } from '@/helpers/props';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { IconType } from 'react-icons';
import { FiClock, FiCloud, FiFile, FiHardDrive, FiHome, FiImage, FiSettings, FiShare2, FiStar, FiTrash } from 'react-icons/fi';

// Define interface for sidebar option items
interface SidebarOption {
  name: string;
  url: string;
  icon: IconType;
}

// Define interface for sidebar sections (used in cloud sidebar)
interface SidebarSection {
  section: string;
  items: SidebarOption[];
}

// Update the context interface to use proper types
interface NavbarContextData {
  ctaButton: NavLink | null;
  setCtaButton: Dispatch<SetStateAction<NavLink | null>>;
  navLinks: NavLink[] | null;
  setNavLinks: Dispatch<SetStateAction<NavLink[] | null>>;
  dropDown: DropDown | null;
  setDropDown: Dispatch<SetStateAction<DropDown | null>>;
  defaultCtaButton: NavLink | null;
  viewSM: boolean;
  setViewSM: Dispatch<SetStateAction<boolean>>;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  resetToDefaultNav: () => void;
  setCloudNav: () => void;
  sidebarOptions: SidebarOption[] | SidebarSection[];
  setSidebarOptions: Dispatch<SetStateAction<SidebarOption[] | SidebarSection[]>>;
  resetToDefaultSidebar: () => void;
  setCloudSidebar: () => void;
}

const NavbarContext = createContext<NavbarContextData | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

const defaultNavLinks: NavLink[] = [
  { name: 'Cloud', url: '/cloud' },
  { name: 'Write', url: '/crafts/create' },
  { name: 'Settings', url: '#' },
];

const cloudNavLinks: NavLink[] = [
  { name: 'Files', url: '/cloud/files' },
  { name: 'Photos', url: '/cloud/photos' },
  { name: 'Recent', url: '/cloud/recent' },
  { name: 'Shared', url: '/cloud/shared' },
];

const cloudDropdown: DropDown = {
  name: 'New',
  options: [
    { name: 'Upload File', url: '/cloud/upload' },
    { name: 'Create Folder', url: '/cloud/create-folder' },
    { name: 'Import', url: '/cloud/import' },
  ],
};

const createDropdown: DropDown = {
  name: 'Create',
  options: [
    { name: 'Event', url: '/calendar/create' },
    { name: 'ToDo', url: '/todo' },
  ],
};

const defaultCtaButton: NavLink = { name: 'Get Started', url: '/get-started' };
const cloudCtaButton: NavLink = { name: 'Upgrade Storage', url: '/cloud/upgrade' };

export const defaultSidebarOptions: SidebarOption[] = [
  { name: 'Home', url: '/', icon: FiHome },
  { name: 'Gallery', url: '/cloud/gallery', icon: FiImage },
  { name: 'Cloud', url: '/cloud', icon: FiCloud },
  { name: 'Settings', url: '/settings', icon: FiSettings },
];

export const cloudSidebarOptions: SidebarSection[] = [
  { 
    section: 'CLOUD STORAGE',
    items: [
      { name: 'My Drive', url: '/cloud', icon: FiHardDrive },
      { name: 'Files', url: '/cloud/files', icon: FiFile },
      { name: 'Gallery', url: '/cloud/gallery', icon: FiImage },
      { name: 'Recent', url: '/cloud/recent', icon: FiClock },
      { name: 'Starred', url: '/cloud/starred', icon: FiStar },
      { name: 'Shared', url: '/cloud/shared', icon: FiShare2 },
      { name: 'Trash', url: '/cloud/trash', icon: FiTrash },
    ]
  },
  {
    section: 'STORAGE',
    items: [
      { name: 'Storage Usage', url: '/cloud/storage', icon: FiHardDrive },
      { name: 'Upgrade Plan', url: '/cloud/upgrade', icon: FiSettings },
    ]
  }
];

export const NavbarProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ctaButton, setCtaButton] = useState<NavLink | null>(defaultCtaButton);
  const [navLinks, setNavLinks] = useState<NavLink[] | null>(defaultNavLinks);
  const [dropDown, setDropDown] = useState<DropDown | null>(createDropdown);
  const [viewSM, setViewSM] = useState<boolean>(true);
  const [showNav, setShowNav] = useState<boolean>(true);
  const [sidebarOptions, setSidebarOptions] = useState<SidebarOption[] | SidebarSection[]>(defaultSidebarOptions);
  
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

  const resetToDefaultSidebar = () => {
    setSidebarOptions(defaultSidebarOptions);
  };

  const setCloudSidebar = () => {
    setSidebarOptions(cloudSidebarOptions);
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
        sidebarOptions,
        setSidebarOptions,
        resetToDefaultSidebar,
        setCloudSidebar,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
