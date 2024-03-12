const AboutDetails = ({
  backgroundImg,
  header,
  children,
  objectPosition = 'center',
}) => {
  return (
    <div className='mb-10'>
      <div
        style={{ backgroundPosition: objectPosition }}
        className={`${backgroundImg} bg-cover w-full h-[70vh] md:h-[50vh] xl:h-[30vh] relative opacity-85  `}
      >
        <div className='bg-footer-layer'></div>
        <div className='absolute top-[40%] md:left-[30%] 2xl:left-[40%]'>
          <h1 className='font-bold text-white text-5xl'>{header}</h1>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AboutDetails;
