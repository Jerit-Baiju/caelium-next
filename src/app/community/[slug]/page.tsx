'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEyeOff, FiHeart, FiMessageCircle, FiPlus, FiSearch, FiUsers, FiVideo } from 'react-icons/fi';

interface Confession {
  id: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  reactions: string[];
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  year: string;
  isOnline: boolean;
}

const CommunityHomePage = () => {
  const params = useParams();
  const router = useRouter();
  const communitySlug = params.slug as string;

  // State management
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const communityName = communitySlug.charAt(0).toUpperCase() + communitySlug.slice(1).replace('-', ' ');

  const [confessions, setConfessions] = useState<Confession[]>([
    {
      id: '1',
      content: 'anyone else lowkey stressed about finals but also kinda excited for summer break? 😅✨',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      comments: 8,
      isLiked: false,
      reactions: ['😭', '✨', '💯'],
    },
    {
      id: '2',
      content: "found the perfect study spot in the library today and I'm gatekeeping it sorry not sorry 📚",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 41,
      comments: 15,
      isLiked: true,
      reactions: ['📚', '👀', '🤫'],
    },
    {
      id: '3',
      content: 'the dining hall actually served something decent today?? what timeline are we in',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 67,
      comments: 23,
      isLiked: false,
      reactions: ['🍕', '😱', '👏'],
    },
  ]);

  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      year: 'senior',
      isOnline: true,
    },
    {
      id: '2',
      name: 'sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2a3d06a?w=150&h=150&fit=crop&crop=face',
      year: 'junior',
      isOnline: true,
    },
    {
      id: '3',
      name: 'mike',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      year: 'sophomore',
      isOnline: false,
    },
    {
      id: '4',
      name: 'emily',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      year: 'senior',
      isOnline: true,
    },
  ]);

  const handleLike = (confessionId: string) => {
    setConfessions((prev) =>
      prev.map((confession) =>
        confession.id === confessionId
          ? {
              ...confession,
              likes: confession.isLiked ? confession.likes - 1 : confession.likes + 1,
              isLiked: !confession.isLiked,
            }
          : confession
      )
    );
  };

  const filteredConfessions = confessions.filter((confession) => confession.content.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.year.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = members.filter((m) => m.isOnline).length;

  return (
    <main className='bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100'>
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Header */}
        <header className='mb-8'>
          <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100'>{communityName}</h1>
              <div className='flex items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <FiUsers />
                  <span>{members.length} members</span>
                </div>
                <div className='flex items-center gap-2 text-green-500'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>{onlineMembers} online</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' className='w-full sm:w-auto'>
                <FiPlus className='mr-2 h-4 w-4' />
                Share a thought
              </Button>
              <Button onClick={() => router.push('/chats/anon/video')} className='w-full sm:w-auto'>
                <FiVideo className='mr-2 h-4 w-4' />
                Video Chat
              </Button>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main content */}
          <div className='lg:col-span-2'>
            {/* Tabs */}
            <div className='mb-6 border-b border-neutral-200 dark:border-neutral-800'>
              <nav className='flex gap-6'>
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`py-2 px-1 font-semibold text-sm transition-colors ${
                    activeTab === 'feed'
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}>
                  Feed
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-2 px-1 font-semibold text-sm transition-colors ${
                    activeTab === 'members'
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}>
                  People
                </button>
              </nav>
            </div>

            {/* Search */}
            <div className='relative mb-6'>
              <FiSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400' />
              <Input
                placeholder={activeTab === 'feed' ? 'Search feed...' : 'Search members...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 w-full bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
              />
            </div>

            {/* Content */}
            <div>
              {activeTab === 'feed' && (
                <div className='space-y-4'>
                  {filteredConfessions.map((confession) => (
                    <Card
                      key={confession.id}
                      className='bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-300'>
                      <CardContent className='p-5'>
                        <div className='flex gap-4'>
                          <div className='w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center'>
                            <FiEyeOff className='w-5 h-5 text-neutral-500' />
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between'>
                              <div className='text-sm text-neutral-500 dark:text-neutral-400'>
                                <span>anonymous soul</span>
                                <span className='mx-2'>·</span>
                                <span>{confession.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <p className='my-2 text-neutral-800 dark:text-neutral-200'>{confession.content}</p>
                            <div className='flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'>
                              <button
                                onClick={() => handleLike(confession.id)}
                                className={`flex items-center gap-1.5 group transition-colors ${
                                  confession.isLiked ? 'text-red-500' : 'hover:text-red-500'
                                }`}>
                                <FiHeart className={`w-4 h-4 ${confession.isLiked ? 'fill-current' : ''}`} />
                                <span>{confession.likes}</span>
                              </button>
                              <button className='flex items-center gap-1.5 hover:text-blue-500 transition-colors'>
                                <FiMessageCircle className='w-4 h-4' />
                                <span>{confession.comments}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'members' && (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {filteredMembers.map((member) => (
                    <Card
                      key={member.id}
                      className='bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-300'>
                      <CardContent className='p-4'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className='w-12 h-12 rounded-full object-cover'
                            />
                            {member.isOnline && (
                              <div className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900'></div>
                            )}
                          </div>
                          <div>
                            <h3 className='font-semibold text-neutral-800 dark:text-neutral-100 capitalize'>{member.name}</h3>
                            <p className='text-sm text-neutral-500 dark:text-neutral-400 capitalize'>{member.year}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className='space-y-6'>
            <Card className='bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center'>
                    <FiVideo className='w-6 h-6 text-violet-600 dark:text-violet-400' />
                  </div>
                  <div>
                    <h3 className='font-bold text-lg text-neutral-800 dark:text-neutral-100'>Random Chat</h3>
                  </div>
                </div>
                <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-4'>
                  Connect with someone new and share authentic moments together.
                </p>
                <Button className='w-full' onClick={() => router.push('/chats/anon/video')}>
                  Start Vibing
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CommunityHomePage;
