const NavBar = () => {
  const links = [
    { href: '/chat', label: 'Chat' },
    { href: '/profile', label: 'Profile' },
    { href: '/login', label: 'Login' },
    { href: '/admin', label: 'Admin' },
  ];
  return (
    <nav class='bg-slate-200'>
      <div class='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <a href='/' class='flex items-center space-x-3 rtl:space-x-reverse'>
          <span class='self-center text-2xl font-semibold whitespace-nowrap'>Caelium</span>
        </a>
        <div class='hidden w-full md:block md:w-auto' id='navbar-default'>
          <ul class='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 '>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.href} class='block py-2 px-3rounded md:bg-transparent md:p-0 hover:underline font-semibold'>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
