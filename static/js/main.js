// Your existing code
const menuBtn = document.querySelector('.menu-btn');
const wrapper = document.querySelector(".wrapper")
const overlay = document.querySelector('.overlay');
let menuOpen = true;

function setVH() {
    let height = window.innerHeight * 0.01;
    let width = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${height}px`);
    document.documentElement.style.setProperty('--vw', `${width}px`);
}

function throwInfoOverlay() {
    
    const elementsToBlur = document.querySelectorAll('.wrapper'); 
    // menuBtn.style.display = 'flex'
    if (!menuOpen) {
        // menuBtn.classList.add('open');
        overlay.style.display = 'flex';

        elementsToBlur.forEach(el => {
            el.classList.add('blurred');
        });

        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        overlay.style.display = 'none';
        menuBtn.style.display = 'none'
        elementsToBlur.forEach(el => {
            el.classList.remove('blurred');
        });

        menuOpen = false;
    }
}

setVH();

const elements = [overlay, menuBtn, wrapper];

elements.forEach(element => {
    element.addEventListener('click', throwInfoOverlay);
});


function updateInfoScale() {
    var infoElement = document.querySelector('.right-part h1.info');
    
    // Temporarily set padding-right to 0 to measure the real width
    let origPad = infoElement.style.paddingRight
    infoElement.style.paddingRight = '0';
    let widthWithoutPadding = infoElement.scrollWidth;
    
    // Restore the original padding
    infoElement.style.paddingRight = origPad;

    // Check if the width without padding is greater than 45vw
    if (widthWithoutPadding / window.innerWidth > 0.4) {
        // If so, center the text
        infoElement.style.justifyContent = 'center';
        infoElement.style.paddingRight = `${0.5 - (widthWithoutPadding / window.innerWidth)}vw`;
    }
};

function updatePosterScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vh >= vw) {
        document.documentElement.setAttribute("data-viewport", "portrait");
    } else {
        document.documentElement.setAttribute("data-viewport", "landscape");
    }
};

function UpdateIMGPadding() {
    if (1==2) {
        var posterImg = document.querySelector(".poster-img img");
        
        posterImg.style.padding = '0';
        let difference = window.innerWidth - posterImg.clientWidth
        if (difference > 0) {
            posterImg.style.padding = `15vh 0px 0px ${difference / 2}px`
        } else {
            posterImg.style.padding = `15vh 0px 0px 1vw`
        }
    }
}

window.addEventListener('resize', setVH);
window.addEventListener('resize', updatePosterScale)
window.addEventListener('resize', UpdateIMGPadding)