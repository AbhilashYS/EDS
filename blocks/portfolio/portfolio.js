export default function decorate(block) {
  // 1. Create the slider wrapper
  const sliderWrapper = document.createElement('div');
  sliderWrapper.classList.add('portfolio-slider');

  // 2. Format each row into a slide
  [...block.children].forEach((row) => {
    row.classList.add('portfolio-slide');

    // First column is the background image
    const imgCol = row.children[0];
    imgCol.classList.add('portfolio-image');

    // Second column is the text/button content
    const contentCol = row.children[1];
    contentCol.classList.add('portfolio-content');

    sliderWrapper.append(row);
  });

  block.append(sliderWrapper);
2
  // 3. Auto-Scroll Logic (Runs every 2 seconds)
  let scrollInterval;
  const startScroll = () => {
    scrollInterval = setInterval(() => {
      // Calculate width of one slide + the 20px gap
      const slide = sliderWrapper.querySelector('.portfolio-slide');
      if (!slide) return;
      const slideWidth = slide.offsetWidth + 20; 

      // Check if we reached the very end of the slider
      const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
      
      if (sliderWrapper.scrollLeft >= maxScroll - 10) {
        // If at the end, smoothly rewind to the beginning
        sliderWrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Otherwise, scroll right by one card
        sliderWrapper.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    }, 2000); // 2 seconds
  };

  // 4. Pause the auto-scroll when the user hovers over the cards
  sliderWrapper.addEventListener('mouseenter', () => clearInterval(scrollInterval));
  sliderWrapper.addEventListener('mouseleave', startScroll);
  sliderWrapper.addEventListener('touchstart', () => clearInterval(scrollInterval), {passive: true});
  sliderWrapper.addEventListener('touchend', startScroll, {passive: true});

  // Start the loop!
  startScroll();
}