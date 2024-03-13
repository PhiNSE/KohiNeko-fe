import Button from '../../components/Button';
import PageTransition from '../PageTransition';
import { Carousel } from 'flowbite-react';
import hompage2 from '../../assets/homepage-2.png';
import homepage3 from '../../assets/homepage-3.jpg';
import cartPng from '../../assets/catPngHome.png';
import Card from '../../components/Card';
import catTest from '../../assets/catTest2.jpg';
import coffeeShop from '../../assets/coffeeShop.jpg';
import bookingTest from '../../assets/bookingTest.jpg';
import CommentCard from '../../components/CommentCard';

const Home = () => {
  return (
    <PageTransition>
      {/* Section 1 */}
      <div>
        <div className='bg-home bg-cover w-full h-[50vh] md:h-[70vh]  bg-bottom relative opacity-85'>
          <div className='bg-footer-layer'></div>
        </div>
        <div className='absolute top-[30%] flex flex-col gap-10 items-center justify-center w-full text-secondary'>
          <h1 className='font-bold'>Kohi Neko</h1>
          <h2 className='font-semibold text-center'>
            The Cat platform for coffee lovers
          </h2>
          <div className='w-44  '>
            <Button type='medium' to={'/coffeeShops'}>
              Make a reservation
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className='mt-5 px-3 flex flex-col items-center gap-3'>
        <h1 className='font-bold text-left'>
          Enjoy Award-Winning Locally Roasted Coffee in the Company of Cats!
        </h1>
        <span>
          The Cat Café provides you with a chance to relax and enjoy purr
          therapy in the heart of downtown San Diego.
        </span>
        <img src={hompage2} className='h-12 mb-10' />

        {/* Card */}
        <div className='grid grid-cols-2 gap-14'>
          <Card
            image={coffeeShop}
            header='Explore all of our shops'
            content='Discover a variety of unique coffee shops we have to offer. Each shop has its own distinctive atmosphere and charm, offering a diverse range of locally roasted coffee. Explore our shops to find your perfect cup of coffee, enjoy the cozy ambiance, and maybe even make a new feline friend.'
            to={'/coffeeShops'}
            role='about'
          />
          <Card
            image={bookingTest}
            header='About us'
            content='We are a unique coffee shop known for our award-winning locally roasted coffee. Our distinctive atmosphere includes the company of some of the friendliest felines, making us a favorite spot for both coffee lovers and cat enthusiasts.'
            to={'/about'}
            role='about'
          />
        </div>
      </div>

      {/* Section 3 */}
      {/* background */}
      <h1 className='text-3xl font-bold text-center mb-5'>
        Welcome to the Cat Café
      </h1>
      <div className='flex flex-row gap-5 justify-center'>
        <img src={cartPng} className='w-48 h-48 hidden md:block' />
        <img src={cartPng} className='w-48 h-48 hidden md:block' />
        <img src={cartPng} className='w-48 h-48 ' />
      </div>
      <div className='bg-home-coffee bg-cover w-full h-[70vh] md:h-[50vh] xl:h-[70vh]  bg-bottom relative opacity-85 mb-10 '>
        <div className='bg-footer-layer'></div>
        <div className='absolute bg-orange-50 rounded-lg w-full md:w-[24rem] h-[23.5rem] md:h-[23rem] top-14 xl:top-10 left-0 md:left-[25%] xl:left-[38%] 2xl:left-[38%] px-3'>
          <h1 className='font-bold text-center'>About The Cat Café</h1>
          <p>
            Operating since January 2015, The Cat Café is the fourth oldest
            continuously operating kitty café in the United States. Our menu
            features award-winning espresso and coffee from Café Virtuoso,
            pastries from Bread & Cie, cookies from The Cravory, and sandwiches
            from Sunshine & Orange.
          </p>
          <p>
            The cats are available for adoption, should you fall in love during
            your visit. These furry friends are from The Rescue House, a
            non-profit organization dedicated to helping homeless kitties find
            loving homes.
          </p>
          <Button type='large' levelType='secondary' to='/about/origin'>
            Learn more
          </Button>
        </div>
      </div>

      {/* Section 4 */}
      <h1 className='text-3xl font-bold text-center mb-5'>
        What People Are Purring About at The Cat Café
      </h1>
      <div className='grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 md:gap-5 justify-items-center items-center '>
        <CommentCard
          title="Two of Life's Joys"
          star={5}
          content='I cannot give this place enough praise! Such a great place to go and
        have great coffee and play with the cutest cats. Such a good idea, the
        cats can be adopted too. This place is truly amazing. Will definitely
        return again.'
          author='– Susie S. on TripAdvisor'
        />
        <CommentCard
          title='A Must for Cat Lovers'
          star={5}
          content='This was the most relaxing part of my vacation. The cats were very chill and social. I wanted to bring them all home! The coffee and employees were awesome.'
          author='– Susie S. on TripAdvisor'
        />
        <CommentCard
          title='Fun Day Trip'
          star={4}
          content='Love the giant cat mural painted on the building, perfect for photo ops! Get a coffee or cold drink and enjoy the company of cats that are available for adoption. These furry creatures are friendly and sweet. I fell in love with Leo. This is my happy place to go to when we are in San Diego.'
          author='– Susie S. on TripAdvisor'
        />
        <CommentCard
          title='Great Service and Great Cats!'
          star={5}
          content='A perfect place for some kitten cuddles and coffee drinks. The coffee is great, but the cat room is the star for sure! Great staff too. Go cuddle some kittens, you will not regret it.'
          author='– Susie S. on TripAdvisor'
        />
        <CommentCard
          title='Worth the Visit'
          star={5}
          content='We really enjoyed our visit to the Cat Cafe! The place is nicely decorated and comfortable. Good selection of coffee, tea, and pastries. The staff are friendly and very knowledgeable about each cat.'
          author='– Susie S. on TripAdvisor'
        />
        <CommentCard
          title='Incredible Experience'
          star={5}
          content='This café exceeded all my expectations! Not only do they serve top-notch coffee, but the opportunity to interact with the adorable cats is a unique and heartwarming experience. The atmosphere is so calming and welcoming, it is like a little oasis in the middle of the city. The fact that these lovely cats are up for adoption adds a whole new level of meaning to this place. The staff is also very friendly and knowledgeable, always ready to answer any questions about the cats..!'
          author='– Alex P. on Google Reviews'
        />
      </div>
      {/* <CommentCard /> */}
    </PageTransition>
  );
};

export default Home;
