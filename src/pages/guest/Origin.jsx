import AboutDetails from '../../components/AboutDetails';
import firstImg from '../../assets/about/origin/1.jpg';
import secondImg from '../../assets/about/origin/2.jpg';
import thirdImg from '../../assets/about/origin/3.jpg';
import fourthImg from '../../assets/about/origin/4.jpg';
import Button from '../../components/Button';
import Content from '../../components/Content';
import ImageWithDetail from '../../components/ImageWithDetail';
import DoubleContent from '../../components/DoubleContent';
import PageTransition from '../PageTransition';

const Origin = () => {
  return (
    <PageTransition>
      <AboutDetails
        backgroundImg='bg-about-origin'
        header="What's a Kohi Neko ?"
      >
        <div className='mt-10 px-[12rem]'>
          <DoubleContent>
            <div className='flex flex-col gap-10'>
              <Content
                header='Origin of Kohi Neko'
                content='Kohi Neko originated in Taiwan, with one opening in Taipei in 1998.
            The cafe became popular with Japanese tourists as well as local
            visitors, who enjoyed the opportunity to interact with some furry
            friends.'
              />

              <Content
                header='Growth Throughout the World'
                content='Since then, cat cafes have spread throughout the world. You can now
            find them in Korea, Austria, Spain, Hungary, Germany, France, and
            the United Kingdom. Cat cafes moved into North America in 2014, with
            the first one opening in Montreal. Oakland was next, and then came
            to New York. When we opened The Cat Cafe in January 2015, we became
            the fifth cat cafe in the United States.'
              />

              <Content
                header='Kohi Neko in the United Statesd'
                content='Within the United States, compliance with food service regulations
            has been a challenge. The Japanese are known for being a very clean
            society. They allow Kohi Neko to serve food and drink in the area
            where the cats are. But sadly, that’s not how it works in the United
            States.The Cat Cafe had to separate the cat playpen, where
            the cats are, from the coffee bar. And that’s why we have a design
            that we don’t really like. We have multiple doors and a wall
            separating our coffee bar from the cats.'
              />

              <Content
                header='The Cat Playpen at The Cat Cafe'
                content='   Once you step inside the cat playpen, however, you’ll forget all
            about the design challenges as you enjoy your drink with our
            friendly cats.'
              />
              <div>
                <Button type='large' to='/coffeeShops'>
                  Make a reservation
                </Button>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center gap-3'>
              <ImageWithDetail
                img={firstImg}
                subtitle='Patrons at a Japanese Cafe'
              />
              <ImageWithDetail
                img={secondImg}
                subtitle='The Cat Playpen at the Kohi Neko
            '
              />{' '}
              <ImageWithDetail
                img={thirdImg}
                subtitle='The Coffee Bar at The Kohi Neko
            '
              />{' '}
            </div>
          </DoubleContent>
        </div>
      </AboutDetails>
    </PageTransition>
  );
};

export default Origin;
