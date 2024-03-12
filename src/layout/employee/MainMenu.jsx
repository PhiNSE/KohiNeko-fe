import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const MainMenu = ({ menuItems }) => {
  const StyledNavLink = styled(NavLink)`
    &:link,
    &:visited {
      display: flex;
      align-items: center;
      gap: 1.2rem;

      color: #000000; /* Change this to the color you want for the text */
      font-size: 1.3rem;
      font-weight: 500;
      padding: 1.2rem 2.4rem;
      transition: all 0.3s;
      border-bottom: 2px solid #ff9933;
    }

    /* This works because react-router places the active class on the active NavLink */
    &:hover,
    &:active,
    &.active:link,
    &.active:visited {
      color: #ff9933; /* secondary color */
      border-radius: 0.25rem; /* equivalent to tailwind's rounded-sm */
    }

    & svg {
      width: 2rem; /* Increase the size of the icon */
      height: 2rem; /* Increase the size of the icon */
      color: #000000; /* Change this to the color you want for the icon */
      transition: all 0.3s;
    }

    &:hover svg,
    &:active svg,
    &.active:link svg,
    &.active:visited svg {
      color: #b96714; /* primary color */
    }
  `;
  return (
    <nav>
      <ul className='flex flex-col gap-[0.8rem]'>
        {menuItems?.map((item) => (
          <li key={item.path}>
            <StyledNavLink to={item.path}>
              <item.icon size='1.3rem' />
              <span className='w-[6em]' >
              {item.label}
              </span>
            </StyledNavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainMenu;
