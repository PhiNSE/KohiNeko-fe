const Content = ({ content, header }) => {
  return (
    <div>
      <h1 className='font-bold'>{header}</h1>
      <p className='text-xl'>{content}</p>
    </div>
  );
};

export default Content;
