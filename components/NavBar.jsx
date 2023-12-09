import Link from "next/link";

const NavBar = () => {
  const links = [
    { href: '/chat', label: 'Chat' },
    { href: '/profile', label: 'Profile' },
    { href: 'accounts/login', label: 'Login' },
    { href: '/admin', label: 'Admin' },
  ];
  return (
    <nav className='bg-blue-500 text-white p-6 w-full z-10 fixed'>
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
