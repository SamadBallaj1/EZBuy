import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const products = [
  // ELECTRONICS (category_id: 1)
  { name: "MacBook Air M2", category: 1, description: "Lightweight laptop perfect for students", specs: "13.6-inch • M2 chip • 8GB RAM • 256GB SSD", price: 1199.99, student_price: 839.99, image_url: "/assets/macbook.jpg", colors: ["Space Gray", "Silver", "Starlight", "Midnight"], stock: 25 },
  { name: "iPad Air", category: 1, description: "Versatile tablet for note-taking", specs: "10.9-inch • M1 chip • 64GB", price: 599.99, student_price: 419.99, image_url: "/assets/ipad.jpg", colors: ["Space Gray", "Starlight", "Pink"], stock: 40 },
  { name: "27-inch 4K Monitor", category: 1, description: "High-resolution display", specs: "4K UHD • IPS • 60Hz • USB-C", price: 349.99, student_price: 244.99, image_url: "/assets/monitor.jpg", colors: ["Black"], stock: 30 },
  { name: "Smart Watch Fitness Tracker", category: 1, description: "Track workouts and stay connected", specs: "Heart Rate • GPS • 5 ATM • 7 Days Battery", price: 149.99, student_price: 104.99, image_url: "/assets/smartwatch.jpg", colors: ["Black", "Silver"], stock: 55 },
  { name: "Drawing Tablet", category: 1, description: "Digital drawing pad for artists", specs: "10x6 inch • 8192 Pressure Levels", price: 79.99, student_price: 55.99, image_url: "/assets/drawing-tablet.jpg", colors: ["Black"], stock: 40 },
  { name: "Webcam HD 1080p", category: 1, description: "HD webcam for video calls", specs: "1080p • Auto Focus • Built-in Mic", price: 49.99, student_price: 34.99, image_url: "/assets/webcam.jpg", colors: ["Black"], stock: 75 },
  { name: "E-Reader 6-inch", category: 1, description: "Digital book reader", specs: "6-inch • Glare-Free • 8GB • Weeks Battery", price: 89.99, student_price: 62.99, image_url: "/assets/ereader.jpg", colors: ["Black"], stock: 40 },
  { name: "Mini Projector", category: 1, description: "Portable projector", specs: "1080p Support • HDMI/USB • Built-in Speaker", price: 129.99, student_price: 90.99, image_url: "/assets/projector.jpg", colors: ["White"], stock: 30 },
  { name: "Streaming Light Panel", category: 1, description: "RGB lighting for content creation", specs: "RGB • App Control • Music Sync", price: 79.99, student_price: 55.99, image_url: "/assets/light-panel.jpg", colors: ["Black"], stock: 50 },
  { name: "Document Scanner Portable", category: 1, description: "Scan documents on the go", specs: "600 DPI • Auto-Crop • PDF/JPG", price: 89.99, student_price: 62.99, image_url: "/assets/scanner.jpg", colors: ["Black"], stock: 35 },

  // ACCESSORIES (category_id: 2)
  { name: "Logitech MX Master 3S", category: 2, description: "Ergonomic wireless mouse", specs: "Wireless • 8000 DPI • USB-C Charging", price: 99.99, student_price: 69.99, image_url: "/assets/mx-master.jpg", colors: ["Black", "Gray"], stock: 60 },
  { name: "Mechanical Keyboard RGB", category: 2, description: "Tactile typing experience", specs: "RGB Backlight • Blue Switches • USB-C", price: 129.99, student_price: 90.99, image_url: "/assets/keyboard.jpg", colors: ["Black", "White"], stock: 45 },
  { name: "Portable SSD 1TB", category: 2, description: "Fast external storage", specs: "1TB • USB 3.2 • 1050 MB/s", price: 89.99, student_price: 62.99, image_url: "/assets/ssd.jpg", colors: ["Black", "Blue"], stock: 70 },
  { name: "Wireless Charger Stand", category: 2, description: "Charge devices wirelessly", specs: "15W Fast Charge • Foldable • LED", price: 44.99, student_price: 31.49, image_url: "/assets/wireless-charger.jpg", colors: ["Black", "White"], stock: 85 },
  { name: "Power Bank 20000mAh", category: 2, description: "High-capacity portable charger", specs: "20000mAh • 22.5W Fast Charge • LED Display", price: 39.99, student_price: 27.99, image_url: "/assets/power-bank.jpg", colors: ["Black", "White"], stock: 110 },
  { name: "Wireless Mouse Slim", category: 2, description: "Silent clicks for quiet environments", specs: "Wireless • Silent Click • 1600 DPI", price: 24.99, student_price: 17.49, image_url: "/assets/mouse.jpg", colors: ["Black", "Silver"], stock: 130 },
  { name: "Phone Stand Adjustable", category: 2, description: "Hands-free viewing", specs: "Foldable • 270° Rotation • Anti-Slip", price: 14.99, student_price: 10.49, image_url: "/assets/phone-stand.jpg", colors: ["Black", "White"], stock: 150 },
  { name: "USB Flash Drive 128GB", category: 2, description: "Portable storage", specs: "128GB • USB 3.0 • Metal Casing", price: 19.99, student_price: 13.99, image_url: "/assets/usb-drive.jpg", colors: ["Silver", "Black"], stock: 160 },
  { name: "HDMI Cable 6ft", category: 2, description: "High-speed cable", specs: "6ft • 4K 60Hz • Gold-Plated • Braided", price: 12.99, student_price: 9.09, image_url: "/assets/hdmi-cable.jpg", colors: ["Black"], stock: 140 },
  { name: "Laptop Sleeve 13-inch", category: 2, description: "Protective case for laptops", specs: "13-inch • Water-Resistant • Soft Interior", price: 24.99, student_price: 17.49, image_url: "/assets/laptop-sleeve.jpg", colors: ["Gray", "Black"], stock: 120 },
  { name: "Backpack with USB Port", category: 2, description: "Anti-theft laptop backpack", specs: "USB Charging Port • Water-Resistant • 15.6-inch", price: 49.99, student_price: 34.99, image_url: "/assets/backpack.jpg", colors: ["Black", "Gray"], stock: 80 },
  { name: "Laptop Stand Aluminum", category: 2, description: "Ergonomic stand for better posture", specs: "Aluminum • Adjustable Height • Heat Dissipation", price: 39.99, student_price: 27.99, image_url: "/assets/laptop-stand.jpg", colors: ["Silver"], stock: 65 },
  { name: "USB Hub 7-Port", category: 2, description: "Expand connectivity options", specs: "7 Ports • USB 3.0 • LED Indicators", price: 24.99, student_price: 17.49, image_url: "/assets/usb-hub.jpg", colors: ["Black", "White"], stock: 90 },
  { name: "Portable Laptop Cooler", category: 2, description: "Prevent overheating", specs: "2 Fans • Adjustable Height • USB Powered", price: 29.99, student_price: 20.99, image_url: "/assets/laptop-cooler.jpg", colors: ["Black"], stock: 70 },
  { name: "Bluetooth Keyboard", category: 2, description: "Compact wireless keyboard", specs: "Bluetooth • Rechargeable • Ultra-Slim", price: 39.99, student_price: 27.99, image_url: "/assets/bluetooth-keyboard.jpg", colors: ["White", "Black"], stock: 80 },
  { name: "Laptop Privacy Screen", category: 2, description: "Protect sensitive information", specs: "14-inch • Anti-Glare • Blue Light Filter", price: 29.99, student_price: 20.99, image_url: "/assets/privacy-screen.jpg", colors: ["Black"], stock: 55 },
  { name: "Wireless Charging Pad", category: 2, description: "Fast wireless charging", specs: "15W Fast Charge • LED Indicator • Non-Slip", price: 19.99, student_price: 13.99, image_url: "/assets/charging-pad.jpg", colors: ["Black", "White"], stock: 100 },
  { name: "Presentation Clicker", category: 2, description: "Remote control for presentations", specs: "Wireless • 100ft Range • Plug & Play • Red Laser", price: 19.99, student_price: 13.99, image_url: "/assets/clicker.jpg", colors: ["Black"], stock: 65 },
  { name: "Cable Organizer", category: 2, description: "Keep cables tidy", specs: "Silicone • 10-piece Set • Multiple Sizes", price: 12.99, student_price: 9.09, image_url: "/assets/cable-organizer.jpg", colors: ["Black", "Gray"], stock: 180 },
  { name: "Screen Protector", category: 2, description: "Protect device screen", specs: "9H Hardness • Anti-Fingerprint • 2-Pack", price: 9.99, student_price: 6.99, image_url: "/assets/screen-protector.jpg", colors: ["Clear"], stock: 220 },
  { name: "Wrist Rest", category: 2, description: "Comfortable support for typing", specs: "Memory Foam • Non-Slip Base • Keyboard Size", price: 16.99, student_price: 11.89, image_url: "/assets/wrist-rest.jpg", colors: ["Black", "Gray"], stock: 100 },
  { name: "Portable SSD 2TB", category: 2, description: "Ultra-fast external storage", specs: "2TB • USB 3.2 • 1050 MB/s • Rugged Design", price: 159.99, student_price: 111.99, image_url: "/assets/ssd-2tb.jpg", colors: ["Black", "Blue"], stock: 35 },

  // AUDIO (category_id: 3)
  { name: "AirPods Pro", category: 3, description: "Active noise cancellation", specs: "Wireless • ANC • Transparency Mode • 6h Battery", price: 249.99, student_price: 174.99, image_url: "/assets/airpods-pro.jpg", colors: ["White"], stock: 100 },
  { name: "Noise Cancelling Headphones", category: 3, description: "Premium over-ear headphones", specs: "40h Battery • ANC • Bluetooth 5.0 • Foldable", price: 299.99, student_price: 209.99, image_url: "/assets/headphones.jpg", colors: ["Black", "Silver"], stock: 50 },
  { name: "Bluetooth Speaker Portable", category: 3, description: "Powerful sound in compact design", specs: "20W • 12h Battery • IPX7 Waterproof", price: 59.99, student_price: 41.99, image_url: "/assets/speaker.jpg", colors: ["Black", "Blue", "Red"], stock: 75 },
  { name: "Earbuds Wireless", category: 3, description: "True wireless earbuds", specs: "Bluetooth 5.0 • 24h Total • Touch Control • IPX5", price: 49.99, student_price: 34.99, image_url: "/assets/earbuds.jpg", colors: ["Black", "White"], stock: 120 },
  { name: "USB Microphone", category: 3, description: "Studio-quality recording", specs: "USB • Cardioid Pattern • Pop Filter • Shock Mount", price: 69.99, student_price: 48.99, image_url: "/assets/microphone.jpg", colors: ["Black"], stock: 45 },
  { name: "Blue Yeti Microphone", category: 3, description: "Professional USB microphone", specs: "USB • Multiple Patterns • Mute Button • Headphone Jack", price: 129.99, student_price: 90.99, image_url: "/assets/blue-yeti.jpg", colors: ["Black", "Silver"], stock: 35 },

  // FASHION (category_id: 4)
  { name: "Blue Light Glasses", category: 4, description: "Reduce eye strain from screens", specs: "UV Protection • Lightweight • Clear Lens • Anti-Glare", price: 24.99, student_price: 17.49, image_url: "/assets/blue-light-glasses.jpg", colors: ["Black", "Tortoise"], stock: 95 },
  { name: "Student Hoodie", category: 4, description: "Comfortable hoodie for campus", specs: "Cotton Blend • Drawstring Hood • Kangaroo Pocket", price: 39.99, student_price: 27.99, image_url: "/assets/hoodie.jpg", colors: ["Black", "Gray", "Navy"], stock: 75 },
  { name: "Canvas Tote Bag", category: 4, description: "Eco-friendly tote for books", specs: "Heavy Canvas • 15-inch Laptop Fit • Interior Pocket", price: 19.99, student_price: 13.99, image_url: "/assets/tote.jpg", colors: ["Natural", "Black"], stock: 100 },

  // HOME & KITCHEN (category_id: 5)
  { name: "LED Desk Lamp", category: 5, description: "Adjustable lighting for studying", specs: "Touch Control • 5 Brightness • USB Port • Eye-Care", price: 34.99, student_price: 24.49, image_url: "/assets/desk-lamp.jpg", colors: ["White", "Black"], stock: 95 },
  { name: "Ring Light 10-inch", category: 5, description: "Perfect lighting for video calls", specs: "10-inch • Dimmable • 3 Color Modes • Phone Holder", price: 34.99, student_price: 24.49, image_url: "/assets/ring-light.jpg", colors: ["Black", "White"], stock: 60 },
  { name: "Desktop Organizer", category: 5, description: "Keep desk tidy", specs: "Bamboo • 6 Compartments • Phone Holder • Eco-Friendly", price: 34.99, student_price: 24.49, image_url: "/assets/desk-organizer.jpg", colors: ["Natural Wood"], stock: 70 },
  { name: "Cable Management Box", category: 5, description: "Hide and organize cables", specs: "Large Size • Ventilation Holes • Non-Slip Feet", price: 22.99, student_price: 16.09, image_url: "/assets/cable-box.jpg", colors: ["White", "Black"], stock: 80 },
  { name: "Surge Protector 12 Outlet", category: 5, description: "Power strip with USB ports", specs: "12 AC + 4 USB • 6ft Cord • Overload Protection", price: 29.99, student_price: 20.99, image_url: "/assets/surge-protector.jpg", colors: ["Black", "White"], stock: 85 },

  // COFFEE & DRINKS (category_id: 6)
  { name: "Insulated Coffee Mug", category: 6, description: "Keep drinks hot for hours", specs: "20oz • Stainless Steel • Leak-Proof Lid • 6h Hot", price: 24.99, student_price: 17.49, image_url: "/assets/coffee-mug.jpg", colors: ["Black", "Silver", "Rose Gold"], stock: 120 },
  { name: "Electric Kettle", category: 6, description: "Fast boiling for coffee & tea", specs: "1.7L • Auto Shutoff • Boil-Dry Protection • 1500W", price: 34.99, student_price: 24.49, image_url: "/assets/kettle.jpg", colors: ["Black", "White"], stock: 45 },
  { name: "French Press Coffee Maker", category: 6, description: "Brew perfect coffee", specs: "34oz • Borosilicate Glass • Stainless Steel", price: 29.99, student_price: 20.99, image_url: "/assets/french-press.jpg", colors: ["Silver"], stock: 55 },
  { name: "Reusable Water Bottle", category: 6, description: "Stay hydrated throughout the day", specs: "32oz • BPA-Free • Wide Mouth • Leak-Proof", price: 19.99, student_price: 13.99, image_url: "/assets/water-bottle.jpg", colors: ["Black", "Blue", "Pink"], stock: 150 },

  // STUDENT ESSENTIALS (category_id: 7)
  { name: "Smart Notebook Reusable", category: 7, description: "Digital notebook that syncs to cloud", specs: "Letter Size • Microwave to Erase • App Compatible", price: 34.99, student_price: 24.49, image_url: "/assets/smart-notebook.jpg", colors: ["Black"], stock: 75 },
  { name: "Webcam Cover Slider", category: 7, description: "Privacy protection for cameras", specs: "Ultra-Thin • Universal Fit • Pack of 3", price: 7.99, student_price: 5.59, image_url: "/assets/webcam-cover.jpg", colors: ["Black"], stock: 200 },
  { name: "Noise Cancelling Earplugs", category: 7, description: "Block out distractions while studying", specs: "Reusable • 32dB Reduction • Carrying Case", price: 14.99, student_price: 10.49, image_url: "/assets/earplugs.jpg", colors: ["Clear"], stock: 85 },
  { name: "Planner Academic", category: 7, description: "Stay organized throughout semester", specs: "12 Months • Weekly/Monthly Views • Goal Setting", price: 19.99, student_price: 13.99, image_url: "/assets/planner.jpg", colors: ["Black", "Navy", "Rose"], stock: 90 },
];

async function seedProducts() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding products...');
    
    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, category_id, description, specs, price, student_price, image_url, colors, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        product.name,
        product.category,
        product.description,
        product.specs,
        product.price,
        product.student_price,
        product.image_url,
        product.colors,
        product.stock
      ]);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Successfully seeded ${products.length} products across 7 categories!`);
    console.log('   - Electronics: 10 products');
    console.log('   - Accessories: 22 products');
    console.log('   - Audio: 6 products');
    console.log('   - Fashion: 3 products');
    console.log('   - Home & Kitchen: 5 products');
    console.log('   - Coffee & Drinks: 4 products');
    console.log('   - Student Essentials: 4 products');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding products:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedProducts();