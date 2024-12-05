import '@testing-library/jest-dom';
import Page from '../app/page';
import SignUpForm from '../app/components/SignUpForm';
import { render, screen } from '@testing-library/react'

test('Page', () => {
    it('renders page', () => {
        render(<SignUpForm/>);

        //const nameInput = screen.getAllByLabelText("name");

        //expect(nameInput).toBeInTheDocument();
    
    })
})
