import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
import emptyImg from "../assets/EmptyImg.jpg";

const LazyLoadImage = ({ src, classNameProps }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
  }, [src]);

  // return (
  //   <>
  //     {!imageLoaded && (
  //       <div
  //         className={`w-full h-full object-cover relative ${
  //           imageLoaded ? 'none' : 'inline'
  //         }`}
  //       >
  //         <Blurhash
  //           hash='LEHV6nWB2yk8pyo0adR*.7kCMdnj'
  //           width='100%'
  //           height='100%'
  //           resolutionX={32}
  //           resolutionY={32}
  //           punch={1}
  //         />
  //       </div>
  //     )}
  //     {imageLoaded && (
  //       <img
  //         src={src}
  //         alt=''
  //         className={`w-full h-full object-cover relative transition-opacity duration-6000 ease-in-out ${
  //           imageLoaded ? 'opacity-100' : 'opacity-0'
  //         } ${!imageLoaded ? 'none' : 'inline'} ${classNameProps}`}
  //       />
  //     )}
  //   </>
  // );
  return (
    // <div
    //   className={`w-full h-full relative overflow-hidden rounded-full ${classNameProps}`}
    // >
    //   {!imageLoaded && (
    //     <div className={`w-full h-full absolute top-0 left-0`}>
    //       <Blurhash
    //         hash='LEHV6nWB2yk8pyo0adR*.7kCMdnj'
    //         width='100%'
    //         height='100%'
    //         resolutionX={32}
    //         resolutionY={32}
    //         punch={1}
    //       />
    //     </div>
    //   )}
    //   {imageLoaded && (
    //     <img
    //       src={src || emptyImg}
    //       alt=''
    //       className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-6000 ease-in-out ${
    //         imageLoaded ? 'opacity-100' : 'opacity-0'
    //       }`}
    //     />
    //   )}
    // </div>
    <div
      className={`w-full h-full relative overflow-hidden A${classNameProps}`}
    >
      {src ? (
        <>
          {!imageLoaded && (
            <div className={`w-full h-full absolute top-0 left-0`}>
              <Blurhash
                hash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                width="100%"
                height="100%"
                resolutionX={32}
                resolutionY={32}
                punch={1}
              />
            </div>
          )}
          {imageLoaded && (
            <img
              src={src}
              alt=""
              className={
                `w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-6000 ease-in-out ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }` + ` ${classNameProps}`
              }
            />
          )}
        </>
      ) : (
        <img
          src={emptyImg}
          alt=""
          className={`w-full h-full object-cover absolute top-0 left-0`}
        />
      )}
    </div>
  );
};

export default LazyLoadImage;
