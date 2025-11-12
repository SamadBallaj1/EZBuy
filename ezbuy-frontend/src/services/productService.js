// src/services/productService.js
export const getAllProducts = () => {
  return [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      description: "High-quality wireless headphones with active noise cancellation and deep bass.",
      specs: "Bluetooth 5.0 • 20h Battery • Noise Cancelling • Fast Charging",
      price: 59.99,
      studentPrice: 49.99,
      images: [
        "/assets/headphones.jpg"
      ],
      colors: ["Black", "White", "Blue"],
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      description: "Stay connected and track your fitness with our sleek smartwatch.",
      specs: "Heart Rate • GPS • Waterproof • Step Counter",
      price: 99.99,
      studentPrice: 79.99,
      images: [
        "/assets/watch.jpg"
      ],
      colors: ["Silver", "Gold", "Black"],
    },
    {
      id: 3,
      name: "Laptop Stand",
      category: "Accessories",
      description: "Adjustable aluminum laptop stand for better posture and cooling.",
      specs: "Aluminum • Foldable • Fits 11–17 inch laptops",
      price: 29.99,
      studentPrice: 24.99,
      images: [
        "/assets/laptop-stand.jpg"
      ],
      colors: ["Silver", "Gray"],
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      category: "Electronics",
      description: "Compact and powerful Bluetooth speaker with deep bass and long battery life.",
      specs: "Bluetooth 5.1 • 12h Playtime • Water Resistant",
      price: 39.99,
      studentPrice: 29.99,
      images: [
        "/assets/speaker.jpg"
      ],
      colors: ["Black", "Red", "Blue"],
    },
    {
      id: 5,
      name: "Gaming Mouse",
      category: "Electronics",
      description: "Ergonomic RGB gaming mouse with customizable DPI and side buttons.",
      specs: "RGB Lighting • 6 Buttons • 16000 DPI • Wired",
      price: 49.99,
      studentPrice: 39.99,
      images: [
        "/assets/gaming-mouse.jpg"
      ],
      colors: ["Black", "White"],
    },
    {
      id: 6,
      name: "USB-C Hub",
      category: "Accessories",
      description: "Multiport USB-C hub with HDMI, USB 3.0, and SD card reader.",
      specs: "HDMI • 3x USB 3.0 • SD/TF Reader • PD Charging",
      price: 24.99,
      studentPrice: 19.99,
      images: [
        "/assets/usb-hub.jpg"
      ],
      colors: ["Gray", "Silver"],
    },
    {
      id: 7,
      name: "Mechanical Keyboard",
      category: "Electronics",
      description: "RGB mechanical keyboard with tactile switches for ultimate typing feel.",
      specs: "RGB Lighting • Blue Switches • USB-C • Full Key Rollover",
      price: 79.99,
      studentPrice: 64.99,
      images: [
        "/assets/keyboard.jpg"
      ],
      colors: ["Black", "White"],
    },
    {
      id: 8,
      name: "Noise Cancelling Earbuds",
      category: "Electronics",
      description: "Compact true wireless earbuds with hybrid noise cancellation.",
      specs: "Bluetooth 5.2 • 8h Battery • Wireless Charging",
      price: 89.99,
      studentPrice: 69.99,
      images: [
        "/assets/earbuds.jpg"
      ],
      colors: ["Black", "White", "Pink"],
    },
  ];
};

export const getTrendingProducts = () => getAllProducts().slice(0, 4);
export const getBestSellers = () => getAllProducts().slice(4, 8);
export const getProductById = (id) =>
  getAllProducts().find((p) => p.id === Number(id));
