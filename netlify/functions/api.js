const { OpenAI } = require('openai');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY || process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://gauwala.netlify.app",
    "X-Title": "Gaowala AI"
  }
});

const menuItems = [
  { id: 'br1', cat: 'biryani', name: 'Chicken Biryani', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
  { id: 'br2', cat: 'biryani', name: 'Mutton Biryani', price: 320, image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80' },
  { id: 'br3', cat: 'biryani', name: 'Egg Biryani', price: 180, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80' },
  { id: 'br4', cat: 'biryani', name: 'Veg Biryani', price: 160, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 'p1', cat: 'pizza', name: 'Chicken Overloaded Pizza', price: 290, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { id: 'p2', cat: 'pizza', name: 'Chicken Sausage Pizza', price: 260, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
  { id: 'p3', cat: 'pizza', name: 'Chicken Tikka Pizza', price: 280, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ce?w=400&q=80' },
  { id: 'p4', cat: 'pizza', name: 'Margherita', price: 180, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
  { id: 'p5', cat: 'pizza', name: 'Farmhouse Pizza', price: 240, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&q=80' },
  { id: 'p6', cat: 'pizza', name: 'Veg Loaded Pizza', price: 260, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&q=80' },
  { id: 's1', cat: 'starters', name: 'Hot & Spicy Wings', price: 180, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80' },
  { id: 's2', cat: 'starters', name: 'Crispy Chicken', price: 200, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80' },
  { id: 's3', cat: 'starters', name: 'Chicken Lollipop', price: 220, image: 'https://images.unsplash.com/photo-1569058242253-1df34b062b19?w=400&q=80' },
  { id: 's4', cat: 'starters', name: 'French Fries', price: 100, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80' },
  { id: 's5', cat: 'starters', name: 'Peri Peri Fries', price: 120, image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ce3b?w=400&q=80' },
  { id: 'n1', cat: 'noodles', name: 'Chicken Noodles', price: 180, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80' },
  { id: 'n2', cat: 'noodles', name: 'Veg Noodles', price: 150, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80' },
  { id: 'n3', cat: 'noodles', name: 'Chicken Pasta', price: 200, image: 'https://images.unsplash.com/photo-1621996316526-a070e1762bb9?w=400&q=80' },
  { id: 'n4', cat: 'noodles', name: 'White Sauce Pasta', price: 180, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80' },
  { id: 'f1', cat: 'fast', name: 'Chicken Burger', price: 120, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 'f2', cat: 'fast', name: 'Veg Burger', price: 100, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { id: 'f3', cat: 'fast', name: 'Sandwich (Veg)', price: 90, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
  { id: 'f4', cat: 'fast', name: 'Sandwich (Chicken)', price: 120, image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&q=80' },
  { id: 'm1', cat: 'main', name: 'Chicken Curry + Rice', price: 180, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80' },
  { id: 'm2', cat: 'main', name: 'Egg Curry + Rice', price: 140, image: 'https://images.unsplash.com/photo-1589131653556-9b5ef6fb75f1?w=400&q=80' },
  { id: 'm3', cat: 'main', name: 'Veg Thali', price: 120, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&q=80' },
  { id: 'b1', cat: 'beverages', name: 'Cold Drinks', price: '40-60', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80' },
  { id: 'b2', cat: 'beverages', name: 'Coffee', price: 50, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80' },
  { id: 'b3', cat: 'beverages', name: 'Tea', price: 20, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80' },
  { id: 'b4', cat: 'beverages', name: 'Blue Lagoon Mocktail', price: 120, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
  { id: 'b5', cat: 'beverages', name: 'Virgin Mojito', price: 100, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80' },
  { id: 'b6', cat: 'beverages', name: 'Mango Mocktail', price: 110, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b62?w=400&q=80' },
  { id: 'b7', cat: 'beverages', name: 'Strawberry Mocktail', price: 115, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
  { id: 'sp1', cat: 'specials', name: 'Chicken Combo Meals', price: '250-300', image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80' },
  { id: 'sp2', cat: 'specials', name: 'BBQ Chicken Items', price: '220+', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 'sp3', cat: 'specials', name: 'Special Chicken Fry', price: 200, image: 'https://images.unsplash.com/photo-1626082896492-766af4eb65ed?w=400&q=80' }
];

exports.handler = async (event) => {
  const action = event.queryStringParameters.action;

  // Error handling wrapper
  try {
    switch (action) {
      case 'menu':
        if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menuItems)
        };

      case 'reserve':
        if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
        const resBody = JSON.parse(event.body || '{}');
        if (!resBody.name || !resBody.phone || !resBody.date || !resBody.time || !resBody.guests) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }
        // In a real database, we'd save it. For Netlify serverless, we mock success.
        const reservation = { ...resBody, id: Date.now().toString(), status: 'Confirmed', createdAt: new Date().toISOString() };
        return {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Reservation confirmed', reservation })
        };

      case 'orders':
        if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
        const orderBody = JSON.parse(event.body || '{}');
        if (!orderBody.name || !orderBody.phone || !orderBody.address || !orderBody.items || !orderBody.items.length) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }
        const order = { ...orderBody, id: Date.now().toString(), status: 'Pending', createdAt: new Date().toISOString() };
        return {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Order Placed', order })
        };

      case 'chat':
        if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
        const chatBody = JSON.parse(event.body || '{}');
        if (!chatBody.message) return { statusCode: 400, body: JSON.stringify({ reply: 'Please ask me something!' }) };

        const aiPrompt = `You are an intelligent AI assistant for গাঁও bala Cafe & Restaurant. \n\nYour goal is to help users: \n* Choose food items based on their preferences \n* Recommend dishes from the menu \n* Help build their order \n* Assist in table booking \n* Answer basic restaurant queries \n\nMenu: \nPizza: Chicken Overloaded Pizza – ₹290, Chicken Sausage Pizza – ₹260, Chicken Tikka Pizza – ₹280, Margherita – ₹180, Farmhouse Pizza – ₹240, Veg Loaded Pizza – ₹260 \nStarters: Hot & Spicy Wings – ₹180, Crispy Chicken – ₹200, Chicken Lollipop – ₹220, French Fries – ₹100, Peri Peri Fries – ₹120 \nNoodles & Pasta: Chicken Noodles – ₹180, Veg Noodles – ₹150, Chicken Pasta – ₹200, White Sauce Pasta – ₹180 \nFast Food: Chicken Burger – ₹120, Veg Burger – ₹100, Veg Sandwich – ₹90, Chicken Sandwich – ₹120 \nMain Course: Chicken Curry + Rice – ₹180, Egg Curry + Rice – ₹140, Veg Thali – ₹120 \nBiriyani: Chicken Biriyani – ₹180, Egg Biriyani – ₹140, Veg Biriyani – ₹120 \nMocktails & Drinks: Virgin Mojito – ₹120, Blue Lagoon – ₹140, Mint Lemonade – ₹100, Fruit Punch – ₹150, Coffee – ₹50, Tea – ₹20 \n\nInstructions: \n1. If user asks for recommendation: Suggest 2–3 items only. Always include price. Match their preference (spicy, veg, cheap, etc.). \n2. If user says something like: "I want pizza" or "add wings": Respond with structured order suggestion. \n3. If user wants to order: Format response like: Item Name – Quantity – Price. \n4. If user wants table booking: Ask for missing details (name, phone, date, time, guests, special requests). Guide them to use the reserve section if needed. \n5. Keep responses: Short, Friendly, Clear. Note: We use \`*\` instead of \`**\` or Markdown asterisks for formatting bold text, write cleanly. \n6. Never give irrelevant answers. Always stay focused on restaurant context. \n7. CRITICAL RULE: You are EXCLUSIVELY an AI for গাঁও bala Cafe. NEVER provide external information. NEVER answer questions unrelated to food, dining, or গাঁও bala. If asked about code, weather, history, or anything else outside the restaurant context, politely decline. \n\nTone: Friendly, helpful, fast, like a smart restaurant assistant.`;

        try {
          const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash",
            max_tokens: 500,
            messages: [
              { role: "system", content: aiPrompt },
              { role: "user", content: chatBody.message }
            ],
          });
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply: completion.choices[0].message.content })
          };
        } catch (error) {
          console.error("AI Error:", error.message);
          
          // Algorithmic Fallback to guarantee a response
          const msg = chatBody.message.toLowerCase();
          const numbers = msg.match(/\d+/g);
          let budget = 0;
          if (numbers) {
              for (let n of numbers) {
                  if (parseInt(n) >= 100) budget = parseInt(n);
              }
          }
          if (budget >= 100) {
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reply: `Fallback system activated! For ₹${budget}, I suggest grabbing our Hot & Spicy Wings (₹180) and a Mocktail (₹120).` })
            };
          }
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply: "I'm having a connection issue! However, I always recommend our Chicken Biryani (₹180). Let me know your budget!" })
          };
        }

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Endpoint not found' })
        };
    }
  } catch (err) {
    console.error("Serverless Function Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
