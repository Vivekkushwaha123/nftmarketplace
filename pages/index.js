import { useEffect, useState, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Circles } from 'react-loader-spinner';
import { NFTContext } from '../context/NFTContext';
import { Banner, CreatorCard, NFTcard, SearchBar } from '../components';
import images from '../assests';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

function Home() {
  const { theme, setTheme } = useTheme();
  const [hideButton, setHideButton] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { fetchNFTs } = useContext(NFTContext);

  useEffect(() => {
    fetchNFTs()
      .then((items) => {
        setNfts(items);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButton(false);
    } else {
      setHideButton(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const topCreators = getCreators(nfts);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          banner="Discover ,collect, and sell extraordinary NFTs"
          childStyles="md:text-4xl sm:text-2xl xs=text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-nft-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0"> That&apos;s Weird ... No NFTS for Sale</h1>
        ) : isLoading ? (
          <Circles
            height="80"
            width="80"
            color="#EB1484"
            ariaLabel="circles-loading"
            visible
          />
        ) : (
          <>

            <div className="">
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Top Seller</h1>
              <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
                <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
                  {

                topCreators.map((creator, i) => (
                  <CreatorCard
                    key={creator.seller}
                    rank={i + 1}
                    creatorImage={images[`creator${i + 1}`]}
                    creatorName={shortenAddress(creator.seller)}
                    creatorETHs={creator.sum}

                  />
                ))
              }
                  {!hideButton && (
                  <>
                    <div
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                      onClick={() => handleScroll('left')}
                    >
                      <Image
                        src={images.leftCircle}
                        layout="fill"
                        objectFit="contain"
                        alt="leftArrow"
                        className={theme === 'light' && 'filter invert'}
                      />
                    </div>
                    <div
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                      onClick={() => handleScroll('Right')}
                    >
                      <Image
                        src={images.rightCircle}
                        layout="fill"
                        objectFit="contain"
                        alt="rightArrow"
                        className={theme === 'light' && 'filter invert'}
                      />
                    </div>
                  </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 ">Hot NFTs</h1>
                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />

                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start">
                {nfts.map((nft) => <NFTcard key={nft.tokenId} nft={nft} />)}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;
