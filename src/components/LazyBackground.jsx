import { useEffect, useState } from 'react';
import { Blurhash } from 'react-blurhash';

const LazyBackground = ({ className, src, hash }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
  }, [src]);

  const style = imageLoaded ? { backgroundImage: `url(${src})` } : {};

  return (
    <div className={className} style={style}>
      <div
        style={{
          position: 'absolute',
          zIndex: imageLoaded ? -1 : 1,
          width: '100%',
          height: '100%',
        }}
      >
        <Blurhash
          hash='LEHV6nWB2yk8pyo0adR*.7kCMdnj'
          width='100%'
          height='100%'
        />
      </div>
    </div>
  );
};

export default LazyBackground;
