export default function decorate(block) {
  // Add a class to the inner row for CSS grid
  const row = block.firstElementChild;
  row.classList.add('counter-row');

  // Format each column
  [...row.children].forEach((col) => {
    col.classList.add('counter-item');
    
    // Wrap the text inside a div so it sits next to the icon
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('counter-text');
    
    // Move everything except the picture into the text wrapper
    [...col.children].forEach((child) => {
      if (child.tagName !== 'PICTURE') {
        textWrapper.append(child);
      }
    });
    col.append(textWrapper);

    // Find the heading containing the number
    const numberHeading = textWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (numberHeading) {
      numberHeading.classList.add('counter-number');
      const text = numberHeading.textContent;
      
      // Separate digits from symbols (like + or K)
      const numberMatches = text.match(/[\d.]+/);
      const suffixMatches = text.match(/[^\d.]+/);
      
      const targetNumber = numberMatches ? parseFloat(numberMatches[0]) : 0;
      const suffix = suffixMatches ? suffixMatches[0] : '';
      
      // Store target number on element and set initial text to 0
      numberHeading.dataset.target = targetNumber;
      numberHeading.dataset.suffix = suffix;
      numberHeading.textContent = `0${suffix}`;
    }
  });

  // Intersection Observer to start counting when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter-number');
        counters.forEach((counter) => {
          const target = parseFloat(counter.dataset.target);
          const suffix = counter.dataset.suffix;
          const duration = 2000; // 2 seconds animation
          const increment = target / (duration / 16); // 60fps
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
        // Stop observing once animated
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the block is visible

  observer.observe(block);
}