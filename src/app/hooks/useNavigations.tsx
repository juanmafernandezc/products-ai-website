import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { scrollToSection, navigateToSection } from '../utils/navigation';

export const useScrollToAnchor = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  }, []);

  return { 
    scrollToSection, 
    navigateToSection: (path: string, sectionId?: string) => navigateToSection(router, path, sectionId) 
  };
};