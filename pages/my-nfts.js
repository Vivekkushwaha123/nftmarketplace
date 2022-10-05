import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { Circles } from 'react-loader-spinner';

import { NFTContext } from '../context/NFTContext';
import { NFTcard, Banner, SearchBar } from '../components';
import images from '../assests';
import { shortenAddress } from '../utils/shortenAddress';

function MyNfts() {
  const { FetchMyNftsOrListedNfts, currentAccount } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    FetchMyNftsOrListedNfts()
      .then((items) => {
        setNfts(items);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];
    switch (activeSelect) {
      case 'Price (Low to High)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (High to Low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;

      case 'Recently Added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  if (isLoading) {
    return (
      <div className=" flexCenter my-4 min-h-screen w-full">
        <Circles
          height="80"
          width="80"
          color="#EB1484"
          ariaLabel="circles-loading"
          visible
        />
      </div>
    );
  }

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

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          banner="Your Nifty NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />

        <div className="flexCenter flex-col -mt-10 z-0">
          <div className="flexCenter w-30 h-30 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">

            <Image
              src={images.creator11}
              className="rounded-full"
              objectFit="cover"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
        </div>
      </div>
      {!isLoading && !nfts.length && !nftsCopy.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">No Nfts Owned</h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full sm:w-full flex flex-row sm:flex-col">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {nfts.map((nft) => <NFTcard key={nft.tokenId} nft={nft} ourNFTs />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNfts;
