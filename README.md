# 🚖 HopIn – Your Ride, Your Way

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</div>

<div align="center">
  <h3>🌟 A Full ride booking application built with modern web technologies</h3>
  <p>Connect passengers with drivers for seamless transportation experiences</p>
</div>

---

## 🌟 Features

### 👥 For Passengers

| Feature                         | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| 🔐 **User Authentication**      | Secure signup and login system                         |
| 📍 **Real-time Location**       | Get current location and search for destinations       |
| 💰 **Fare Estimation**          | Get pricing for different vehicle types before booking |
| 🚗 **Multiple Vehicle Options** | Choose from Car, Motorcycle, or Auto-rickshaw          |
| 🗺️ **Live Tracking**            | Real-time tracking of driver location during ride      |
| 💬 **In-app Messaging**         | Chat with driver during the ride                       |
| 📋 **Ride History**             | View past rides and details                            |

### 🚛 For Drivers/Captains

| Feature                    | Description                                 |
| -------------------------- | ------------------------------------------- |
| 📝 **Driver Registration** | Complete profile setup with vehicle details |
| ⚡ **Status Management**   | Toggle between active/inactive status       |
| 🔔 **Ride Requests**       | Receive and accept ride requests            |
| 🧭 **Navigation**          | Real-time route guidance                    |
| 💵 **Earnings Tracking**   | View daily earnings and trip history        |
| 🔢 **OTP Verification**    | Secure ride start with passenger OTP        |

### ⚡ Real-time Features

<div align="center">
  
| 🌐 Live Location Tracking | 🔌 Socket.io Integration | 🗺️ Interactive Maps | 🛣️ Route Optimization |
|:-------------------------:|:------------------------:|:--------------------:|:-------------------:|
| Real-time GPS tracking | Instant notifications | Powered by Leaflet | Intelligent routing |
| for all parties | and updates | and OpenStreetMap | using OSRM |

</div>

---

## 🛠️ Tech Stack

### 🎨 Frontend

<div align="center">
  
| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) | 19 | Modern UI framework |
| ![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux) | Toolkit | State management |
| ![Router](https://img.shields.io/badge/React-Router-CA4245?style=flat-square&logo=react-router) | Latest | Navigation and routing |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css) | Latest | Utility-first CSS |
| ![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=flat-square) | Latest | Smooth animations |
| ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square) | Latest | Interactive maps |
| ![Socket.io](https://img.shields.io/badge/Socket.io-Client-010101?style=flat-square&logo=socket.io) | Latest | Real-time communication |
| ![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=flat-square) | Latest | API calls |
| ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite) | Latest | Fast build tool |

</div>

### 🔧 Backend

