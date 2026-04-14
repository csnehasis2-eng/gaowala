// ── MOBILE DETECT (must be FIRST) ──
const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window);

// ── LOADER ──
const loader = document.getElementById('loader');
const pct = document.getElementById('loader-pct');
let p = 0;
if (isMobile) {
  // Instant load on mobile - don't waste time
  loader.classList.add('hidden');
  document.addEventListener('DOMContentLoaded', () => initHeroAnim());
} else {
  const iv = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { loader.classList.add('hidden'); initHeroAnim(); }, 300); }
    if (pct) pct.textContent = Math.floor(p) + '%';
  }, 80);
}

// ── CURSOR (desktop only) ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (isMobile) {
  if (cur) cur.style.display = 'none';
  if (ring) ring.style.display = 'none';
  // Also restore default cursor on mobile
  document.body.style.cursor = 'auto';
} else {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
  (function animCursor() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a,button,.menu-item,.spec-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
    el.addEventListener('mouseleave', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
}

// ── NAV SCROLL & MOBILE MENU ──
window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('scrolled', scrollY > 60); });

function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('nav-links').classList.toggle('open');
  document.getElementById('nav-overlay').classList.toggle('active');
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('nav-overlay').classList.remove('active');
}

// ── HERO ENTRY ──
function initHeroAnim() {
  if (isMobile) {
    // Instant reveal on mobile - no delay needed
    ['#h-eyebrow','#h-title','#h-sub','#h-cta','#h-scroll'].forEach(id => {
      const el = document.querySelector(id);
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    return;
  }
  gsap.to('#h-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
  gsap.to('#h-title', { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
  gsap.to('#h-sub', { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
  gsap.to('#h-cta', { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });
  gsap.to('#h-scroll', { opacity: 1, duration: 1, delay: 1.4 });
}

// ── THREE.JS FLOATING FOOD ──
(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;
  // Skip entirely on mobile - biggest perf win
  if (isMobile) { canvas.style.display = 'none'; return; }

  // Mobile config: lower quality, fewer elements, slower rot
  const mobileMode = isMobile;
  const pixelRatio = mobileMode ? 1 : Math.min(window.devicePixelRatio, 2);
  const particleCount = mobileMode ? 25 : 80;
  const knotSegsTube = mobileMode ? 48 : 128;
  const knotSegsRad  = mobileMode ? 10 : 24;
  const rotSpeed     = mobileMode ? 0.001 : 0.003;
  const floatAmp     = mobileMode ? 0.15 : 0.3;
  const floatSpd     = mobileMode ? 0.4  : 0.7;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobileMode, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  cam.position.z = 5;

  // Lights: on mobile skip point lights (cheaper)
  scene.add(new THREE.AmbientLight(0xfff5d0, mobileMode ? 0.8 : 0.4));
  if (!mobileMode) {
    const goldLight1 = new THREE.PointLight(0xc9a84c, 3, 15);
    goldLight1.position.set(3, 2, 3); scene.add(goldLight1);
    const goldLight2 = new THREE.PointLight(0xe8c97a, 2, 12);
    goldLight2.position.set(-3, -1, 2); scene.add(goldLight2);
  }
  const rimLight = new THREE.DirectionalLight(0xffffff, mobileMode ? 0.6 : 0.3);
  rimLight.position.set(0, 5, -2); scene.add(rimLight);

  const objects = [];
  const g1 = new THREE.Group();

  // Lower-poly knot on mobile
  const knotMat = mobileMode
    ? new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.8, roughness: 0.3 })
    : new THREE.MeshPhysicalMaterial({ color: 0xc9a84c, metalness: 1, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.1 });
  const knotGeo = new THREE.TorusKnotGeometry(0.8, 0.25, knotSegsTube, knotSegsRad);
  g1.add(new THREE.Mesh(knotGeo, knotMat));

  // Rings: skip on mobile for perf
  if (!mobileMode) {
    const ringGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 100);
    const r1 = new THREE.Mesh(ringGeo, knotMat); r1.rotation.x = Math.PI / 2; g1.add(r1);
    const r2 = new THREE.Mesh(ringGeo, knotMat); r2.rotation.y = Math.PI / 2; g1.add(r2);
  }

  g1.position.set(-2, 0.5, -2);
  scene.add(g1);
  objects.push({ g: g1, amp: floatAmp, spd: floatSpd, rot: rotSpeed });

  // Particles
  const partGeo = new THREE.BufferGeometry();
  const pos = [], col = [];
  for (let i = 0; i < particleCount; i++) {
    pos.push((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 2);
    const b = 0.5 + Math.random() * 0.5;
    col.push(0.78 * b, 0.66 * b, 0.3 * b);
  }
  partGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  partGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const partMat = new THREE.PointsMaterial({ size: mobileMode ? 0.06 : 0.04, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Mouse tracking: desktop only
  let targX = 0, targY = 0, currX = 0, currY = 0;
  if (!mobileMode) {
    window.addEventListener('mousemove', e => {
      targX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targY = -(e.clientY / window.innerHeight - 0.5) * 0.4;
    });
  }

  // Pause when canvas off-screen (saves battery on mobile)
  let isVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { isVisible = entries[0].isIntersecting; }, { threshold: 0.05 }).observe(canvas);
  }

  let t = 0;
  let lastFrame = 0;
  const targetFPS = mobileMode ? 30 : 60;
  const frameDelta = 1000 / targetFPS;

  function animate(now) {
    requestAnimationFrame(animate);
    if (!isVisible) return; // pause when off-screen
    if (now - lastFrame < frameDelta) return; // throttle to target FPS
    lastFrame = now;

    t += mobileMode ? 0.008 : 0.016;
    currX += (targX - currX) * 0.04;
    currY += (targY - currY) * 0.04;
    scene.rotation.y = currX;
    scene.rotation.x = currY;
    objects.forEach(o => {
      o.g.position.y += Math.sin(t * o.spd) * o.amp * 0.01;
      o.g.rotation.y += o.rot;
    });
    particles.rotation.y = t * (mobileMode ? 0.008 : 0.02);
    renderer.render(scene, cam);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ── GSAP SCROLL REVEAL ──
document.addEventListener('DOMContentLoaded', () => {
  if (isMobile) {
    // On mobile make everything visible immediately - no scroll reveal lag
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('visible'),
        once: true
      });
    });
  }
});
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(), 500); // give time for nested iframes/images
  }
});

