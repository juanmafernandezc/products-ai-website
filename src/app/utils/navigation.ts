export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const navigateToSection = (router: any, path: string, sectionId?: string) => {
  if (sectionId) {
    // Si estamos en la misma página, hacer scroll
    if (window.location.pathname === path) {
      scrollToSection(sectionId);
      return;
    }
    // Si vamos a otra página, navegar y luego hacer scroll
    router.push(`${path}#${sectionId}`);
  } else {
    router.push(path);
  }
};