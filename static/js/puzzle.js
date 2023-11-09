document.addEventListener('DOMContentLoaded', () => {
    var image = document.getElementById('my_puzzle');
    image.onload = () => {
        var puzzleImage = document.getElementById('my_puzzle');
        snapfit.defaultPolygon = true;
        snapfit.defaultAreaimage = true; 
        snapfit.defaultSimple = true
        snapfit.defaultSnap = 24;
        snapfit.defaultLevel = 1;
        snapfit.add(puzzleImage, { mixed: true });
    };
});

// window.addEventListener('resize', () => {
//     setTimeout(() => {
//         location.reload()
//     }, 500)
// })