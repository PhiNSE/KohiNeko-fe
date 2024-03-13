import Button from './Button';
import errorImage from '../assets/errorPage.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className='lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16'>
      <div className='xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0'>
        <div className='relative flex justify-center items-center'>
          <div className='absolute flex flex-col items-center'>
            <div>
              <h1 className='my-2 text-primary font-bold text-2xl'>
                Looks like you&apos;ve found the doorway to the great nothing
              </h1>

              <p className='my-2 text-secondary'>
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>

              {/* Button */}
              <div className='flex justify-center'>
                <Button
                  type='medium'
                  className='text-center'
                  onClick={() => navigate(-1)}
                >
                  Take me there
                </Button>
              </div>
            </div>
          </div>

          {/* Error Image */}
          <div>
            <img src='https://i.ibb.co/G9DC8S0/404-2.png' />
          </div>
        </div>
      </div>
      <div className='mr-5 opacity-50'>
        {' '}
        {/* ErrorCat image */}
        <img src={errorImage} />
      </div>
    </div>
  );
};

export default Error;
