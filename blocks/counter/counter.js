export default function decorate(block) {
  const row = block.firstElementChild;
  row.classList.add('counter-row');

  // Format each column
  [...row.children].forEach((col) => {
    col.classList.add('counter-item');
    
    // Create the text wrapper
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('counter-text');
    
    // Separate the image from the text
    [...col.children].forEach((child) => {
      // EDS wraps pictures in <p> tags, so we check if the child contains a picture
      if (child.querySelector('picture') || child.tagName === 'PICTURE') {
        child.classList.add('counter-icon');
      } else {
        textWrapper.append(child);
      }
    });
    col.append(textWrapper);

    // Grab the first line of text as the number
    const numberElement = textWrapper.children[0];
    if (numberElement) {
      numberElement.classList.add('counter-number');
      const text = numberElement.textContent.trim();
      
      // Cleanly extract the digits and the suffix (+ or K)
      const targetNumber = parseFloat(text.replace(/[^\d.]/g, '')) || 0;
      const suffix = text.replace(/[\d.]/g, '').trim();
      
      // Setup the data attributes for the animation
      numberElement.dataset.target = targetNumber;
      numberElement.dataset.suffix = suffix;
      numberElement.textContent = `0${suffix}`;
    }
  });

  // Animation logic
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter-number');
        counters.forEach((counter) => {
          const target = parseFloat(counter.dataset.target);
          const suffix = counter.dataset.suffix;
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); 
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = `${Math.ceil(current)}${suffix}`;
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = `${target}${suffix}`;
            }
          };
          updateCounter();
        });
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 }); 

  observer.observe(block);
}