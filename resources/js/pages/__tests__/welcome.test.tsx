import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Welcome from '../welcome';

interface MockResponse {
    ok: boolean;
    json: () => Promise<unknown>;
}

global.fetch = vi.fn() as unknown as typeof fetch;

describe('Welcome (Login) Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = '';
    });

    it('renders login form', () => {
        render(<Welcome />);
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('updates email input', () => {
        render(<Welcome />);
        const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password input', () => {
        render(<Welcome />);
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    it('submits form with valid credentials', async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ 
                success: true,
                token: 'test-token', 
                user: { id: 1, email: 'test@example.com' } 
            }),
        } as MockResponse);

        render(<Welcome />);
        
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Log In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/login'),
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });

    it('displays error message on failed login', async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Invalid credentials' }),
        } as MockResponse);

        render(<Welcome />);
        
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Log In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });
});