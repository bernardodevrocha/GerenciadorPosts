import {render} from '@testing-library/react';
import {PostCard} from '.';
import React from 'react';
import { postCardPropsMock } from './mock';
import { screen } from '@testing-library/react';

const props = postCardPropsMock;

describe('<PostCard/>', () => {
  it('should render PostCard correctly', () => {
    render(<PostCard {...props} />)
  
    expect(screen.getByRole('img', {name: /TITLE 1/i}))
      .toHaveAttribute('src', 'img/img.png');
    expect(screen.getByRole('heading', {name: /title 1/i})).toBeInTheDocument();
    
    //debug();
  })

  it('should match snapshot', ()=> {
    const {container} = render(<PostCard {...props}/>);
    expect(container.firstChild).toMatchSnapshot();
  })
});