import AboutDetails from '../../components/AboutDetails';
import first from '../../assets/about/benefitstocat/first.jpg';
import second from '../../assets/about/benefitstocat/second.jpg';
import third from '../../assets/about/benefitstocat/third.jpg';
import LazyLoadImage from '../../components/LazyLoadImage';
import Button from '../../components/Button';

const BenefitsToCats = () => {
  return (
    <AboutDetails
      backgroundImg='bg-about-benefittocat'
      objectPosition='center 700px'
      header='Benefits to cats'
    >
      <div className=' px-[15rem] py-5  grid grid-cols-2 gap-[10rem]'>
        <div className='flex flex-col gap-3'>
          <h3>
            One question has come up about cat cafes- are the cats being
            exploited? They’re not. There are many benefits to the feline
            residents of cat cafes. We view The Cat Cafe as kind of a public
            foster home for adoptable cats who have the personalities to benefit
            from it.
          </h3>
          <div>
            <h1 className='font-bold'>Cat Cafe Benefits to Cats</h1>
            <span className='text-xl '>
              There are many benefits for foster homes for cats. Here are some
              of them:
            </span>
            <ul className='list-disc list-inside space-y-2 pl-4'>
              <li className='text-lg'>
                Fostering saves the lives of millions of cats. By freeing up
                space for The Rescue House’s fosters to take in additional cats,
                more animals can be saved.
              </li>
              <li className='text-lg'>
                Fostering allows animals that require special attention to get
                it. By taking in adoptable, human-friendly animals, other foster
                homes will be able to give that attention to cats who need
                socialization, have trust issues, or who just need a little
                extra help.
              </li>
              <li className='text-lg'>
                The environment at The Cat Cafe gives our feline guests a chance
                to feel at home. And, they get used to interacting with a lot of
                people. This means that cats adopted here won’t be the ones who
                hide when visitors arrive.
              </li>
              <li className='text-lg'>
                Potential adopters will be able to learn more about the
                personality of the cats. Staff and volunteers learn about the
                personalities of the cats. Then they can match them with the
                perfect adopter.
              </li>
            </ul>
          </div>
          <div>
            <h1>Focus Will Be on Welfare of Cats</h1>
            <span className='text-xl '>
              Yes, we aim to make money at The Cat Cafe. But we will do it in an
              ethical way. Unhappy and angry cats don’t draw in customers.
              That’s why The Cat Cafe works hard to make sure the cats are in a
              happy and healthy environment.
            </span>
            <br />
            <br />

            <span className='text-xl '>
              We provide the cats with an area to retreat into when they no
              longer want to interact with customers. The Cat Cafe also monitors
              the playpen to make sure interactions with the animals are
              appropriate.
            </span>
            <br />
            <br />

            <span className='text-xl '>
              We treat the animals at The Cat Cafe very well. That way, they can
              show their personality to potential adopters and find the perfect
              home!
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='w-96 h-96'>
            <LazyLoadImage src={first} />
          </div>
          <div className='w-96 h-96'>
            <LazyLoadImage src={second} />
          </div>
          <div className='w-96 h-96'>
            <LazyLoadImage src={third} />
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center px-[15rem] gap-1'>
        <h1 className='text-center text-semibold text-bold'>
          Ready For a Fun Feline Filled Day?
        </h1>
        <Button type='large' to='/coffeeShops'>
          Make a reservation
        </Button>
      </div>
    </AboutDetails>
  );
};

export default BenefitsToCats;
