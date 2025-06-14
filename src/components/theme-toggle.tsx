'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className='flex flex-col space-y-2'>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger id='theme-select' className='w-[180px]'>
          <SelectValue placeholder='Select theme' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='system'>
            <div className='flex items-center gap-2'>
              <MonitorIcon className='h-4 w-4' />
              <span>System</span>
            </div>
          </SelectItem>
          <SelectItem value='light'>
            <div className='flex items-center gap-2'>
              <SunIcon className='h-4 w-4' />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value='dark'>
            <div className='flex items-center gap-2'>
              <MoonIcon className='h-4 w-4' />
              <span>Dark</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
