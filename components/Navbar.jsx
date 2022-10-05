import { useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assests/index';
import { NFTContext } from '../context/NFTContext';
import Button from './Button';

function MenuItems({ isMobile, active, setActive, setIsOpen }) {
  const generateLinks = (i) => {
    switch (i) {
      case 0: return '/';
      case 1: return '/listed-nfts';
      case 2: return '/my-nfts';
      default: return '/';
    }
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item);
            if (isMobile) setIsOpen(false);
          }}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
        >
          <Link href={generateLinks(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
}

function ButtonGroup({ setActive, router, setIsOpen }) {
  const { connectWallet, currentAccount } = useContext(NFTContext);
  return currentAccount ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive('');
        setIsOpen(false);
        router.push('/create-nft');
      }}
    />
  ) : <Button btnName="Connect" classStyles="mx-2 rounded-xl" handleClick={connectWallet} />;
}

const checkActive = (active, setActive, router) => {
  switch (router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') { setActive('Explore'); }
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') { setActive('Listed NFTs'); }
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') { setActive('My NFTs'); }
      break;
    case '/create-nfts':
      setActive('');
      break;

    default:
      setActive('');
      break;
  }
};

function Navbar() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('Explore NFTs');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTheme('Dark');
  }, []);

  useEffect(() => {
    checkActive(active, setActive, router);
  }, [router.pathname]);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b bg-white dark:bg-nft-dark dark:border-nft-black-1 border-nft-gray-1 ">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => {
              setActive('Explore NFTs');
              setIsOpen(false);
            }}
          >
            <Image src={images.logo} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">CryptoKet</p>
          </div>
        </Link>
        <Link href="/">
          <div
            className="hidden md:flex"
            onClick={() => {
              setActive('Explore NFTs');
              setIsOpen(false);
            }}
          >
            <Image src={images.logo} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      <div className="flex justify-end flex-initial flex-row">
        {/* <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 p-1 bg-black rounded-2xl relative label"
          >
            <div className="fas fa-sun" />
            <div className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div> */}

        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
          </div>
        </div>

      </div>

      <div className="hidden md:flex ml-2 ">
        {!isOpen ? (
          <Image
            src={images.menu}
            objectFit="contain"
            height={25}
            width={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === 'dark' ? 'filter invert' : ' '}
          />
        ) : (
          <Image
            src={images.darkCross}
            objectFit="contain"
            height={25}
            width={25}
            alt="cross"
            onClick={() => setIsOpen(false)}
            className={theme === 'dark' ? 'filter invert' : ' '}
          />
        )}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-black bg-white  z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile setIsOpen={setIsOpen} />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
