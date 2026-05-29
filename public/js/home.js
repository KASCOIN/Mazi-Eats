const targetPoint = document.getElementById('highlights');

targetPoint.addEventListener('scroll', (e) => {
    let x = 0
    x = targetPoint.scrollLeft
    console.log("x=", x);
    let x_2;

    const cards = document.querySelectorAll('.hcard');
    const cardWidth = window.getComputedStyle(cards[2]).width;
    console.log("Card is wide: ", parseInt(cardWidth));
    //
    x_2 = (5) + ((5/32) * x)
    console.log(`Current percent at: scrollx: ${x} is: ${x_2}`);

    if (x < 160) {
        cards[2].style.setProperty('--card-width', `${x_2}%`);
    } else {
        console.log('Max width reached');
    }
    
})

console.log('Home JS loaded');