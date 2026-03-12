export default function decorate(block) {
  // 1. Create the 50/50 wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'hww-wrapper';

  const leftCol = document.createElement('div');
  leftCol.className = 'hww-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'hww-right';

  wrapper.append(leftCol, rightCol);

  // 2. Process the rows from the document
  const rows = [...block.children];

  // Row 1: Headings go left, Image goes right
  const headerDiv = rows[0].children[0];
  const imageDiv = rows[0].children[1];
  
  leftCol.append(...headerDiv.childNodes);
  rightCol.append(...imageDiv.childNodes);

  // 3. Create the Accordion Container
  const accordion = document.createElement('div');
  accordion.className = 'hww-accordion';

  // Rows 2+: Turn into Accordion Items
  for (let i = 1; i < rows.length; i++) {
    const qText = rows[i].children[0].innerHTML;
    const aText = rows[i].children[1].innerHTML;

    const item = document.createElement('div');
    item.className = 'hww-accordion-item';
    
    // Make the first item open by default
    if (i === 1) item.classList.add('active'); 

    const question = document.createElement('div');
    question.className = 'hww-question';
    question.innerHTML = `<p>${qText}</p>`;

    const answer = document.createElement('div');
    answer.className = 'hww-answer';
    answer.innerHTML = aText;

    // Add Click Listener to open/close
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all items first
      accordion.querySelectorAll('.hww-accordion-item').forEach(el => el.classList.remove('active'));
      // If it wasn't active, open it
      if (!isActive) item.classList.add('active');
    });

    item.append(question, answer);
    accordion.append(item);
  }

  leftCol.append(accordion);

  // 4. Replace the raw document table with our new HTML
  block.textContent = '';
  block.append(wrapper);
}