// ── FLOATING PARTICLES DOM (desktop only) ──
if (!isMobile) {
  for (let i = 0; i < 18; i++) {
    const pd = document.createElement('div');
    pd.className = 'particle';
    const sz = Math.random() * 3 + 1;
    pd.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}vw;animation-duration:${Math.random() * 20 + 15}s;animation-delay:${Math.random() * 15}s;opacity:${Math.random() * 0.4 + 0.1}`;
    document.body.appendChild(pd);
  }
}

// ── HERO PARALLAX (desktop only) ──
if (!isMobile) {
  window.addEventListener('scroll', () => {
    const y = scrollY;
    const hero = document.getElementById('hero-content');
    if (hero) hero.style.transform = `translateY(${y * 0.3}px)`;
    const canvas = document.getElementById('three-canvas');
    if (canvas) canvas.style.transform = `translateY(${y * 0.15}px)`;
  });
}

async function handleReserveForm(e) {
  e.preventDefault();
  const btn = document.getElementById('res-submit-btn');

  const name = document.getElementById('res-name').value;
  const phone = document.getElementById('res-phone').value;
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;
  const guests = document.getElementById('res-guests').value;
  const requests = document.getElementById('res-requests').value;

  try {
    btn.innerHTML = '<span>Processing...</span>';
    const res = await fetch('/api/reserve', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, date, time, guests, requests })
    });

    if (res.ok) {
      btn.innerHTML = '<span>✦ Reservation Confirmed</span>';
      btn.style.background = 'var(--gold)';
      btn.style.color = 'var(--black)';
      e.target.reset();
    } else {
      btn.innerHTML = '<span>Error - Try Again</span>';
    }
  } catch (err) {
    console.error(err);
    btn.innerHTML = '<span>Error - Try Again</span>';
  }
}

// ── MENU TAB CLICK  ──
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    const cat = this.dataset.cat;
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => {
      const show = item.dataset.cat === cat;
      if (show) {
        item.style.display = 'block';
        if (typeof gsap !== 'undefined') gsap.to(item, { opacity: 1, scale: 1, duration: 0.4 });
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── LOAD MODAL DYNAMIC MENU ──
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding: 4rem; grid-column:1/-1; font-size:1.2rem;">Loading dynamic menu from Unsplash...</div>';

  try {
    const res = await fetch('/api/menu', { cache: 'no-store' });
    const items = await res.json();
    grid.innerHTML = '';

    items.forEach((item, index) => {
      const displayPrice = isNaN(item.price) ? `₹ ${item.price}` : `₹ ${item.price}`;
      const div = document.createElement('div');
      div.className = 'menu-item menu-border reveal reveal-delay-' + (index % 3);
      div.dataset.cat = item.cat;
      div.onclick = () => openModal(item);
      
      // Hide non-biryani items by default since "All" is removed
      if (item.cat !== 'biryani') {
        div.style.display = 'none';
      }

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="console.error('Failed to load image for ${item.name}: ' + this.src); this.onerror=null; this.src='https://images.unsplash.com/photo-1414235077428-338988692140?w=400&q=80';">
        <div class="menu-item-overlay">
          <div class="menu-item-info">
            <span class="menu-item-name">${item.name}</span>
            <div class="menu-item-price">${displayPrice}</div>
          </div>
        </div>
      `;
      grid.appendChild(div);
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  } catch (e) {
    grid.innerHTML = '<div style="text-align:center;color:red;grid-column:1/-1;">Failed to load dynamic menu.</div>';
  }
});

