import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAccount from '../create-account';

interface MockResponse {
    ok: boolean;
    status?: number;
    json: () => Promise<unknown>;
}

global.fetch = vi.fn() as unknown as typeof fetch;

describe('CreateAccount Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = '';
    });

    it('renders registration form', () => {
        render(<CreateAccount />);
        
        expect(screen.getByText('Sign up with Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Surname')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('updates form inputs', () => {
        render(<CreateAccount />);
        
        const firstNameInput = screen.getByPlaceholderText('First Name') as HTMLInputElement;
        const surnameInput = screen.getByPlaceholderText('Surname') as HTMLInputElement;
        
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(surnameInput, { target: { value: 'Doe' } });
        
        expect(firstNameInput.value).toBe('John');
        expect(surnameInput.value).toBe('Doe');
    });

    it('submits registration form', async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ 
                success: true,
                token: 'test-token', 
                user: { id: 1, first_name: 'John', surname: 'Doe' } 
            }),
        } as MockResponse);

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<CreateAccount />);
        
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Surname'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        
        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/register',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        first_name: 'John',
                        surname: 'Doe',
                        email: 'john@example.com',
                        password: 'password123'
                    })
                })
            );
            expect(alertMock).toHaveBeenCalledWith('Account created successfully! Please log in.');
        });

        alertMock.mockRestore();
    });

    it('displays validation errors', async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 422,
            json: async () => ({ 
                errors: {
                    email: ['The email has already been taken.']
                }
            }),
        } as MockResponse);

        render(<CreateAccount />);
        
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Surname'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        
        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByText('The email has already been taken.')).toBeInTheDocument();
        });
    });
});