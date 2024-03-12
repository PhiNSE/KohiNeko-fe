import Card from '../../components/Card';
import { Outlet, useLocation } from 'react-router-dom';
import HomeDefine from '../../assets/about/AboutDefinition.jpg';
import ChildPolicy from '../../assets/about/AboutChildPolicy.jpg';
import HowItWorks from '../../assets/about/AboutHowItWork.jpg';
import CatBenefits from '../../assets/homepage-3.jpg';
import PageTransition from '../PageTransition';

const About = () => {
  const location = useLocation();
  return (
    <PageTransition>
      {location.pathname === '/about' && (
        <>
          <h1 className='text-center text-3xl font-bold mt-5 text-primary'>
            Frequently Asked Questions{' '}
          </h1>
          <div className='mt-5 grid grid-cols-4 gap-4 px-3'>
            <Card
              role='about'
              image={HomeDefine}
              header='What’s a Cat Cafe?'
              content='Find out the origin of The Cat Cafe and how It went through all around the world'
              to='/about/origin'
            ></Card>
            <Card
              role='about'
              image={ChildPolicy}
              header='Child Policy'
              content='Most cat cafes do not allow children to visit. In order to continue this, we need help from parents.'
              to='/about/policy'
            ></Card>
            <Card
              role='about'
              image={HowItWorks}
              header='How It Works'
              content='Customers can enjoy a cup of coffee while interacting with our resident cats. Our cats are friendly and well-cared.'
              to='/about/howitworks'
            ></Card>
            <Card
              role='about'
              image={CatBenefits}
              header='Benefits to Cats'
              content='There are many benefits to the feline residents of cat cafes. Learn more about how cat cafes help cats.'
              to='/about/benefits'
            ></Card>
          </div>
        </>
      )}
      <Outlet />
    </PageTransition>
  );
};

export default About;
