'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useToast } from '@/context/toast.context';

const ImageGallery = () => {
  const {addToast} = useToast();

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/file/list?type=image');
        if (response.ok) {
          const data = await response.json();
          setImages(data);

          addToast({
            type: 'success',
            message: 'Images fetched successfully',
            id: ''
          });
        } else {
          addToast({
            type: 'error',
            message: 'Error fetching images',
            id: ''
          });
        }
      } catch (error) {
        addToast({
          type: 'error',
          message: `Error fetching images: ${error}`,
          id: ''
        });
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div>
        {images.map((image) => (
          <Image
            key={image}
            src={image}
            alt={image}
            width={200}
            height={200}
            style={{ width: '100px', height: '100px', margin: '10px' }}
            priority
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
