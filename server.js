require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Gaowala AI"
  }
});

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mirror Netlify routing locally
app.all('/.netlify/functions/api', (req, res) => {
  const action = req.query.action;
  if (action) {
    req.url = `/api/${action}`;
    app.handle(req, res);
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

const dataFile = path.join(__dirname, 'data', 'reservations.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');

// Ensure data existence
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([]));
}

// Menu Items with valid Unsplash URLs
const menuItems = [
  // ── Biryani ──
  {
    id: 'br1', cat: 'biryani', name: 'Chicken Biryani', price: 250,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80'
  },
  {
    id: 'br2', cat: 'biryani', name: 'Mutton Biryani', price: 320,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80'
  },
  {
    id: 'br3', cat: 'biryani', name: 'Egg Biryani', price: 180,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80'
  },
  {
    id: 'br4', cat: 'biryani', name: 'Veg Biryani', price: 160,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80'
  },

  // ── Pizza ──
  {
    id: 'p1', cat: 'pizza', name: 'Chicken Overloaded Pizza', price: 290,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'
  },
  {
    id: 'p2', cat: 'pizza', name: 'Chicken Sausage Pizza', price: 260,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80'
  },
  {
    id: 'p3', cat: 'pizza', name: 'Chicken Tikka Pizza', price: 280,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ce?w=400&q=80'
  },
  {
    id: 'p4', cat: 'pizza', name: 'Margherita', price: 180,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80'
  },
  {
    id: 'p5', cat: 'pizza', name: 'Farmhouse Pizza', price: 240,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&q=80'
  },
  {
    id: 'p6', cat: 'pizza', name: 'Veg Loaded Pizza', price: 260,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&q=80'
  },

  // ── Starters ──
  {
    id: 's1', cat: 'starters', name: 'Hot & Spicy Wings', price: 180,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80'
  },
  {
    id: 's2', cat: 'starters', name: 'Crispy Chicken', price: 200,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80'
  },
  {
    id: 's3', cat: 'starters', name: 'Chicken Lollipop', price: 220,
    image: 'https://images.unsplash.com/photo-1569058242253-1df34b062b19?w=400&q=80'
  },
  {
    id: 's4', cat: 'starters', name: 'French Fries', price: 100,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80'
  },
  {
    id: 's5', cat: 'starters', name: 'Peri Peri Fries', price: 120,
    image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ce3b?w=400&q=80'
  },

  // ── Noodles & Pasta ──
  {
    id: 'n1', cat: 'noodles', name: 'Chicken Noodles', price: 180,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80'
  },
  {
    id: 'n2', cat: 'noodles', name: 'Veg Noodles', price: 150,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80'
  },
  {
    id: 'n3', cat: 'noodles', name: 'Chicken Pasta', price: 200,
    image: 'https://images.unsplash.com/photo-1621996316526-a070e1762bb9?w=400&q=80'
  },
  {
    id: 'n4', cat: 'noodles', name: 'White Sauce Pasta', price: 180,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80'
  },

  // ── Fast Food ──
  {
    id: 'f1', cat: 'fast', name: 'Chicken Burger', price: 120,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'
  },
  {
    id: 'f2', cat: 'fast', name: 'Veg Burger', price: 100,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80'
  },
  {
    id: 'f3', cat: 'fast', name: 'Sandwich (Veg)', price: 90,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80'
  },
  {
    id: 'f4', cat: 'fast', name: 'Sandwich (Chicken)', price: 120,
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&q=80'
  },

  // ── Main Course ──
  {
    id: 'm1', cat: 'main', name: 'Chicken Curry + Rice', price: 180,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80'
  },
  {
    id: 'm2', cat: 'main', name: 'Egg Curry + Rice', price: 140,
    image: 'https://images.unsplash.com/photo-1589131653556-9b5ef6fb75f1?w=400&q=80'
  },
  {
    id: 'm3', cat: 'main', name: 'Veg Thali', price: 120,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&q=80'
  },

  // ── Beverages ──
  {
    id: 'b1', cat: 'beverages', name: 'Cold Drinks', price: '40-60',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'
  },
  {
    id: 'b2', cat: 'beverages', name: 'Coffee', price: 50,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80'
  },
  {
    id: 'b3', cat: 'beverages', name: 'Tea', price: 20,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80'
  },
  {
    id: 'b4', cat: 'beverages', name: 'Blue Lagoon Mocktail', price: 120,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'
  },
  {
    id: 'b5', cat: 'beverages', name: 'Virgin Mojito', price: 100,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80'
  },
  {
    id: 'b6', cat: 'beverages', name: 'Mango Mocktail', price: 110,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b62?w=400&q=80'
  },
  {
    id: 'b7', cat: 'beverages', name: 'Strawberry Mocktail', price: 115,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
  },

  // ── Specials ──
  {
    id: 'sp1', cat: 'specials', name: 'Chicken Combo Meals', price: '250-300',
    image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80'
  },
  {
    id: 'sp2', cat: 'specials', name: 'BBQ Chicken Items', price: '220+',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'
  },
  {
    id: 'sp3', cat: 'specials', name: 'Special Chicken Fry', price: 200,
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb65ed?w=400&q=80'
  }
];

// ── GET /api/menu — returns menu items with images instantly (no external API calls) ──
app.get('/api/menu', (req, res) => {
  try {
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reserve', (req, res) => {
  const { name, phone, date, time, guests, requests } = req.body;
  if (!name || !phone || !date || !time || !guests) return res.status(400).json({ error: 'Missing required fields' });
  const reservation = { id: Date.now().toString(), name, phone, date, time, guests, requests, status: 'Confirmed', createdAt: new Date().toISOString() };
  try {
    const fileData = fs.readFileSync(dataFile, 'utf8');
    const reservations = JSON.parse(fileData);
    reservations.push(reservation);
    fs.writeFileSync(dataFile, JSON.stringify(reservations, null, 2));
    res.status(201).json({ message: 'Reservation confirmed', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', (req, res) => {
  const { name, phone, address, items, total } = req.body;
  if (!name || !phone || !address || !items || !items.length) return res.status(400).json({ error: 'Missing required fields' });
  const order = { id: Date.now().toString(), name, phone, address, items, total, status: 'Pending', createdAt: new Date().toISOString() };
  try {
    const fileData = fs.readFileSync(ordersFile, 'utf8');
    const orders = JSON.parse(fileData);
    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: 'Order Placed', order });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'Please ask me something!' });

  const aiPrompt = `You are an intelligent AI assistant for গাঁও bala Cafe & Restaurant.

Your goal is to help users:
* Choose food items based on their preferences
* Recommend dishes from the menu
* Help build their order
* Assist in table booking
* Answer basic restaurant queries

Menu:
Pizza: Chicken Overloaded Pizza – ₹290, Chicken Sausage Pizza – ₹260, Chicken Tikka Pizza – ₹280, Margherita – ₹180, Farmhouse Pizza – ₹240, Veg Loaded Pizza – ₹260
Starters: Hot & Spicy Wings – ₹180, Crispy Chicken – ₹200, Chicken Lollipop – ₹220, French Fries – ₹100, Peri Peri Fries – ₹120
Noodles & Pasta: Chicken Noodles – ₹180, Veg Noodles – ₹150, Chicken Pasta – ₹200, White Sauce Pasta – ₹180
Fast Food: Chicken Burger – ₹120, Veg Burger – ₹100, Veg Sandwich – ₹90, Chicken Sandwich – ₹120
Main Course: Chicken Curry + Rice – ₹180, Egg Curry + Rice – ₹140, Veg Thali – ₹120
Biriyani: Chicken Biriyani – ₹180, Egg Biriyani – ₹140, Veg Biriyani – ₹120
Mocktails & Drinks: Virgin Mojito – ₹120, Blue Lagoon – ₹140, Mint Lemonade – ₹100, Fruit Punch – ₹150, Coffee – ₹50, Tea – ₹20

Instructions:
1. If user asks for recommendation: Suggest 2–3 items only. Always include price. Match their preference (spicy, veg, cheap, etc.).
2. If user says something like: "I want pizza" or "add wings": Respond with structured order suggestion.
3. If user wants to order: Format response like: Item Name – Quantity – Price.
4. If user wants table booking: Ask for missing details (name, phone, date, time, guests, special requests). Guide them to use the reserve section if needed.
5. Keep responses: Short, Friendly, Clear. Note: We use \`*\` instead of \`**\` or Markdown asterisks for formatting bold text, write cleanly.
6. Never give irrelevant answers. Always stay focused on restaurant context.
7. CRITICAL RULE: You are EXCLUSIVELY an AI for গাঁও bala Cafe. NEVER provide external information. NEVER answer questions unrelated to food, dining, or গাঁও bala. If asked about code, weather, history, or anything else outside the restaurant context, politely decline.

Tone: Friendly, helpful, fast, like a smart restaurant assistant.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash", 
      max_tokens: 500,
      messages: [
        { role: "system", content: aiPrompt },
        { role: "user", content: message }
      ],
    });
    
    return res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error.message);
    
    // Algorithmic Fallback to guarantee a response
    const msg = message.toLowerCase();
    const numbers = msg.match(/\d+/g);
    let budget = 0;
    if (numbers) {
        for(let n of numbers) {
            if (parseInt(n) >= 100) budget = parseInt(n);
        }
    }
    
    if (budget >= 100) {
      return res.json({ reply: `Fallback system activated! For ₹${budget}, I suggest grabbing our Hot & Spicy Wings (₹180) and a Mocktail (₹120).`});
    }

    return res.json({ reply: "I'm having a connection issue! However, I always recommend our Chicken Biryani (₹180). Let me know your budget!" });
  }
});

app.get('/api/admin/bookings', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
});

app.get('/api/admin/orders', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`গাঁও bala Backend Server running at http://localhost:${port}`));
