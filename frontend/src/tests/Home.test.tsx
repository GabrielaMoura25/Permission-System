import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../components/Home';

describe('Home', () => {
    test('renders email input field', () => {
        render(<Home />, { wrapper: MemoryRouter });

        const emailInput = screen.getByPlaceholderText('Enter your email here...');
        expect(emailInput).toBeTruthy();
    });

    test('displays error message for invalid email format', () => {
        render(<Home />, { wrapper: MemoryRouter });

        const emailInput = screen.getByPlaceholderText('Enter your email here...');
        const submitButton = screen.getByRole('button', { name: 'Search' });

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(submitButton);
        

        const errorMessage = screen.queryByText('Invalid email format. Please enter a valid email address.');
        expect(errorMessage).toBeInTheDocument;
    });

    test('navigates to user details page on valid form submission', async () => {
        render(<Home />, { wrapper: MemoryRouter });

        const emailInput = screen.getByPlaceholderText('Enter your email here...');
        const submitButton = screen.getByRole('button', { name: 'Search' });

        fireEvent.change(emailInput, { target: { value: 'valid-email@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const userDetailsHeading = screen.queryByRole('heading', { name: 'Users' });
            expect(userDetailsHeading).toBeInTheDocument;
        });
    });
});
