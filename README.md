# Finance Tracker Pro

A comprehensive web-based personal finance management system designed to help users efficiently track income, expenses, manage savings goals, and generate detailed financial reports.

**Developer:** Rijan Shrestha  
**Project Type:** Web-Based Personal Finance Management System

## Project Overview

Finance Tracker Pro is a web-based application that empowers users to take control of their personal finances. The system allows users to:
- Record income and expenses with detailed categorization
- Visualize financial data through interactive charts and graphs
- Set and track savings goals with progress monitoring
- Generate comprehensive financial reports
- Access real-time financial insights and notifications

## Tech Stack

- **Frontend Framework** - React
- **Language** - TypeScript
- **Styling** - CSS with CSS Variables
- **State Management** - React Hooks & Context API
- **Build Tool** - Vite
- **IDE** - Visual Studio Code

## Required System Components

### Main Layout Structure
- Application Logo
- Sidebar Navigation (Dashboard, Transactions, Goals, Reports, Settings)
- Top Navigation Bar with Page Title, Month Selector, Add Transaction Button
- Responsive Layout Structure

### Dashboard Page
- **Summary Cards:**
  - Total Balance
  - Monthly Income
  - Monthly Expense
  - Total Savings

- **Charts & Visualizations:**
  - Income vs Expense (Bar Chart)
  - Expense by Category (Pie Chart)
  - Savings Trend (Line Chart)

- **Recent Transactions Table:**
  - Date, Category, Description, Amount, Type
  - Edit/Delete Actions

### Transaction Management
- Income/Expense Toggle
- Amount Input
- Category Dropdown
- Date Picker
- Description Field
- Save, Cancel, Edit, Delete with Confirmation Modal

### Goals Management
- Total, Active, Completed Goals Overview
- Goal Details: Name, Target Amount, Current Amount, Deadline
- Progress Bar with Percentage and Remaining Amount

### Reports Module
- Date Range Filter
- Category Filter
- Transaction Type Filter
- Summary: Total Income, Expense, Net Savings
- Generate and Download PDF

## Reusable UI Components

- **Buttons** - Primary, Secondary, Danger variants
- **Input Fields** - Text, Number, Date inputs
- **Dropdowns** - Category, Month, Filter selectors
- **Cards** - Summary cards, Transaction cards, Goal cards
- **Tables** - Transaction tables with sorting and pagination
- **Progress Bars** - Goal progress visualization
- **Modal Popups** - Confirmation dialogs, Add/Edit forms
- **Toast Notifications** - Success, Error, Warning messages
- **Icons** - Navigation, Action, Status icons

## Project Structure

```
Finance-Tracker-Pro/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Sidebar.css
│   │   │   └── NotificationDropdown.tsx
│   │   ├── button/
│   │   ├── input/
│   │   └── ui/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── goals/
│   │   ├── reports/
│   │   └── settings/
│   ├── hooks/
│   │   ├── useClickOutside.ts
│   │   ├── useNotifications.ts
│   │   └── useTheme.ts
│   ├── context/
│   │   └── NotificationContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Finance-Tracker-Pro.git
cd Finance-Tracker-Pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Usage

1. **Dashboard** - View your financial overview and recent transactions
2. **Add Transaction** - Record new income or expense entries
3. **Transactions** - Manage, edit, or delete transactions
4. **Goals** - Set and track savings goals
5. **Reports** - Generate and download financial reports
6. **Settings** - Customize preferences and account settings

## CSS Variables

The application uses CSS variables for consistent theming:

```css
:root {
  --brand-bg: #f0f2f5;
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-subtle: #e2e8f0;
  --rose-500: #f43f5e;
  --accent-green: #10b981;
  --sidebar-bg: #ffffff;
}
```

## Type Definitions

The project uses TypeScript for type safety:

```typescript
export type Notification = {
  id: string;
  message: string;
  time: string;
  read: boolean;
};

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};
```

## Core Features

### ✅ Core Features (Implemented)
- Dashboard with financial overview
- Transaction tracking (Add, Edit, Delete)
- Real-time notifications
- Responsive design

### 📋 Optional Features (Planned)
- User Authentication & Authorization
- Budget Limit Alerts
- Dark/Light Mode Toggle
- Export to Excel
- Currency Selector
- User Profile Management
- Data Backup/Restore

### 🚀 Advanced Features (Future)
- Recurring Transactions
- Smart Spending Insights
- Financial Health Score
- AI Budget Suggestions
- Expense Prediction
- Multi-Account Tracking
- Monthly Comparison Analytics
- Cloud Synchronization

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@financetrackerpro.com or open an issue in the repository.

## Acknowledgments

- React Documentation
- TypeScript Documentation
- Vite Documentation
- Community Contributors

---

**Last Updated:** March 6, 2026  
**Version:** 1.0.0  
**Status:** Active Development
