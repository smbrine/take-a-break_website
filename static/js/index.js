let height = window.innerHeight * 0.01;
let width = window.innerWidth * 0.01;
function setVH() {
    document.documentElement.style.setProperty('--vh', `${height}px`);
    document.documentElement.style.setProperty('--vw', `${width}px`);
}

// Run the function to set the initial value
setVH();

// Update the value whenever the window is resized
window.addEventListener('resize', setVH);