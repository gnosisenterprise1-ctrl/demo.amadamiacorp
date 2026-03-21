document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Reveal on Scroll (Intersection Observer API)
    const revealElements = document.querySelectorAll(".reveal");
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Dynamic Niche Tabs Selector
    const tabs = document.querySelectorAll(".niche-tab");
    const contents = document.querySelectorAll(".niche-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // Add active class to clicked tab
            tab.classList.add("active");

            // Show corresponding content
            const targetId = tab.getAttribute("data-target");
            const targetContent = document.getElementById(targetId);
            
            // Small timeout to allow CSS fade in effect properly
            setTimeout(() => {
                targetContent.classList.add("active");
            }, 50);
        });
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const documentTarget = document.querySelector(this.getAttribute('href'));
            if(documentTarget) {
                documentTarget.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
