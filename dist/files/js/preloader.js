document.addEventListener("DOMContentLoaded", (function() {
    document.documentElement.classList.add("lock");
    const wrapper = document.getElementById("wrapper");
    const header = document.getElementById("header");
    function hidePreloader() {
        setTimeout((() => {
            document.documentElement.classList.remove("lock");
            if (wrapper) wrapper.classList.add("_wrapper-active");
            if (header) header.classList.add("_active");
        }), 210);
    }
    window.onload = hidePreloader;
}));