/* eslint-disable testing-library/no-debugging-utils */
import {render, screen} from '@testing-library/react';
import {TextInput} from '.';

describe('<TextInput />', ()=> {
  it('should call handleChange function on each key pressed', ()=>{
    const fn = jest.fn();
    const {debug} = render(<TextInput handleChange={fn} searchValue={'testando'}/>)
    debug();
  })
})