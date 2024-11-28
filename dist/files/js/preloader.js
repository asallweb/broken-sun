document.addEventListener("DOMContentLoaded", (function() {
    window.scrollTo(0, 0);
    document.documentElement.classList.add("lock");
    const startTime = (new Date).getTime();
    const video = document.getElementById("introVideo");
    const preloader = document.getElementById("preloader");
    const wrapper = document.getElementById("wrapper");
    const heroBackground = document.getElementById("hero__background");
    const header = document.getElementById("header");
    function setVideoSource() {
        if (!video) return;
        if (window.matchMedia("(max-width: 767px)").matches) video.src = "files/video/hd.mp4"; else if (window.matchMedia("(min-width: 768px) and (max-width: 1920px)").matches) video.src = "files/video/fhd.mp4"; else video.src = "files/video/fhd.mp4";
    }
    function hidePreloader() {
        const currentTime = (new Date).getTime();
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < 1e3) setTimeout(hidePreloader, 1e3 - elapsedTime); else {
            preloader.classList.add("_preloader-nonactive");
            document.documentElement.classList.remove("lock");
            wrapper.classList.add("_wrapper-active");
            if (video) {
                video.classList.add("_video-active");
                video.play();
                video.addEventListener("ended", onVideoEnded);
            } else activateHeroAndHeader();
        }
    }
    function onVideoEnded() {
        video.classList.remove("_video-active");
        activateHeroAndHeader();
    }
    function activateHeroAndHeader() {
        if (heroBackground) heroBackground.classList.add("_active");
        if (header) header.classList.add("_active");
    }
    function init() {
        setVideoSource();
        window.onload = hidePreloader;
    }
    init();
}));