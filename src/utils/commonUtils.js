import { usePathname } from 'next/navigation';

export const localeDetector = () => {
    return usePathname().includes('/en');
};

