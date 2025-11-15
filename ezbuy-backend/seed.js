import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const products = [
  { name: "MacBook Air M2", category: "Electronics", description: "Lightweight laptop perfect for students with all-day battery life", specs: "13.6-inch • M2 chip • 8GB RAM • 256GB SSD", price: 1199.99, student_price: 839.99, image_url: "/assets/macbook.jpg", colors: ["Space Gray", "Silver", "Starlight", "Midnight"], stock: 25 },
  { name: "iPad Air", category: "Electronics", description: "Versatile tablet for note-taking and creative work", specs: "10.9-inch • M1 chip • 64GB", price: 599.99, student_price: 419.99, image_url: "/assets/ipad.jpg", colors: ["Space Gray", "Starlight", "Pink", "Purple", "Blue"], stock: 40 },
  { name: "AirPods Pro", category: "Audio", description: "Active noise cancellation for focused studying", specs: "Wireless • ANC • Transparency Mode • 6h Battery", price: 249.99, student_price: 174.99, image_url: "/assets/airpods-pro.jpg", colors: ["White"], stock: 100 },
  { name: "Logitech MX Master 3S", category: "Accessories", description: "Ergonomic wireless mouse for productivity", specs: "Wireless • 8000 DPI • USB-C Charging • Multi-device", price: 99.99, student_price: 69.99, image_url: "/assets/mx-master.jpg", colors: ["Black", "Pale Gray"], stock: 60 },
  { name: "Mechanical Keyboard RGB", category: "Accessories", description: "Tactile typing experience with customizable lighting", specs: "RGB Backlight • Blue Switches • USB-C • Hot-swappable", price: 129.99, student_price: 90.99, image_url: "/assets/keyboard.jpg", colors: ["Black", "White"], stock: 45 },
  { name: "27-inch 4K Monitor", category: "Electronics", description: "High-resolution display for multitasking and content creation", specs: "4K UHD • IPS • 60Hz • USB-C • Height Adjustable", price: 349.99, student_price: 244.99, image_url: "/assets/monitor.jpg", colors: ["Black"], stock: 30 },
  { name: "Portable SSD 1TB", category: "Accessories", description: "Fast external storage for backups and large files", specs: "1TB • USB 3.2 • 1050 MB/s • Compact Design", price: 89.99, student_price: 62.99, image_url: "/assets/ssd.jpg", colors: ["Black", "Blue"], stock: 70 },
  { name: "Noise Cancelling Headphones", category: "Audio", description: "Premium over-ear headphones with active noise cancellation", specs: "40h Battery • ANC • Bluetooth 5.0 • Foldable", price: 299.99, student_price: 209.99, image_url: "/assets/headphones.jpg", colors: ["Black", "Silver"], stock: 50 },
  { name: "Wireless Charger Stand", category: "Accessories", description: "Charge devices wirelessly", specs: "15W Fast Charge • Foldable • LED Indicator", price: 44.99, student_price: 31.49, image_url: "/assets/wireless-charger.jpg", colors: ["Black", "White"], stock: 85 },
  { name: "Smart Watch Fitness Tracker", category: "Electronics", description: "Track workouts and stay connected", specs: "Heart Rate • GPS • 5 ATM • 7 Days Battery", price: 149.99, student_price: 104.99, image_url: "/assets/smartwatch.jpg", colors: ["Black", "Silver", "Rose Gold"], stock: 55 },
  { name: "Bluetooth Speaker Portable", category: "Audio", description: "Powerful sound in a compact design", specs: "20W • 12h Battery • IPX7 Waterproof • TWS Pairing", price: 59.99, student_price: 41.99, image_url: "/assets/speaker.jpg", colors: ["Black", "Blue", "Red"], stock: 75 },
  { name: "Drawing Tablet", category: "Electronics", description: "Digital drawing pad for artists and designers", specs: "10x6 inch • 8192 Pressure Levels • 8 Shortcuts", price: 79.99, student_price: 55.99, image_url: "/assets/drawing-tablet.jpg", colors: ["Black"], stock: 40 },
  { name: "LED Desk Lamp", category: "Accessories", description: "Adjustable lighting for late-night studying", specs: "Touch Control • 5 Brightness • USB Port • Eye-Care", price: 34.99, student_price: 24.49, image_url: "/assets/desk-lamp.jpg", colors: ["White", "Black"], stock: 95 },
  { name: "Power Bank 20000mAh", category: "Accessories", description: "High-capacity portable charger", specs: "20000mAh • 22.5W Fast Charge • 3 Outputs • LED Display", price: 39.99, student_price: 27.99, image_url: "/assets/power-bank.jpg", colors: ["Black", "White"], stock: 110 },
  { name: "Wireless Mouse Slim", category: "Accessories", description: "Silent clicks for quiet study environments", specs: "Wireless • Silent Click • 1600 DPI • USB Receiver", price: 24.99, student_price: 17.49, image_url: "/assets/mouse.jpg", colors: ["Black", "Silver", "Rose Gold"], stock: 130 },
  { name: "Webcam Cover Slider", category: "Accessories", description: "Privacy protection for laptop cameras", specs: "Ultra-Thin • Universal Fit • Pack of 3", price: 7.99, student_price: 5.59, image_url: "/assets/webcam-cover.jpg", colors: ["Black"], stock: 200 },
  { name: "Phone Stand Adjustable", category: "Accessories", description: "Hands-free viewing for phones and tablets", specs: "Foldable • 270° Rotation • Anti-Slip • Portable", price: 14.99, student_price: 10.49, image_url: "/assets/phone-stand.jpg", colors: ["Black", "White", "Silver"], stock: 150 },
  { name: "USB Flash Drive 128GB", category: "Accessories", description: "Portable storage for files and documents", specs: "128GB • USB 3.0 • Metal Casing • Keychain Loop", price: 19.99, student_price: 13.99, image_url: "/assets/usb-drive.jpg", colors: ["Silver", "Black"], stock: 160 },
  { name: "HDMI Cable 6ft", category: "Accessories", description: "High-speed cable for monitors and TVs", specs: "6ft • 4K 60Hz • Gold-Plated • Braided", price: 12.99, student_price: 9.09, image_url: "/assets/hdmi-cable.jpg", colors: ["Black"], stock: 140 },
  { name: "Laptop Sleeve 13-inch", category: "Accessories", description: "Protective case for laptops", specs: "13-inch • Water-Resistant • Soft Interior • Front Pocket", price: 24.99, student_price: 17.49, image_url: "/assets/laptop-sleeve.jpg", colors: ["Gray", "Black", "Navy"], stock: 120 },
  { name: "Backpack with USB Port", category: "Accessories", description: "Anti-theft laptop backpack with charging port", specs: "USB Charging Port • Water-Resistant • 15.6-inch Laptop • Anti-Theft", price: 49.99, student_price: 34.99, image_url: "/assets/backpack.jpg", colors: ["Black", "Gray", "Navy"], stock: 80 },
  { name: "Laptop Stand Aluminum", category: "Accessories", description: "Ergonomic stand for better posture", specs: "Aluminum • Adjustable Height • Heat Dissipation • Universal", price: 39.99, student_price: 27.99, image_url: "/assets/laptop-stand.jpg", colors: ["Silver"], stock: 65 },
  { name: "USB Hub 7-Port", category: "Accessories", description: "Expand your connectivity options", specs: "7 Ports • USB 3.0 • LED Indicators • Compact Design", price: 24.99, student_price: 17.49, image_url: "/assets/usb-hub.jpg", colors: ["Black", "White"], stock: 90 },
  { name: "Webcam HD 1080p", category: "Electronics", description: "High-definition webcam for video calls", specs: "1080p • Auto Focus • Built-in Mic • Plug & Play", price: 49.99, student_price: 34.99, image_url: "/assets/webcam.jpg", colors: ["Black"], stock: 75 },
  { name: "Ring Light 10-inch", category: "Accessories", description: "Perfect lighting for video calls and content", specs: "10-inch • Dimmable • 3 Color Modes • Phone Holder", price: 34.99, student_price: 24.49, image_url: "/assets/ring-light.jpg", colors: ["Black", "White"], stock: 60 },
  { name: "Blue Light Glasses", category: "Accessories", description: "Reduce eye strain from screens", specs: "UV Protection • Lightweight • Clear Lens • Anti-Glare", price: 24.99, student_price: 17.49, image_url: "/assets/blue-light-glasses.jpg", colors: ["Black", "Tortoise"], stock: 95 },
  { name: "Portable Laptop Cooler", category: "Accessories", description: "Prevent overheating during intensive work", specs: "2 Fans • Adjustable Height • USB Powered • LED Lights", price: 29.99, student_price: 20.99, image_url: "/assets/laptop-cooler.jpg", colors: ["Black"], stock: 70 },
  { name: "Bluetooth Keyboard", category: "Accessories", description: "Compact wireless keyboard for tablets", specs: "Bluetooth • Rechargeable • Ultra-Slim • Multi-Device", price: 39.99, student_price: 27.99, image_url: "/assets/bluetooth-keyboard.jpg", colors: ["White", "Black"], stock: 80 },
  { name: "Earbuds Wireless", category: "Audio", description: "True wireless earbuds with charging case", specs: "Bluetooth 5.0 • 24h Total • Touch Control • IPX5", price: 49.99, student_price: 34.99, image_url: "/assets/earbuds.jpg", colors: ["Black", "White"], stock: 120 },
  { name: "Presentation Clicker", category: "Accessories", description: "Remote control for presentations", specs: "Wireless • 100ft Range • Plug & Play • Red Laser", price: 19.99, student_price: 13.99, image_url: "/assets/clicker.jpg", colors: ["Black"], stock: 65 },
  { name: "Document Scanner Portable", category: "Electronics", description: "Scan documents and photos on the go", specs: "600 DPI • Auto-Crop • PDF/JPG • Battery Powered", price: 89.99, student_price: 62.99, image_url: "/assets/scanner.jpg", colors: ["Black"], stock: 35 },
  { name: "Smart Notebook Reusable", category: "Accessories", description: "Digital notebook that syncs to cloud", specs: "Letter Size • Microwave to Erase • App Compatible", price: 34.99, student_price: 24.49, image_url: "/assets/smart-notebook.jpg", colors: ["Black"], stock: 75 },
  { name: "Surge Protector 12 Outlet", category: "Accessories", description: "Power strip with USB ports", specs: "12 AC + 4 USB • 6ft Cord • Overload Protection", price: 29.99, student_price: 20.99, image_url: "/assets/surge-protector.jpg", colors: ["Black", "White"], stock: 85 },
  { name: "Mini Projector", category: "Electronics", description: "Portable projector for presentations and movies", specs: "1080p Support • HDMI/USB • 50000h Lamp • Built-in Speaker", price: 129.99, student_price: 90.99, image_url: "/assets/projector.jpg", colors: ["White", "Black"], stock: 30 },
  { name: "Cable Management Box", category: "Accessories", description: "Hide and organize power cables", specs: "Large Size • Ventilation Holes • Non-Slip Feet", price: 22.99, student_price: 16.09, image_url: "/assets/cable-box.jpg", colors: ["White", "Black"], stock: 80 },
  { name: "E-Reader 6-inch", category: "Electronics", description: "Digital book reader with e-ink display", specs: "6-inch • Glare-Free • 8GB • Weeks Battery", price: 89.99, student_price: 62.99, image_url: "/assets/ereader.jpg", colors: ["Black"], stock: 40 },
  { name: "Laptop Privacy Screen", category: "Accessories", description: "Protect sensitive information in public", specs: "14-inch • Anti-Glare • Blue Light Filter • Easy Install", price: 29.99, student_price: 20.99, image_url: "/assets/privacy-screen.jpg", colors: ["Black"], stock: 55 },
  { name: "Wireless Charging Pad", category: "Accessories", description: "Fast wireless charging for phones", specs: "15W Fast Charge • LED Indicator • Non-Slip", price: 19.99, student_price: 13.99, image_url: "/assets/charging-pad.jpg", colors: ["Black", "White"], stock: 100 },
  { name: "Desktop Organizer", category: "Accessories", description: "Keep desk tidy with compartments", specs: "Bamboo • 6 Compartments • Phone Holder • Eco-Friendly", price: 34.99, student_price: 24.49, image_url: "/assets/desk-organizer.jpg", colors: ["Natural Wood"], stock: 70 },
  { name: "Streaming Light Panel", category: "Electronics", description: "RGB lighting for streaming and content creation", specs: "RGB • App Control • Music Sync • Mountable", price: 79.99, student_price: 55.99, image_url: "/assets/light-panel.jpg", colors: ["Black"], stock: 50 },
  { name: "Mechanical Gaming Keyboard", category: "Accessories", description: "Full-size keyboard with mechanical switches", specs: "RGB • Red Switches • Anti-Ghosting • Wrist Rest", price: 89.99, student_price: 62.99, image_url: "/assets/mech-keyboard.jpg", colors: ["Black"], stock: 45 },
  { name: "Webcam HD 1440p", category: "Electronics", description: "Crystal clear video for online classes", specs: "2K • Auto Focus • Dual Mic • Low Light Correction", price: 99.99, student_price: 69.99, image_url: "/assets/webcam-pro.jpg", colors: ["Black"], stock: 40 },
  { name: "Portable SSD 2TB", category: "Accessories", description: "Ultra-fast external storage", specs: "2TB • USB 3.2 • 1050 MB/s • Rugged Design", price: 159.99, student_price: 111.99, image_url: "/assets/ssd-2tb.jpg", colors: ["Black", "Blue"], stock: 35 },
  { name: "USB Microphone", category: "Audio", description: "Studio-quality recording for content creators", specs: "USB • Cardioid Pattern • Pop Filter • Shock Mount", price: 69.99, student_price: 48.99, image_url: "/assets/microphone.jpg", colors: ["Black"], stock: 45 },
  { name: "Wireless Gaming Mouse", category: "Accessories", description: "High-performance mouse for gaming", specs: "16000 DPI • RGB • 6 Buttons • Rechargeable", price: 59.99, student_price: 41.99, image_url: "/assets/gaming-mouse.jpg", colors: ["Black"], stock: 60 },
  { name: "Watch Smart", category: "Electronics", description: "Track fitness and notifications", specs: "Heart Rate • Sleep Tracking • 7 Days Battery • Water Resistant", price: 99.99, student_price: 69.99, image_url: "/assets/watch.jpg", colors: ["Black", "Silver"], stock: 55 },
  { name: "Cable Organizer", category: "Accessories", description: "Keep cables tidy and organized", specs: "Silicone • 10-piece Set • Multiple Sizes • Reusable", price: 12.99, student_price: 9.09, image_url: "/assets/cable-organizer.jpg", colors: ["Black", "Gray", "Multicolor"], stock: 180 },
  { name: "Screen Protector", category: "Accessories", description: "Protect your device screen from scratches", specs: "9H Hardness • Anti-Fingerprint • Easy Install • 2-Pack", price: 9.99, student_price: 6.99, image_url: "/assets/screen-protector.jpg", colors: ["Clear"], stock: 220 },
  { name: "Wrist Rest", category: "Accessories", description: "Comfortable support for long typing sessions", specs: "Memory Foam • Non-Slip Base • Keyboard Size", price: 16.99, student_price: 11.89, image_url: "/assets/wrist-rest.jpg", colors: ["Black", "Gray"], stock: 100 },
  { name: "Blue Yeti Microphone", category: "Audio", description: "Professional USB microphone for podcasting", specs: "USB • Multiple Patterns • Mute Button • Headphone Jack", price: 129.99, student_price: 90.99, image_url: "/assets/blue-yeti.jpg", colors: ["Black", "Silver"], stock: 35 }
];

async function seedProducts() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding products...');
    
    const categoryMap = {
      'Electronics': 1,
      'Accessories': 2,
      'Audio': 3
    };
    
    for (const product of products) {
      const categoryId = categoryMap[product.category];
      await client.query(`
        INSERT INTO products (name, category_id, description, specs, price, student_price, image_url, colors, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        product.name,
        categoryId,
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
    console.log(`✅ Successfully seeded ${products.length} products!`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding products:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedProducts();