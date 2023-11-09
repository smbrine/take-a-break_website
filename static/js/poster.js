const picObj = document.getElementById('poster-self');
let vw = window.innerWidth;
let vh = window.innerHeight;
let share = document.querySelector('.share-block')

async function shareContent() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Мой постер',
                text: 'Смотри, какой плакат я сделал!',
                url: window.location.href,
            });
            console.log('Content shared successfully');
        } catch (err) {
            // console.error('Error sharing:', err);
        }
    } else {
        console.log('Web Share API not supported');
    }
}


function setVH() {
    let height = window.innerHeight * 0.01;
    let width = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${height}px`);
    document.documentElement.style.setProperty('--vw', `${width}px`);
    document.documentElement.style.setProperty('--newv', `${width*height}px`);
}

function updatePosterScale() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    if (vh>=vw) {
        document.documentElement.setAttribute("data-viewport", "portrait");
    } else {
        document.documentElement.setAttribute("data-viewport", "landscape");
    }
}

function int(value) {
    return Math.round(value)
}

document.addEventListener('DOMContentLoaded', () => {
    updatePosterScale()
    setVH()
    picObj.src = picPath.replace('./', '/static/');

});


window.addEventListener('resize', updatePosterScale);
window.addEventListener('resize', setVH)

share.addEventListener('click', shareContent)
share.addEventListener('touchend', shareContent)
