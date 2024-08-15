(() => {
    "use strict";
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        setTimeout((function() {
            var elements = document.querySelectorAll(".hasAnimation");
            elements.forEach((function(element) {
                var animateName = element.getAttribute("data-animate");
                element.classList.add("hidden");
                var observer = new IntersectionObserver((function(entries) {
                    entries.forEach((function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.remove("hidden");
                            entry.target.classList.add("visible", "animate__animated", animateName);
                            observer.unobserve(entry.target);
                        }
                    }));
                }), {
                    rootMargin: "0px 0px -50px 0px"
                });
                observer.observe(element);
            }));
        }), 100);
    }));
    const icons = document.querySelectorAll(".class-icon");
    const script_elements = document.querySelectorAll(".class");
    icons.forEach((icon => {
        icon.addEventListener("click", (() => {
            const showClass = icon.dataset.showclass;
            script_elements.forEach((element => {
                if (element.dataset.class === showClass) element.classList.add("_active"); else element.classList.remove("_active");
            }));
            icons.forEach((icon => {
                if (icon.dataset.showclass === showClass) icon.classList.add("_active"); else icon.classList.remove("_active");
            }));
        }));
    }));
    window["FLS"] = false;
    menuInit();
})();