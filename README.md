# 🌐 NanoLink: Premium URL Shortener & Analytics

NanoLink is a high-performance, full-stack URL shortening service designed with a focus on **security**, **deliverability**, and **deep analytics**. This repository contains the **Frontend** application, built to provide a seamless user experience for managing links and visualizing traffic data.



## 🔗 Related Repositories
> **The engine behind this UI:** [NanoLink-API (Backend)](https://github.com/hridik-suresh/NanoLink-url_shortener) 👈 *Check here for the Node.js, Express, and Gmail API logic.*

---

## ✨ Key Features

### 📊 Deep Analytics Dashboard
* **Visual Data**: Real-time activity charts tracking clicks over time using **Recharts**.
* **Intelligent Tracking**: Detailed logs powered by `ua-parser-js` and `geoip-lite` to track:
    * **Geography**: City and Country detection via IP.
    * **Device Specs**: Browser, OS, and hardware type (Mobile/Desktop).
* **Live Metrics**: Instant "Total Click" counters and activity logs.

### 🛡️ Secure User Flow & State
* **Redux Toolkit**: Centralized state management for predictable data flow across the dashboard.
* **Gmail OAuth 2.0 Integration**: Reliable email verification delivery using the official `googleapis` library.
* **JWT Security**: Stateless authentication with encrypted session persistence.

### 📱 Responsive & Professional UX
* **Mobile-First Design**: Optimized layouts including scrollable data tables for small screens.
* **Interactive Feedback**: One-click clipboard integration with `react-hot-toast` notifications.

---

## 🛠️ Technical Stack

### Frontend (This Repo)
* **Core**: React.js (Vite)
* **State Management**: Redux Toolkit (Slices and Store)
* **Styling**: Tailwind CSS
* **Charts**: Recharts
* **API Client**: Axios (with custom interceptors for Auth)

### Backend (The Core Engine)
* **Runtime**: Node.js & Express v5
* **Database**: MongoDB (Mongoose ODM)
* **Communication**: Google APIs (OAuth2 & Gmail v1)
* **Security**: Bcryptjs (Hashing) & Passport.js (Social Auth Ready)
* **Analytics**: GeoIP-lite & UA-Parser-JS

---
