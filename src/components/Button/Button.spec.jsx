import {fireEvent, render, screen, userEvent} from '@testing-library/react';
import {Button} from '.'

describe('<Button/>', () => {
  it("shold render the button with the text", () => {
    render(<Button text="Load more"/>);
    expect.assertions(1);

    const button = screen.getByRole('button', {name: /load more/i});
    expect(button).toHaveAttribute('class', 'button');
  });
  
  it("should call function on button click", () => {
    const fn = jest.fn();
    render(<Button text="Load more" onClick={fn}/>);

    const button = screen.getByRole('button', {name: /load more/i});

    fireEvent.click(button);
    expect(fn).toHaveBeenCalled();
  });
});