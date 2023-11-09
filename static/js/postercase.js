const areas = document.querySelectorAll('area');
var infoButton = document.querySelector('.info-button')
let wasLand = false;

const xhr = new XMLHttpRequest();
xhr.open("GET", "/resources/cases", true);
xhr.responseType = "json";

function checkAspect() {
    const wrapper = document.querySelector('.wrapper');
    const existingBlock = document.getElementById('orientation-blocker');
    if (window.innerWidth >= window.innerHeight) {
        wasLand = true;
        wrapper.style.display = "none";
        if (!existingBlock) {
            const orientationBlocker = document.createElement('div');
            orientationBlocker.id = 'orientation-blocker';
            orientationBlocker.className = 'block-horizon';
            orientationBlocker.innerHTML = `
            <h1 class="block-horizon-header">Пожалуйста, переведите<br>Ваше устройство в<br>вертикальное положение!</h1>
            <img class="rotate-image" src="/static/resources/icons/rotate.svg" alt="">
            `;
            document.body.appendChild(orientationBlocker);
        }
    } else {
        if (wasLand) location.reload();
        wrapper.style.display = "";
        if (existingBlock) {
            existingBlock.remove();
        }
    }
}

function main(poster_name) {
    const Parameters = xhr.response[poster_name];
    const caseWrapper = document.querySelector('.wrapper');
    const posterImg = caseWrapper.querySelector('.case-image');
    posterImg.src = `${base_url}${Parameters['case-image-src']}`;
}

function filters() {
    if (xhr.status === 200) {
        if (posterName in xhr.response) {
            main(posterName);
        } else {
            console.log("Poster not found");
        }
    } else {
        console.log(xhr.status);
        console.log(xhr.statusText);
    }
}

function createCarousel(imagePaths) {
    const carouselDiv = document.createElement('div');
    carouselDiv.className = 'owl-carousel owl-theme';
    imagePaths.forEach(imagePath => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        itemDiv.appendChild(imgElement);
        carouselDiv.appendChild(itemDiv);
    });
    $(carouselDiv).owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
    });
    return carouselDiv;
}

function throwPopover(data) {
    data.sort((a, b) => a.order - b.order);
    const popoverDiv = document.getElementById('popover');
    const popoverContentDiv = document.createElement('div')
    const closeButton = document.createElement('div')
    
    popoverContentDiv.className = 'popover-content'
    
    closeButton.textContent = '✗'
    closeButton.style.cursor = 'pointer'
    closeButton.style.position = 'absolute'
    closeButton.style.fontSize = '15vw'
    closeButton.style.right = '3vw'
    
    closeButton.addEventListener('click', () => {
        popoverDiv.innerHTML = ''
        popoverDiv.style.display = 'none'
    })
    
    popoverDiv.appendChild(closeButton)
    popoverDiv.appendChild(popoverContentDiv)
    
    data.forEach(item => {
        const itemDiv = document.createElement('div');
        popoverContentDiv.appendChild(itemDiv);
        if (item.type === 'img') {
            const imgElement = document.createElement('img');
            itemDiv.appendChild(imgElement);
            $.get(`/revive-image/${item.content}`, revivedImagePath => {
                imgElement.src = revivedImagePath;
            });
        } else if (item.type === 'text') {
            const textElement = document.createElement('p');
            textElement.textContent = item.content;
            itemDiv.appendChild(textElement);
        } else if (item.type === 'carousel') {
            const revivedImagePaths = [];
            item.content.forEach(imagePath => {
                $.get(`/revive-image/${imagePath}`, revivedImagePath => {
                    revivedImagePaths.push(revivedImagePath);
                    if (revivedImagePaths.length === item.content.length) {
                        const carouselDiv = createCarousel(revivedImagePaths);
                        itemDiv.appendChild(carouselDiv);
                    }
                });
            });
        }
    });
    
    popoverDiv.style.display = 'block';
}

function handleButtonClick(buttonNumber) {
    return event => {
        const url = `/button-data?poster=${posterName}&b_num=${buttonNumber}`;
        fetch(url)
        .then(response => response.json())
        .then(data => throwPopover(data))
        .catch(error => console.error('Error fetching data:', error));
    };
}

areas.forEach((area, index) => {
    const buttonNumber = area.title.replace('button-', '');
    area.addEventListener('click', handleButtonClick(buttonNumber));
});

infoButton.addEventListener('click', handleButtonClick('info'))

$(document).ready(() => {
    $('img[usemap="#poster"]').mapster({
        mapKey: 'title',
        fillOpacity: 0.4,
        fillColor: 'C55A11',
        stroke: true,
        strokeColor: '0',
        strokeWidth: 2,
        isSelectable: true,
        highlight: 'always',
        staticState: true,
        areas: [
            {
                key: 'button-info',
                fillColor: '0085ff',
            },
        ]
    });
});

document.addEventListener('DOMContentLoaded', () => {
    checkAspect();
    window.addEventListener('resize', checkAspect);
    
    if (window.location.href.includes('mat')) {
        var logos = document.querySelector('.logos')
        logos.setAttribute('style', "background-color: var(--color-2);")
    }
    
    xhr.onload = () => filters();
    xhr.send();
});
