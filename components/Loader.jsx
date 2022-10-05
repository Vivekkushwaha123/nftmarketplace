import React from 'react';
import Image from 'next/image';

import images from '../assests';

function Loader() {
  return (
    <div className="flexCenter w-full my-4">
      <Image src={images.creator1} alt="loader" width={100} objectFit="contain" />
    </div>
  );
}

export default Loader;
