import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup();
});

// Mock window.location
delete (window as any).location;
(window as any).location = { href: '', assign: vi.fn() };