# EcoSetu - Bridging the Gap in Waste Management

EcoSetu is a comprehensive platform designed to empower informal waste pickers (Kabadiwalas) and connect them seamlessly with formal recycling centers. The project consists of a **Mobile Application** for waste pickers and a **Web Dashboard** for recycling centers and administrators.

## 🌟 Key Features

### Mobile App (For Waste Pickers)
- **Multilingual Support**: Available in English, Hindi, and Marathi, catering to local waste pickers.
- **Voice Mode (TTS)**: Integrated Text-to-Speech support for better accessibility for users with limited literacy.
- **Lot Tracking**: Users can add, manage, and track their collected scrap batches (lots) and monitor handover statuses.
- **Earnings & Payments**: Keep a transparent record of earnings, track pending/completed payments.
- **Recycler Discovery**: Connect waste pickers to nearby verified recycling centers and view material prices.
- **AI-Powered Assistance**: Integrates Google Generative AI for smart scrap classification.

### Web Dashboard (For Recyclers & Admins)
- **Real-time Monitoring**: Track incoming scrap lots and inventory in real-time.
- **Analytics & Reporting**: View insights on collected materials and financial summaries.
- **Management Console**: Efficiently manage waste picker profiles, payouts, and material pricing.

## 🛠️ Tech Stack

- **Mobile App**: Flutter & Dart
- **Web Dashboard**: React, Vite, TypeScript, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **AI Integration**: Google Generative AI

## 📂 Project Structure

- /ui - Contains the Flutter application source code.
- /EcoSetu-DashboardV2 - Contains the React/Vite Web Dashboard source code.
- /supabase - Contains Backend configuration and database schemas.

## 🚀 Getting Started

### Running the Mobile App
1. Navigate to the ui directory: cd ui
2. Install dependencies: lutter pub get
3. Run the app: lutter run

### Running the Web Dashboard
1. Navigate to the dashboard directory: cd EcoSetu-DashboardV2
2. Install dependencies: 
pm install (or pnpm install)
3. Run the development server: 
pm run dev (or pnpm dev)

## 🌐 Deployment
- **Web Dashboard**: Optimized for deployment on **Vercel** or **Render**.
- **Backend**: Hosted on **Supabase Cloud**.
