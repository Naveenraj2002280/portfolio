document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-container, .hero-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Smooth Navigation Position Loop
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
