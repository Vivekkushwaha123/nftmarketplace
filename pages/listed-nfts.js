import { useState, useEffect, useContext } from 'react';
// import Loader from 'react-js-loader';
import { Circles } from 'react-loader-spinner';
import { NFTContext } from '../context/NFTContext';
import { NFTcard } from '../components';

const listedNFTs = () => {
  const { FetchMyNftsOrListedNfts } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    FetchMyNftsOrListedNfts('fetchItemsListed')
      .then((items) => {
        setNfts(items);
        setIsLoading(false);
      });
  }, []);

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

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen ">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
          NO nfts Listed
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minwd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">
            NFTs Listed for sale
          </h2>
        </div>
        <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
          {nfts.map((nft) => (
            <NFTcard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default listedNFTs;