let currentModalItem = null;

function openModal(item) {
  currentModalItem = item;
  const displayPrice = isNaN(item.price) ? `₹ ${item.price}` : `₹ ${item.price}`;
  const modalImg = document.getElementById('modal-img');
  modalImg.src = item.image;
  modalImg.onerror = function() {
    console.error('Failed to load image for modal: ' + this.src);
    this.onerror = null;
    this.src = 'https://images.unsplash.com/photo-1414235077428-338988692140?w=400&q=80';
  };
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-price').textContent = displayPrice;
  document.getElementById('item-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('item-modal').classList.remove('active');
  currentModalItem = null;
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('item-modal');
  if (e.target === modal || e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

function initGlow() {
  const goldGlow = document.createElement('div');
  goldGlow.style.cssText = 'position:fixed;width:400px;height:400px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(201,168,76,0.04),transparent);transform:translate(-50%,-50%);transition:left 0.8s,top 0.8s;';
  document.body.appendChild(goldGlow);
  window.addEventListener('mousemove', e => { goldGlow.style.left = e.clientX + 'px'; goldGlow.style.top = e.clientY + 'px'; });
}
initGlow();

// ── CART & CHECKOUT ──
let cart = [];

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('active');
  document.getElementById('cart-overlay').classList.toggle('active');
}

function addToCartFromModal() {
  if (!currentModalItem) return;
  // Handle price string, extracting numbers roughly
  const priceStr = String(currentModalItem.price).replace(/[^0-9]/g, '');
  const priceNum = parseInt(priceStr) || 0;
  
  cart.push({ ...currentModalItem, numPrice: priceNum });
  updateCartUI();
  closeModal();
  
  // Show sidebar automatically when adding
  document.getElementById('cart-sidebar').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotalPrice = document.getElementById('cart-total-price');
  
  cartBadge.textContent = `(${cart.length})`;
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  cart.forEach((item, index) => {
    total += item.numPrice;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1414235077428-338988692140?w=400&q=80';">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹ ${item.numPrice}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  
  cartTotalPrice.textContent = `₹ ${total}`;
}

async function handleCheckout(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  
  const btn = document.getElementById('checkout-btn');
  const name = document.getElementById('checkout-name').value;
  const phone = document.getElementById('checkout-phone').value;
  const address = document.getElementById('checkout-address').value;
  
  let total = 0;
  cart.forEach(item => total += item.numPrice);

  try {
    btn.innerHTML = '<span>Processing...</span>';
    const res = await fetch('/api/orders', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address, items: cart, total })
    });

    if (res.ok) {
      btn.innerHTML = '<span>Order Placed!</span>';
      btn.style.background = 'var(--gold)';
      btn.style.color = 'var(--black)';
      e.target.reset();
      
      setTimeout(() => {
        // WhatsApp integration
        let waText = `*New Order from ${name}* %0A`;
        waText += `Phone: ${phone} %0AAddress: ${address}%0A%0A*Items:*%0A`;
        cart.forEach(item => { waText += `- ${item.name} (₹${item.numPrice})%0A`; });
        waText += `%0A*Total:* ₹${total}`;
        
        window.open(`https://wa.me/910837106293?text=${waText}`, '_blank');
        
        cart = [];
        updateCartUI();
        toggleCart();
        btn.innerHTML = '<span>Place Order (COD)</span>';
        btn.style.background = '';
        btn.style.color = '';
      }, 1000);
    } else {
      btn.innerHTML = '<span>Error - Try Again</span>';
    }
  } catch (err) {
    console.error(err);
    btn.innerHTML = '<span>Error - Try Again</span>';
  }
}

function fetchLocation() {
  const addressField = document.getElementById('checkout-address');
  
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  
  const originalValue = addressField.value.trim();
  addressField.value = "📍 Fetching your current location... Please allow access if prompted.";
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const gmapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
      
      const locationText = `📍 Current Location Link: ${gmapsLink}`;
      
      if (originalValue !== '' && !originalValue.startsWith('📍 Fetching')) {
        addressField.value = `${originalValue}\n\n${locationText}`;
      } else {
        addressField.value = `${locationText}\n\n`;
      }
    },
    (error) => {
      console.error(error);
      alert("Unable to retrieve your location. Please ensure location access is allowed in your browser settings.");
      addressField.value = originalValue !== '📍 Fetching your current location... Please allow access if prompted.' ? originalValue : '';
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// ── AI CHATBOT ──
function toggleChat() {
  document.getElementById('chat-window').classList.toggle('active');
  const overlay = document.getElementById('chat-overlay');
  if (overlay) overlay.classList.toggle('active');
  const fab = document.getElementById('chat-fab');
  if (fab) fab.classList.toggle('chat-open');
}

async function sendChat() {
  if (sendChat._busy) return; // debounce: block if already waiting for a reply
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  sendChat._busy = true;

  const chatBody = document.getElementById('chat-body');
  
  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user-msg';
  userDiv.textContent = msg;
  chatBody.appendChild(userDiv);
  
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // AI Loading
  const aiDiv = document.createElement('div');
  aiDiv.className = 'chat-msg ai-msg';
  aiDiv.textContent = 'Thinking...';
  chatBody.appendChild(aiDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    aiDiv.innerHTML = data.reply.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<b>$1</b>');
  } catch (err) {
    aiDiv.textContent = 'Oops! Something went wrong. Try again.';
  } finally {
    sendChat._busy = false; // release debounce
  }
  
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ── REVIEW MODAL ──
function openReviewModal() {
  document.getElementById('review-modal').classList.add('active');
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.remove('active');
}

function setRating(rating) {
  document.getElementById('rev-rating').value = rating;
  const stars = document.getElementById('rev-stars').children;
  for(let i = 0; i < stars.length; i++) {
    stars[i].style.opacity = i < rating ? '1' : '0.3';
  }
}

function submitReview(e) {
  e.preventDefault();
  alert('Thank you! Your review has been submitted for moderation.');
  closeReviewModal();
  e.target.reset();
  setRating(5);
}
