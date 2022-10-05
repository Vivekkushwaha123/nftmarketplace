import { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';

import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import Button from '../components/Button';
import images from '../assests';
import Input from '../components/Input';
import { NFTContext } from '../context/NFTContext';

function CreatedNFTs() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const router = useRouter();
  const { uploadToIPFS, createNFT } = useContext(NFTContext);

  const onDrop = useCallback(
    async (acceptedFile) => {
      const url = await uploadToIPFS(acceptedFile[0]);
      setFileUrl(url);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyles = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed 
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div>
      <div className="flex justify-center sm:px-4 p-12">
        <div className="w-3/5 md:w-full">
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 ">Create new NFT</h1>
          <div className="mt-16">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold">Upload File</p>
            <div className="mt-4">
              <div {...getRootProps()} className={fileStyles}>
                <input {...getInputProps()} />
                <div className="flexCenter flex-col text-center">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold">
                    JPG, PNG, SVG, WEBM, Max 100mb
                  </p>
                  <div className="my-12 w-full flex justify-center test">
                    <Image
                      src={images.upload}
                      width={100}
                      height={100}
                      objectFit="contain"
                      alt="file upload"
                      className={theme === 'light' && 'invert'}
                    />
                  </div>
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold">
                    Drag and Drop Files
                  </p>
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold">
                    Browse Media On device
                  </p>
                </div>
              </div>
              {fileUrl && (
                <aside>
                  <div>
                    <img src={fileUrl} alt="assest_file" />
                  </div>
                </aside>
              )}
            </div>
          </div>
          <Input
            inputType="input"
            title="Name"
            placeholder="Item Name"
            handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
          />
          <Input
            inputType="textarea"
            title="Description"
            placeholder="Description of your items"
            handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
          />
          <Input
            inputType="number"
            title="Price"
            placeholder="NFT price"
            handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
          />
          <div className="mt-7 w-full flex justify-end">
            <Button
              btnName="Create NFT"
              classStyles="rounded-xl"
              handleClick={() => createNFT(formInput, fileUrl, router)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatedNFTs;