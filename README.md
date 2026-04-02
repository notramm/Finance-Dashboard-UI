# 🚀 Premium Personal Finance Dashboard

A high-performance, professional personal finance management application built with React and Tailwind CSS. Designed for a frontend developer internship assessment, focusing on code quality, exceptional UX, and modern aesthetics.

![Dashboard Preview](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=Personal+Finance+Dashboard+UI)

## ✨ Features

### 1. Dashboard Overview
- **Real-time Summaries**: Total Balance, Income, Expenses, and Savings Rate with dynamic icons and trend indicators.
- **Interactive Charts**:
  - **Balance Trend**: Shaded Area Chart showing 6-month financial trajectory.
  - **Spending Breakdown**: Donut Chart for categorical expense analysis.
- **Micro-Animations**: Staggered entry animations for cards and smooth chart transitions.

### 2. Transaction Management
- **Smart Filtering**: Filter by type (Income/Expense) or specific category (Food, Bills, etc.).
- **Global Search**: Search by description or category instantly.
- **Admin Control**: Role-based UI allowing Admins to Add, Edit, and Delete transactions.
- **Data Export**: Export your full transaction history as a CSV file for external analysis.

### 3. Role-Based UI (RBAC)
- **Viewer Role**: Read-only access to charts and lists.
- **Admin Role**: Full CRUD capabilities with dedicated action buttons and modals.
- **Instant Toggle**: Switch roles via the Navbar to instantly update the UI state.

### 4. Advanced Insights
- **Smart Analysis**: Automatic detection of highest spending categories.
- **MoM Comparison**: Month-over-month trend analysis with percentage differences.
- **Data-Driven Tips**: Adaptive motivational messages based on your savings performance.

### 5. UI/UX Excellence
- **Dual Theme**: Premium dark/light mode with persistence.
- **Glassmorphism**: Modern frosted-glass effects on cards and navigation.
- **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop displays.
- **Premium Components**: Custom-built StatCards, Modals, and Form controls.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) (Hooks & Context API)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sanjana-SD/Finance-Dashboard-UI.git
   cd Finance-Dashboard-UI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔐 Role Switching Instructions

1. Locate the **Role Switcher** in the Top Navbar.
2. Click on **Viewer** or **Admin** to toggle permissions.
3. Observe how the "Add Transaction" and table "Actions" (Edit/Delete) appear/disappear instantly.

## 📄 License
This project is for assessment purposes only.
