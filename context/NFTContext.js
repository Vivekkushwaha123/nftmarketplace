import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressAbi } from './constants';

const projectId = '2F5AUNsvypEPVv8N2IogMLesA4V';
const projectSecret = 'e241698388d8d9a511f29946736c1f01';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider);

export const NFTContext = React.createContext();

export function NFTProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoadingNFT, setisLoadingNFTNFT] = useState(false);
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please Install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts?.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('no account found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please Install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://nftimage.infura-ipfs.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS', error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();
    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() }) : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setisLoadingNFTNFT(true);
    await transaction.wait();
  };

  const createNFT = async (fromInput, fileUrl, router) => {
    const { name, description, price } = fromInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://nftimage.infura-ipfs.io/ipfs/${added.path}`;
      await createSale(url, price);
      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS');
    }
  };

  const fetchNFTs = async () => {
    setisLoadingNFTNFT(false);

    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unFormattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unFormattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const FetchMyNftsOrListedNfts = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unFormattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unFormattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    setisLoadingNFTNFT(true);
    await transaction.wait();
    setisLoadingNFTNFT(false);
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, FetchMyNftsOrListedNfts, buyNFT, createSale, isLoadingNFT }}>
      {children}
    </NFTContext.Provider>
  );
}
