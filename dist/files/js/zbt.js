document.addEventListener("DOMContentLoaded", (() => {
    const elements = {
        treasureButton: document.querySelector(".treasure-widget"),
        treasureButtonMobile: document.querySelector(".treasure-widget__button"),
        treasureImage: document.querySelector(".treasure-widget__image"),
        header: document.getElementById("header"),
        hero: document.getElementById("hero"),
        zbtElement: document.querySelector(".zbt-class"),
        zbtHead: document.querySelector('[data-screen="zbt-class"]'),
        buttonBack: document.querySelector("._back-to-main-screen"),
        zbtBg: document.querySelector(".zbt-bg")
    };
    const toggleVisibility = show => {
        const action = show ? "add" : "remove";
        elements.header?.classList[action]("_hidden");
        elements.hero?.classList[action]("_hidden");
        elements.zbtElement?.classList[action]("_visible");
        elements.zbtHead?.classList[action]("_visible");
        elements.zbtBg?.classList[action]("_visible");
    };
    const isMobile = window.innerWidth < 768;
    const treasureWidget = document.querySelector(".treasure-widget[open-path]");
    if (treasureWidget) if (isMobile) [ elements.treasureButtonMobile, elements.treasureImage ].forEach((element => {
        element?.addEventListener("click", (() => toggleVisibility(true)));
    })); else elements.treasureButton?.addEventListener("click", (() => toggleVisibility(true)));
    elements.buttonBack?.addEventListener("click", (() => toggleVisibility(false)));
}));

document.addEventListener("click", (e => {
    const toggleBtn = e.target.closest("[data-toggle-screen]");
    if (!toggleBtn) return;
    const target = toggleBtn.getAttribute("data-toggle-screen");
    document.querySelectorAll("[data-screen]").forEach((el => {
        const screenValues = el.getAttribute("data-screen").split(/\s+/);
        el.classList.toggle("_visible", screenValues.includes(target));
    }));
    if (toggleBtn.classList.contains("zbt__back-btn")) {
        document.querySelectorAll(".zbt-path, .zbt-inventories, .zbt-inventory").forEach((el => {
            el.classList.remove("_active");
        }));
        updateHeadersVisibility();
        const carousels = document.querySelectorAll(".carouselContainer");
        carousels.forEach((carouselContainer => {
            const parentZbt = carouselContainer.closest(".carouselWrapper");
            if (!parentZbt) return;
            const carouselStartWidth = parseInt(carouselContainer.dataset.carouselstartwidth) || 0;
            const containerWidth = parentZbt.offsetWidth;
            if (containerWidth < carouselStartWidth || carouselStartWidth === 0) {
                carouselContainer.setAttribute("data-carousel-active", "true");
                carouselContainer.classList.add("carousel-active");
            } else {
                carouselContainer.setAttribute("data-carousel-active", "false");
                carouselContainer.classList.remove("carousel-active");
                const slides = carouselContainer.querySelectorAll(".tilted-card");
                slides.forEach((slide => {
                    slide.style.transform = "";
                    slide.style.zIndex = "";
                }));
            }
        }));
    }
}));

document.addEventListener("click", (e => {
    const card = e.target.closest("[data-artefacts-screen]");
    if (!card) return;
    updateHeadersVisibility();
}));

function updateHeadersVisibility() {
    document.querySelectorAll(".zbt__head").forEach((head => {
        head.classList.remove("_visible");
    }));
    const activeInventories = document.querySelector(".zbt-inventories._active");
    if (activeInventories) {
        const pathHead = document.querySelector('.zbt__head._path[data-screen="zbt-path"]');
        if (pathHead) pathHead.classList.add("_visible");
    } else {
        const activeScreen = document.querySelector("[data-screen]._visible");
        if (activeScreen) {
            const screenValue = activeScreen.getAttribute("data-screen");
            const correspondingHead = document.querySelector(`.zbt__head[data-screen="${screenValue}"]`);
            if (correspondingHead) correspondingHead.classList.add("_visible");
        }
    }
}

const observer = new MutationObserver((mutations => {
    mutations.forEach((mutation => {
        if (mutation.target.classList.contains("zbt-inventories")) updateHeadersVisibility();
    }));
}));

document.querySelectorAll(".zbt-inventories").forEach((inventory => {
    observer.observe(inventory, {
        attributes: true,
        attributeFilter: [ "class" ]
    });
}));

const settings = {
    scaleOnHover: 1.05,
    rotateAmplitude: 5
};

