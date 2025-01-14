document.addEventListener("DOMContentLoaded", (function() {
    document.documentElement.classList.add("lock");
    const wrapper = document.getElementById("wrapper");
    const header = document.getElementById("header");
    const heroImage = document.querySelector(".hero__static-bg");
    function hidePreloader() {
        document.documentElement.classList.remove("lock");
        if (wrapper) wrapper.classList.add("_wrapper-active");
        if (header) header.classList.add("_active");
    }
    if (heroImage) if (heroImage.complete) setTimeout(hidePreloader, 100); else heroImage.addEventListener("load", (function() {
        setTimeout(hidePreloader, 100);
    })); else setTimeout(hidePreloader, 100);
}));