/* eslint-disable testing-library/no-debugging-utils */
import {render, screen} from '@testing-library/react';
import {TextInput} from '.';
import userEvent from '@testing-library/user-event';

describe('<TextInput />', ()=> {
  it('should hava a value of searchValue', ()=>{
    const fn = jest.fn();
    render(<TextInput handleChange={fn} searchValue={'testando'}/>)
    const input = screen.getByPlaceHolderText(/Digite sua procura/i);
    expect(input).toBeInTheDocument();

    expect(input.value).toBe('testando');
  });

  it('should call handleChange function on each key pressed', ()=>{
    const fn = jest.fn();
    const input = screen.getByPlaceHolderText(/Digite sua procura/i);
    const value = 'o valor';

    userEvent.type();
  });
})