import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Feed from '../feed';

interface MockResponse {
    ok: boolean;
    json: () => Promise<unknown>;
}

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: () => null,
};
global.localStorage = localStorageMock as Storage;

global.fetch = vi.fn() as unknown as typeof fetch;

describe('Feed Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = '';
    });

    it('redirects to login if no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);
        render(<Feed />);
        expect(window.location.href).toBe('/');
    });

    it('renders post creation form when authenticated', async () => {
        localStorageMock.getItem.mockReturnValue('test-token');
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, posts: [] }),
        } as MockResponse);

        render(<Feed />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText("What's happening?")).toBeInTheDocument();
            expect(screen.getByText('280 characters remaining')).toBeInTheDocument();
        });
    });

    it('updates textarea content and shows character count', async () => {
        localStorageMock.getItem.mockReturnValue('test-token');
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, posts: [] }),
        } as MockResponse);

        render(<Feed />);

        const textarea = await screen.findByPlaceholderText("What's happening?") as HTMLTextAreaElement;
        fireEvent.change(textarea, { target: { value: 'Hello World' } });

        expect(textarea.value).toBe('Hello World');
        expect(screen.getByText('269 characters remaining')).toBeInTheDocument();
    });

    it('displays posts from API', async () => {
        localStorageMock.getItem.mockReturnValue('test-token');
        const mockPosts = [
            {
                id: 1,
                content: 'Test post content',
                user: { 
                    id: 1, 
                    full_name: 'John Doe', 
                    first_name: 'John', 
                    surname: 'Doe' 
                },
                reactions_count: 5,
                is_reacted: false,
                created_at: '2024-01-01 10:00:00',
            },
        ];

        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, posts: mockPosts }),
        } as MockResponse);

        render(<Feed />);

        await waitFor(() => {
            expect(screen.getByText('Test post content')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('fetches posts on mount', async () => {
        localStorageMock.getItem.mockReturnValue('test-token');
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, posts: [] }),
        } as MockResponse);

        render(<Feed />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/posts',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-token'
                    })
                })
            );
        });
    });
});