class TiltedCard {
    constructor(element) {
        this.element = element;
        this.inner = element.querySelector(".tilted-card__wrapper");
        this.img = element.querySelector(".tilted-card__img");
        this.overlay = element.querySelector(".tilted-card__overlay");
        this.currentX = 0;
        this.currentY = 0;
        this.init();
    }
    init() {
        this.inner.style.transformStyle = "preserve-3d";
        this.element.addEventListener("mousemove", this.handleMouse.bind(this));
        this.element.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
        this.element.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }
    handleMouse(e) {
        const rect = this.element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        const rotationX = offsetY / (rect.height / 2) * -settings.rotateAmplitude;
        const rotationY = offsetX / (rect.width / 2) * settings.rotateAmplitude;
        Motion.animate(this.inner, {
            rotateX: `${rotationX}deg`,
            rotateY: `${rotationY}deg`
        }, {
            duration: .15,
            easing: "easeOut"
        });
        this.currentX = e.clientX - rect.left;
        this.currentY = e.clientY - rect.top;
    }
    handleMouseEnter() {
        Motion.animate(this.inner, {
            scale: settings.scaleOnHover
        }, {
            duration: .2,
            easing: [ .23, 1, .32, 1 ]
        });
    }
    handleMouseLeave() {
        Motion.animate(this.inner, {
            scale: 1,
            rotateX: "0deg",
            rotateY: "0deg"
        }, {
            duration: .3,
            easing: [ .23, 1, .32, 1 ]
        });
    }
}

const initCards = () => {
    document.querySelectorAll(".tilted-card").forEach((card => new TiltedCard(card)));
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCards); else initCards();

let backButtonTimeout = null;

function blockBackButton() {
    const backButtons = document.querySelectorAll(".zbt__back-btn");
    backButtons.forEach((button => {
        button.style.pointerEvents = "none";
    }));
    if (backButtonTimeout) clearTimeout(backButtonTimeout);
    backButtonTimeout = setTimeout((() => {
        backButtons.forEach((button => {
            button.style.pointerEvents = "auto";
        }));
    }), 1300);
}

