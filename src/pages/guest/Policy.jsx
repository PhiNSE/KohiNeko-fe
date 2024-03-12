import React from 'react';
import AboutDetails from '../../components/AboutDetails';

const Policy = () => {
  return (
    <AboutDetails backgroundImg='bg-about-policy' header='Child Policy'>
      <div className='flex flex-col justify-center px-[15rem] py-5 gap-3'>
        <h3>
          The <span className='font-semibold text-primary'>Kohi-Neko</span> is
          one of the few cat cafes to allow children to visit. Most cat cafes do
          not allow children to visit. In order to continue this, we need help
          from parents. Here’s what we ask you to do.
        </h3>
        <div>
          <h1 className='font-bold'>Actively Supervise Your Children</h1>
          <span className='text-xl'>
            We’ve had parents bring their children in and immediately sit down
            and start texting or answering emails. Please know that we require
            parents to actively supervise their children. Active supervision
            means watching their children to make sure they’re interacting with
            the cats appropriately.
          </span>
        </div>
        <div>
          <h1 className='font-bold'>
            Be Sure Your Children Can Help Maintain A Calm Environment
          </h1>
          <span className='text-xl'>
            We work hard to keep a calm and relaxed environment. It’s an
            environment where the cats can thrive and it’s also what customers
            expect. If your child would not be happy in this kind of an
            environment, please wait until they can before you bring them. That
            way, everyone, both two-legged and four-legged, can enjoy their time
            at The Cat Cafe.
          </span>
        </div>
        <div>
          <h1 className='font-bold'>
            Prepare Your Children to Listen to Directions
          </h1>
          <span className='text-xl'>
            We understand that even when you are watching your children,
            sometimes, they will do things that you don’t want them to do. Make
            sure they are willing and able to comply with directions given to
            them by the staff or volunteers in the cat playpen. This is for
            their safety as well as the safety and well being of the animals.
          </span>
        </div>
        <div>
          <h1 className='font-bold'>
            Decision of Staff and Volunteers is Final
          </h1>
          <span className='text-xl'>
            Upon entry, if the staff or volunteers feel that the actions of
            individual children will not contribute to the calm and relaxed
            environment we seek to maintain at The Cat Cafe, we will educate
            them on the need for this. If they cannot do this, we will decline
            your admission. If children enter the playpen and do not act in a
            way consistent with the environment we seek to maintain, we will
            inform them and you of this. Continuation of problematic behavior
            will mean the child must leave. The decision of volunteers and staff
            on this is final. No refunds will be given if children are required
            to leave due to their behavior.
          </span>
        </div>
        <div>
          <h1 className='font-bold'>Conclusion</h1>
          <span className='text-xl'>
            We’ve had literally thousands of children come through and visit us,
            and we’ve only had to require a handful of them to leave. We’re
            happy that we’re one of the few cat cafes that allow children to
            visit! With the cooperation of their parents, we’ll be able to
            continue this policy.
          </span>
        </div>
      </div>
    </AboutDetails>
  );
};

export default Policy;
