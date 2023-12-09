import Link from "next/link";

const NavBar = () => {
  const links = [
    { href: '/chat', label: 'Chat' },
    { href: '/profile', label: 'Profile' },
    { href: 'accounts/login', label: 'Login' },
    { href: '/admin', label: 'Admin' },
  ];
  return (
    <nav className='bg-gray-100 p-6 w-full z-10 fixed h-20 text-black'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-3xl font-bold'>
          Caelium
        </Link>
        <div className='flex space-x-4'>
          {links.map((link, index) => (
            <Link key={index} href={link.href} className='navbar-link text-lg'>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