document.addEventListener("DOMContentLoaded", (() => {
    const carousels = document.querySelectorAll(".carouselContainer");
    function handleCarousels() {
        carousels.forEach((carouselContainer => {
            const parentZbt = carouselContainer.closest(".carouselWrapper");
            if (!parentZbt) return;
            if (!parentZbt._resizeObserverInitialized) {
                const resizeObserver = new ResizeObserver((() => {
                    const currentWidth = parentZbt.offsetWidth;
                    const carouselStartWidth = parseInt(carouselContainer.dataset.carouselstartwidth) || 0;
                    if (carouselStartWidth > currentWidth) {
                        carouselContainer.setAttribute("data-carousel-active", "true");
                        carouselContainer.classList.add("carousel-active");
                        updateCarousel();
                    } else {
                        carouselContainer.setAttribute("data-carousel-active", "false");
                        carouselContainer.classList.remove("carousel-active");
                        const slides = carouselContainer.querySelectorAll(".tilted-card");
                        slides.forEach((slide => {
                            slide.style.transform = "";
                            slide.style.zIndex = "";
                        }));
                    }
                }));
                resizeObserver.observe(parentZbt);
                parentZbt._resizeObserverInitialized = true;
            }
            const carouselStartWidth = parseInt(carouselContainer.dataset.carouselstartwidth) || 0;
            parentZbt.offsetWidth;
            let currentIndex = 0;
            let clickedButton = null;
            let clickedCardIndex = null;
            let isClickActivated = false;
            const slides = carouselContainer.querySelectorAll(".tilted-card");
            const itemsCount = slides.length;
            let touchStartX = 0;
            let touchEndX = 0;
            carouselContainer.addEventListener("touchstart", (function(event) {
                touchStartX = event.changedTouches[0].screenX;
            }), false);
            carouselContainer.addEventListener("touchend", (function(event) {
                touchEndX = event.changedTouches[0].screenX;
                handleSwipe();
            }), false);
            carouselContainer.addEventListener("mousedown", (function(event) {
                event.preventDefault();
                touchStartX = event.screenX;
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            }));
            let currentMouseX = 0;
            function handleMouseMove(event) {
                currentMouseX = event.screenX;
                const deltaX = currentMouseX - touchStartX;
                const activeCard = carouselContainer.querySelector(".tilted-card.active");
                if (activeCard) Motion.animate(activeCard, {
                    x: deltaX / 5
                }, {
                    duration: 0
                });
            }
            function handleMouseUp(event) {
                touchEndX = event.screenX;
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                const activeCard = carouselContainer.querySelector(".tilted-card.active");
                if (activeCard) Motion.animate(activeCard, {
                    x: 0
                }, {
                    duration: .2
                });
                handleSwipe();
            }
            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX - touchStartX > swipeThreshold) handlePrev(); else if (touchStartX - touchEndX > swipeThreshold) handleNext();
            }
            function handleNext() {
                isClickActivated = false;
                setCurrentIndex((currentIndex + 1) % itemsCount);
                clickedButton = "next";
                blockBackButton();
            }
            function handlePrev() {
                isClickActivated = false;
                setCurrentIndex((currentIndex - 1 + itemsCount) % itemsCount);
                clickedButton = "prev";
                blockBackButton();
            }
            function setCurrentIndex(newIndex) {
                currentIndex = newIndex;
                updateCarousel();
            }
            function getItemPosition(index) {
                const relativeIndex = (index - currentIndex + itemsCount) % itemsCount;
                if (itemsCount === 3) if (relativeIndex === 0) return {
                    x: 0,
                    y: 0,
                    scale: 1.15,
                    zIndex: 10
                }; else if (relativeIndex === 1) return {
                    x: 220,
                    y: 0,
                    scale: 1,
                    zIndex: 6
                }; else if (relativeIndex === 2) return {
                    x: -220,
                    y: 0,
                    scale: 1,
                    zIndex: 6
                };
                if (relativeIndex === 0) return {
                    x: 0,
                    y: 0,
                    scale: 1.15,
                    zIndex: 10
                }; else if (relativeIndex === 1) return {
                    x: 270 - relativeIndex * 50,
                    y: 0,
                    scale: 1,
                    zIndex: 6
                }; else if (relativeIndex === 2) return {
                    x: 500 - relativeIndex * 50,
                    y: 0,
                    scale: .85,
                    zIndex: 4
                }; else return {
                    x: -220,
                    y: 0,
                    scale: 1,
                    zIndex: clickedButton === "prev" ? 3 : 5
                };
            }
            function updateCarousel() {
                slides.forEach(((item, index) => {
                    const position = getItemPosition(index);
                    if (index === currentIndex) item.classList.add("active"); else item.classList.remove("active");
                    Motion.animate(item, {
                        x: position.x,
                        y: position.y,
                        scale: position.scale,
                        zIndex: position.zIndex
                    }, {
                        duration: 1.3,
                        easing: "ease-out",
                        type: "spring",
                        bounce: .2
                    });
                }));
            }
            slides.forEach(((slide, index) => {
                slide.addEventListener("click", (e => {
                    e.stopPropagation();
                    blockBackButton();
                    const parentPathChoose = slide.closest(".zbt-path");
                    if (parentPathChoose) {
                        document.querySelectorAll(".zbt-path").forEach((el => {
                            el.classList.remove("_active");
                        }));
                        parentPathChoose.classList.add("_active");
                    }
                    const artefactsScreen = slide.getAttribute("data-artefacts-screen");
                    if (artefactsScreen) {
                        const artefactsBlock = parentPathChoose.querySelector(`[data-artefacts="${artefactsScreen}"]`);
                        if (artefactsBlock) {
                            parentPathChoose.querySelectorAll(".zbt-inventory").forEach((el => {
                                el.classList.remove("_active");
                            }));
                            artefactsBlock.classList.add("_active");
                        }
                        const artefactsList = parentPathChoose.querySelector(".zbt-inventories");
                        if (artefactsList) artefactsList.classList.add("_active");
                    }
                    const currentContainerWidth = parentZbt.offsetWidth;
                    if (currentContainerWidth < carouselStartWidth || carouselStartWidth === 0) {
                        carouselContainer.setAttribute("data-carousel-active", "true");
                        carouselContainer.classList.add("carousel-active");
                        currentIndex = index;
                        clickedCardIndex = index;
                        isClickActivated = true;
                        slides.forEach((s => s.classList.remove("active")));
                        slide.classList.add("active");
                        updateCarousel();
                    } else {
                        slides.forEach((s => s.classList.remove("active")));
                        slide.classList.add("active");
                    }
                }));
            }));
        }));
    }
    handleCarousels();
    window.addEventListener("resize", handleCarousels);
}));