<div align="center">
  
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-Server-339933?style=flat-square&logo=node.js) | Server runtime |
| ![Express](https://img.shields.io/badge/Express.js-Framework-000000?style=flat-square&logo=express) | Web application framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb) | NoSQL database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=flat-square) | MongoDB object modeling |
| ![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socket.io) | Bidirectional communication |
| ![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens) | Authentication |
| ![bcrypt](https://img.shields.io/badge/bcrypt-Security-FF6B6B?style=flat-square) | Password hashing |
| ![Validator](https://img.shields.io/badge/Express-Validator-4CAF50?style=flat-square) | Input validation |

</div>

### 🌐 External APIs

<div align="center">
  
| Service | Purpose |
|---------|---------|
| 🗺️ **LocationIQ** | Geocoding and routing services |
| 🌍 **OpenStreetMap** | Map tiles and data |
| 🛣️ **OSRM** | Open Source Routing Machine |

</div>

---

## 📁 Project Structure

```
🏗️ HopIn/
├── 🔧 Backend/
│   ├── 📂 controllers/          # Route handlers
│   ├── 📂 models/              # Database schemas
│   ├── 📂 routes/              # API routes
│   ├── 📂 services/            # Business logic
│   ├── 📂 middlewares/         # Authentication & validation
│   ├── 📂 db/                  # Database configuration
│   ├── 📄 app.js              # Express app setup
│   ├── 📄 server.js           # Server entry point
│   └── 📄 socket.js           # Socket.io configuration
│
└── 🎨 Frontend/
    ├── 📂 src/
    │   ├── 📂 components/      # Reusable UI components
    │   ├── 📂 pages/          # Page components
    │   ├── 📂 redux/          # State management
    │   ├── 📂 assets/         # Static assets
    │   └── 📂 lib/            # Utility functions
    ├── 📂 public/             # Public assets
    └── 📄 package.json        # Dependencies
```

---

## 🚀 Installation & Setup

### 📋 Prerequisites

<div align="center">
  
| Requirement | Version | Purpose |
|-------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js) | v16 or higher | Runtime environment |
| ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb) | Latest | Database |
| ![LocationIQ](https://img.shields.io/badge/LocationIQ-API_Key-FF6B6B?style=flat-square) | API Key | Geocoding services |

</div>

### 🔧 Backend Setup

**1. Navigate to the backend directory:**

```bash
cd Backend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create a `.env` file in the Backend directory:**

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/hopin
JWT_SECRET=your_jwt_secret_key
LOCATIONIQ_API_KEY=your_locationiq_api_key
NODE_ENV=development
```

**4. Start the backend server:**

```bash
npm start
```

_Or for development with nodemon:_

```bash
npm run dev
```

### 🎨 Frontend Setup

**1. Navigate to the frontend directory:**

```bash
cd Frontend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create a `.env` file in the Frontend directory:**

```bash
VITE_API_URL=http://localhost:4000
VITE_LOCATIONIQ_API_KEY=your_locationiq_api_key
```

**4. Start the development server:**

```bash
npm run dev
```

**5. Open your browser and navigate to:**

```
http://localhost:5173
```

---

## 🎯 Key Features Implementation

### 📍 Real-time Tracking

- 🛰️ GPS-based location tracking
- 🔄 Live map updates using Leaflet
- 🛣️ Route calculation with OSRM
- 🎯 Geolocation accuracy handling

### 💰 Fare Calculation

- 📊 Dynamic pricing based on distance and time
- 🚗 Different rates for each vehicle type
- ⚡ Real-time fare estimation

### 🔐 Authentication & Security

- 🔑 JWT-based authentication
- 🛡️ Password hashing with bcrypt
- 🚫 Token blacklisting for logout
- ✅ Input validation and sanitization

### 📱 Responsive Design

- 📱 Mobile-first approach
- 👆 Touch-friendly interfaces
- 🖥️ Adaptive layouts for all screen sizes

---

## 🌐 Deployment

### 🔧 Backend Deployment

1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables
3. Deploy to services like Heroku, Railway, or AWS
4. Update CORS settings for production

### 🎨 Frontend Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy to Vercel, Netlify, or similar platforms
3. Update API base URL for production
4. Configure environment variables

---

## 🤝 Contributing

This project does not currently accept external contributions.

If you find any issues or have suggestions for improvement, feel free to open an issue or contact me directly — I’ll be happy to take a look and fix it.

## 🔮 Future Enhancements

<div align="center">

| Feature                                | Status     | Priority |
| -------------------------------------- | ---------- | -------- |
|                                        |
| 💳 Payment gateway integration         | ⏳ Planned | High     |
| 🛣️ Advanced route optimization         | ⏳ Planned | Medium   |
| ⭐ Driver ratings and reviews          | ⏳ Planned | Medium   |
| 📅 Scheduled rides                     | ⏳ Planned | Medium   |
| 🌍 Multi-language support              | ⏳ Planned | Low      |
| 🌙 Dark mode theme                     | ⏳ Planned | Low      |
| 👥 Ride sharing options                | ⏳ Planned | Low      |
| 📊 Analytics dashboard                 | ⏳ Planned | Low      |
| 🔧 Admin panel                         | ⏳ Planned | Low      |
| 🎯 Multiple Source and Destination     | ⏳ Planned | Medium   |
| 📍 Selecting Current Location (Pickup) | ⏳ Planned | High     |

</div>

---

## 🐛 Known Issues

⚠️ Please be aware of the following limitations:

- 📍 Location accuracy may vary based on device GPS capability
- 🌐 Route calculation depends on external API availability
- 📶 Real-time features require stable internet connection

---

## 📄 License

This project is **not open source**.  
**All rights reserved © 2025 [Sumit Thakur](https://github.com/THAKURSUMIT1600)**  
You may not use, copy, modify, or distribute any part of this code without explicit permission.

## 📧 Contact

For questions or support, please reach out:

- **Email:** [sumitthakur16000@gmail.com](mailto:sumitthakur16000@gmail.com)

---

<div align="center">
  <h3>💖 Built with Love by Sumit Thakur</h3>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
