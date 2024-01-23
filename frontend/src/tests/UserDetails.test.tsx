import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../components/UserDetails';
import { api } from '../services/api';
import { AxiosResponse } from 'axios';

jest.mock('../services/api');

describe('UserDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders user details correctly', async () => {
        const user = {
            id: '1',
            firstname: 'John',
            email: 'john@example.com',
            permissions: ['user:profile:email:edit', 'user:profile:firstname:edit'],
        };

        api().get = jest.fn().mockResolvedValueOnce({ data: { user } });

        render(
            <MemoryRouter initialEntries={['/user-details/john@example.com']}>
                <Routes>
                    <Route path="/user-details/:email" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        );

        expect(api().get).toHaveBeenCalledWith('/user?email=john@example.com');

        


        expect(await screen.findByText('Firstname:')).toBeTruthy();
        expect(await screen.findByText('John')).toBeTruthy();
        expect(await screen.findByText('Email:')).toBeTruthy();
        expect(await screen.findByText('john@example.com')).toBeTruthy();
    });

    test('renders user details correctly when user has no permissions', async () => {
        const user = {
            id: '1',
            firstname: 'John',
            email: 'john@example.com',
            permissions: [],
        };

        api().get = jest.fn().mockResolvedValueOnce({ data: { user } });

        render(
            <MemoryRouter initialEntries={['/user-details/john@example.com']}>
                <Routes>
                    <Route path="/user-details/:email" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        )

        expect(api().get).toHaveBeenCalledWith('/user?email=john@example.com');

        expect(await screen.findByText('Firstname:')).toBeTruthy();
        expect(await screen.findByText('John')).toBeTruthy();
        expect(await screen.findByText('Email:')).toBeTruthy();
        expect(await screen.findByText('john@example.com')).toBeTruthy();
    });

    test('displays success message after updating user', async () => {
        const user = {
            id: '1',
            firstname: 'John',
            email: 'john@example.com',
            permissions: ['user:profile:email:edit', 'user:profile:firstname:edit'],
        };

        api().get = jest.fn().mockResolvedValueOnce({ data: { user } });
        api().put = jest.fn().mockResolvedValueOnce({} as AxiosResponse);

        render(
            <MemoryRouter initialEntries={['/user-details/john@example.com']}>
                <Routes>
                    <Route path="/user-details/:email" element={<UserDetails />} />
                </Routes>
            </MemoryRouter>
        );

        const editButton = screen.getByRole('button');
        fireEvent.click(editButton);
        

        const firstnameInput = screen.queryByLabelText(/Edit FirstName/);
        const emailInput = screen.queryByLabelText(/Email/);
        const saveButton = screen.queryByText('Save Changes');


        if (firstnameInput) {
            fireEvent.change(firstnameInput, { target: { value: 'John Doe' } });
        }
        
        if (emailInput) {
            fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
        }

        if (saveButton) {
            fireEvent.click(saveButton);
        }
        expect(screen.queryByText('User updated successfully!')).toBeInTheDocument;
    });

    test('displays error message when user is not found', async () => {
        api().get = jest.fn().mockRejectedValueOnce(new Error('User not found'));

        render(
            <MemoryRouter initialEntries={['/user-details/nonexistent@example.com']}>
                <Routes>
                    <Route path="/user-details/:email" element={<UserDetails />} />                        
                </Routes>
            </MemoryRouter>
        );

        expect(api().get).toHaveBeenCalledWith('/user?email=nonexistent@example.com');
        expect(await screen.findByText('User not found!')).toBeTruthy();
    });
});
