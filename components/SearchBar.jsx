import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import images from '../assests/index';

function SearchBar({ activeSelect, setActiveSelect, handleSearch, clearSearch }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [toggle, setToggle] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 1000);
    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      clearSearch();
    }
  }, [search]);

  return (
    <>
      <div className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-gray-2 border-nft-gray-2 py-3 px-4 rounded-md">
        <Image src={images.search} objectFit="contain" width={20} height={20} alt="search" className={theme == 'light' ? 'filter invert' : ''} />
        <input
          type="text"
          className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none"
          placeholder="Search NFT here..."
          onChange={(e) => setDebouncedSearch(e.target.value)}
        />
      </div>
      <div className="relative flexBetween ml-4 sm:ml-0 sm:mt-2  min-w-190 cursor-pointer  dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-1 px-4 rounded-md py-3" onClick={() => setToggle((prevToggle) => !prevToggle)}>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs">Recently Listed</p>
        <Image
          src={images.dropArrow}
          objectFit="contain"
          width={15}
          height={15}
          alt="arrow"
          className={theme === 'light' ? 'filter invert' : ''}
        />
        {toggle && (
        <div className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 px-3 rounded-md">
          {['Recently Added', 'Price (Low to High)', 'Price (High to Low)'].map((item) => (
            <p
              className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer"
              onClick={() => setActiveSelect(item)}
              key={item}
            >{item}
            </p>
          ))}
        </div>
        )}
      </div>
    </>

  );
}

export default SearchBar;