document.addEventListener("DOMContentLoaded", (function() {
    const items = document.querySelectorAll(".artifact");
    if (items.length === 0) return;
    items.forEach((function(item) {
        const tooltip = item.querySelector(".artifact__tooltip");
        if (!tooltip) return;
        function showTooltip() {
            tooltip.classList.add("_active");
            const rect = item.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const spaceFromTop = rect.top;
            const spaceFromBottom = window.innerHeight - rect.bottom;
            const thresholdTop = 350;
            if (spaceFromTop < thresholdTop || spaceFromBottom < tooltipRect.height) {
                tooltip.classList.add("_bottom");
                tooltip.classList.remove("_top");
                tooltip.style.bottom = `-${tooltipRect.height + 20}px`;
                tooltip.style.top = "auto";
            } else {
                tooltip.classList.add("_top");
                tooltip.classList.remove("_bottom");
                tooltip.style.top = `-${tooltipRect.height + 20}px`;
                tooltip.style.bottom = "auto";
            }
            requestAnimationFrame((() => {
                const tooltipRect = tooltip.getBoundingClientRect();
                item.getBoundingClientRect();
                const overflowRight = tooltipRect.right - window.innerWidth;
                const overflowLeft = tooltipRect.left;
                if (overflowRight > 20) {
                    tooltip.classList.add("_left");
                    tooltip.classList.remove("_right");
                    tooltip.style.right = "0";
                    tooltip.style.left = "auto";
                } else if (overflowLeft < 0) {
                    tooltip.classList.add("_right");
                    tooltip.classList.remove("_left");
                    tooltip.style.right = `-${tooltipRect.width + 20}px`;
                    tooltip.style.left = "auto";
                } else {
                    tooltip.classList.remove("_left", "_right");
                    tooltip.style.left = "0";
                    tooltip.style.right = "auto";
                }
                const finalTooltipRect = tooltip.getBoundingClientRect();
                if (finalTooltipRect.bottom > window.innerHeight) {
                    tooltip.classList.add("_bottom");
                    tooltip.classList.remove("_top");
                    tooltip.style.bottom = `-${tooltipRect.height + 20}px`;
                    tooltip.style.top = "auto";
                } else if (finalTooltipRect.top < 0) {
                    tooltip.classList.add("_top");
                    tooltip.classList.remove("_bottom");
                    tooltip.style.top = `-${tooltipRect.height + 20}px`;
                    tooltip.style.bottom = "auto";
                }
            }));
        }
        function hideTooltip() {
            tooltip.classList.remove("_active", "_top", "_bottom", "_left", "_right");
            tooltip.style.top = "";
            tooltip.style.bottom = "";
            tooltip.style.left = "";
            tooltip.style.right = "";
        }
        item.addEventListener("mouseenter", showTooltip);
        item.addEventListener("mouseleave", hideTooltip);
        item.addEventListener("touchstart", (function(e) {
            e.preventDefault();
            showTooltip();
        }));
        document.addEventListener("touchstart", (function(e) {
            if (!item.contains(e.target)) hideTooltip();
        }));
    }));
}));

document.addEventListener("DOMContentLoaded", (function() {
    const zbtPath = document.querySelector(".zbt-bg");
    function updateMaskPosition() {
        const videoElement = document.querySelector(".zbt-bg__background-video");
        const imageElement = document.querySelector(".zbt-bg__background-image");
        if (videoElement && imageElement) {
            const videoHeight = videoElement.offsetHeight;
            imageElement.style.maskPosition = `center ${videoHeight}px`;
        }
    }
    updateMaskPosition();
    window.addEventListener("resize", updateMaskPosition);
    function toggleBackground() {
        zbtPath.classList.toggle("_bg-chandged");
    }
    const hiddenZoneBtns = document.querySelectorAll(".zbt-class__hidden-zone-btn");
    const itemBtns = document.querySelectorAll(".zbt-class__item-btn");
    const toggleScreenBtns = document.querySelectorAll('[data-toggle-screen="zbt-class"]');
    const allTargetBtns = [ ...hiddenZoneBtns, ...itemBtns, ...toggleScreenBtns ];
    allTargetBtns.forEach((btn => {
        btn.addEventListener("click", toggleBackground);
    }));
}));

document.addEventListener("DOMContentLoaded", (function() {
    const popupButtons = document.querySelectorAll("[open-zbt-popup]");
    const popups = document.querySelectorAll(".zbt-popup");
    function toggleBodyOverflow(show) {
        document.body.style.overflow = show ? "hidden" : "";
    }
    popupButtons.forEach((button => {
        button.addEventListener("click", (function() {
            const popupId = this.getAttribute("open-zbt-popup");
            popups.forEach((popup => {
                popup.classList.remove("_visible");
            }));
            const targetPopup = document.querySelector(`.zbt-popup[data-zbt-popup="${popupId}"]`);
            if (targetPopup) {
                targetPopup.classList.add("_visible");
                toggleBodyOverflow(true);
            }
        }));
    }));
    function closePopup(popup) {
        const closeLink = popup.getAttribute("data-zbt-close-link");
        if (closeLink) window.location.href = closeLink; else {
            popup.classList.remove("_visible");
            toggleBodyOverflow(false);
        }
    }
    const closeButtons = document.querySelectorAll(".zbt-popup__close, .zbt-popup__back-btn, .zbt-popup__btn._unavailable");
    closeButtons.forEach((button => {
        button.addEventListener("click", (function() {
            const popup = this.closest(".zbt-popup");
            if (popup) closePopup(popup);
        }));
    }));
    popups.forEach((popup => {
        popup.addEventListener("click", (function(e) {
            if (!e.target.closest(".zbt-popup__wrapper")) closePopup(this);
        }));
    }));
}));