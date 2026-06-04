const targetPoint = document.getElementById('highlights');

targetPoint.addEventListener('scroll', (e) => {
    const x = targetPoint.scrollLeft;
    
    // 1. Calculate the dynamic maximum scrollable limit right now
    const maxScrollLeft = targetPoint.scrollWidth - targetPoint.clientWidth;
    
    // Safety check: Prevent division by zero if content fits perfectly
    if (maxScrollLeft <= 0) return;

    // 2. Compute a pure layout progress ratio between 0.0 and 1.0
    const scrollRatio = Math.min(Math.max(x / maxScrollLeft, 0), 1);
    
    // 3. Apply Linear Interpolation (Lerp) cleanly
    // Formula: StartValue + (Distance * Ratio)
    const minPercent = 15;
    const maxPercent = 40; // Or 45%, set your exact visual ceiling here
    
    const dynamicPercent = minPercent + (scrollRatio * (maxPercent - minPercent));
    
    // 4. Update the card styles instantly
    const cards = document.querySelectorAll('.hcard');
    if (cards[2]) {
        cards[2].style.setProperty('--card-width', `${dynamicPercent}%`);
    }

    // Debugging readouts
    //console.log(`Ratio: ${scrollRatio.toFixed(2)} | Target Card Width: ${dynamicPercent.toFixed(1)}%`);
});

console.log('Home JS loaded');