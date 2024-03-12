import React from 'react';
import AboutDetails from '../../components/AboutDetails';

const HowItWorks = () => {
  return (
    <AboutDetails
      backgroundImg='bg-about-howitworks'
      objectPosition='center -200px'
      header='How It Works'
    >
      <div className='flex flex-col justify-center px-[15rem] py-5 gap-3'>
        <div>
          <h1 className='font-bold text-4xl'>Procedure</h1>
          <ul className='list-disc list-inside space-y-2 pl-4'>
            <li className='text-lg'>
              You’ll check in at the coffee bar when you arrive. We know you’re
              anxious to get in to interact with the cats but we’ll need to
              check you in and get your food or drink item ordered first.{' '}
            </li>
            <li className='text-lg'>
              We’ll have you wait until your designated time to head in to the
              cat room. You can do that outside and enjoy the next to perfect
              weather San Diego is known for. Or you can stand by the window and
              look into the cat room.
            </li>
            <li className='text-lg'>
              We fill up quickly during peak days. We strongly encourage
              reservations so that you’re not disappointed with the wait to get
              in to interact with the cats. We’ll do our best to allow walk in
              visitors, but there is a chance you won’t be able to get in
              without a wait.
            </li>
          </ul>
        </div>
        <div>
          <h1 className='font-bold text-4xl'>Dos and Don&apos;ts</h1>
          <h3>
            We know that many of you may have cats at home, but things work
            differently at The Cat Café. Since we are working with The Rescue
            House and want to make sure their cats are treated well, we ask our
            patrons to do the following:
          </h3>
          <ul className='list-disc list-inside space-y-2 pl-4'>
            <li className='text-lg'>
              Be respectful of the animals and learn the signs they show when
              they want you to ease back. We have posted signs describing the
              way cats show discomfort with their tails and their ears. Please
              keep these in mind when interacting with the cats.
            </li>
            <li className='text-lg'>
              Don’t pick up the cats. Most cats don’t like to be held, and they
              are not shy about letting you know this. We don’t want anyone to
              get scratched or bitten by a cat who’s not happy about being
              picked up.
            </li>
            <li className='text-lg'>
              Children must be supervised at all times. At The Cat Café, we want
              to make sure that we can continue to allow children to learn how
              to interact with animals. We need your help in ensuring this.
              Please ensure that your children are respectful of the cats.
            </li>
            <li className='text-lg'>
              Cats don’t like loud noises, so please keep your voices down when
              you enter the playpen. We have a sound monitor in the cat playpen.
              A siren will let us know when it gets too loud. Please remember to
              keep the volume level down so we don’t have to hear that siren.
            </li>
            <li className='text-lg'>
              Photography is fine — the internet is all about cat pictures and
              videos! However, flash photography disturbs the cats, so please
              refrain from that.
            </li>
            <li className='text-lg'>
              The Cat Café has a zero tolerance policy for any individual who is
              causing distress to the animals. It’s a rare occasion for us to
              have to ask someone to leave. We’d like to keep it that way.
            </li>
          </ul>
        </div>
      </div>
    </AboutDetails>
  );
};

export default HowItWorks;
