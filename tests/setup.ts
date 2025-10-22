import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

afterEach(() => {
    cleanup();
});

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        href: '',
        assign: vi.fn(),
    },
    writable: true,
});

// Mock Inertia Head component
vi.mock('@inertiajs/react', async () => {
    const actual = await vi.importActual('@inertiajs/react');
    return {
        ...actual,
        Head: ({ children }: { children?: React.ReactNode }) => React.createElement('head', null, children),
        Link: ({ children, href, ...props }: { children?: React.ReactNode; href?: string }) => React.createElement('a', { href, ...props }, children),
        usePage: () => ({
            props: {},
            url: '/',
            component: 'Welcome',
            version: null,
        }),
        router: {
            visit: vi.fn(),
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
            reload: vi.fn(),
        },
    };
});