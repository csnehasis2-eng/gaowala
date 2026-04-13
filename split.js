const fs = require('fs');

const content = fs.readFileSync('index (5).html', 'utf8');

// 1. Extract CSS
const styleMatch = content.match(/<style>\s*([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('public/css/style.css', styleMatch[1]);
} else {
  console.log("No style tag found");
}

// 2. Extract JS
const jsMatch = content.match(/<script>\s*\/\/\s*── LOADER ──\s*([\s\S]*?)<\/script>/);
let jsContent = '';
if (jsMatch) {
  jsContent = "// ── LOADER ──\n" + jsMatch[1];
  
  // Update handleForm to call backend API
  jsContent = jsContent.replace(/function handleForm\(e\) \{[\s\S]*?\}/, `async function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  
  const firstName = e.target.querySelector('input[placeholder="Arjun"]').value;
  const lastName = e.target.querySelector('input[placeholder="Roy"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const date = e.target.querySelector('input[type="date"]').value;
  const guests = e.target.querySelector('input[type="number"]').value;
  const requests = e.target.querySelector('textarea').value;
  
  try {
    btn.innerHTML = '<span>Processing...</span>';
    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, date, guests, requests })
    });
    
    if (res.ok) {
      btn.innerHTML = '<span>✦ Reservation Confirmed</span>';
      btn.style.background = 'var(--gold)';
      btn.style.color = 'var(--black)';
      e.target.reset();
    } else {
      btn.innerHTML = '<span>Error - Try Again</span>';
    }
  } catch(err) {
    console.error(err);
    btn.innerHTML = '<span>Error - Try Again</span>';
  }
}`);

  fs.writeFileSync('public/js/script.js', jsContent);
} else {
  console.log("No script tag found for separation.");
}

// 3. Update HTML
let html = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="css/style.css">');
html = html.replace(/<script>\s*\/\/\s*── LOADER ──[\s\S]*?<\/script>/, '<script src="js/script.js"></script>');

fs.writeFileSync('public/index.html', html);
fs.writeFileSync('index (5).html', html);
console.log("File splitting completed successfully.");

