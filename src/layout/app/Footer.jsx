import Logo from '../../assets/logo2.png';
import { HiMail, HiMap, HiPhone } from 'react-icons/hi';
import {
  FaFacebook,
  FaInstagram,
  FaTripadvisor,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Background image */}
      <div className='bg-footer bg-center bg-no-repeat relative bg-cover h-[30vh] md:h-[35vh] 2xl:h-[50vh]'>
        <div className='bg-footer-layer'></div>
        <div className='absolute z-10 text-primary mt-10 flex   justify-around  w-full items-center md:top-[5%] 2xl:top-[25%]  m-auto '>
          {/* Shop info */}
          <div className='hidden md:block'>
            <h1 className='font-bold'>The Cat Café</h1>
            {/* Contact  */}
            <div className='grid gap-1'>
              <div>
                <HiPhone className=' inline-block mr-4' size='1.5rem' />
                <span>01662255761</span>
              </div>
              <div className=''>
                <HiMap className=' inline-block mr-4' size='1.5rem' />
                <span>
                  <br />
                  302 Island Avenue San Diego, CA 92101
                </span>
              </div>
              <div>
                <HiMail className=' inline-block mr-4' size='1.5rem' />
                executive.support@manutd.co.uk
              </div>
            </div>
          </div>

          {/* Website */}
          <div>
            <Link to='/'>
              <img src={Logo} className='h-[9rem] w-auto ml-9' />
            </Link>
            <div className='text-secondary text-xl md:text-3xl flex flex-row gap-3  mt-3'>
              <a
                href='hAAttps://www.facebook.com/thecatcafesandiego'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-links'
              >
                <FaFacebook />
              </a>
              <a
                href='https://www.instagram.com/thecatcafesandiego/'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-links'
              >
                <FaInstagram />
              </a>
              <a
                href='https://twitter.com/catcafesandiego'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-links'
              >
                <FaXTwitter />
              </a>
              <a
                href='https://www.tripadvisor.com/Restaurant_Review-g60750-d7900898-Reviews-The_Cat_Cafe-San_Diego_California.html'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-links'
              >
                {' '}
                <FaTripadvisor />
              </a>
              <a
                href='https://www.youtube.com/user/thecatcafesandiego'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-links'
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick linik */}
          <div className='text-right'>
            <h1 className='font-bold'>Quick Links</h1>
            <div className=' flex flex-col'>
              <Link className='footer-nAavlinks' to='/'>
                Home
              </Link>

              <Link className='footer-navlinks' to='/about'>
                About us
              </Link>
              <Link className='footer-navlinks' to='/coffeeShops'>
                Our Shops
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gray-700 text-gray-300 text-center py-2.5 font-semibold'>
        &copy;
        <span>2024 Kohi-Neko. All Rights Reserved.</span>
      </div>
    </>
  );
};

export default Footer;
