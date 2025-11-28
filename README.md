# 💰 Expense Tracker

A modern, responsive web application for tracking and visualizing your expenses with a clean UI and smooth interactions.

## ✨ Features

### Core Functionality
- **Add New Expenses**: Record expenses with title, amount, category, and date
- **Form Validation**: No empty fields allowed, amounts must be positive numbers
- **Edit Expenses**: Modify any saved expense by clicking the edit button
- **Delete Expenses**: Remove expenses with confirmation modal for safety
- **LocalStorage Persistence**: All data persists across browser sessions

### Filtering & Sorting
- **Category Filter**: View expenses by specific category
- **Date Range Filter**: Filter expenses between start and end dates
- **Search Bar**: Quickly find expenses by title or category name
- **Multiple Sort Options**:
  - Newest First (default)
  - Oldest First
  - Highest Amount
  - Lowest Amount
  - Name (A-Z)

### Dashboard Statistics
- **Total Monthly Expenses**: Displays current month's total spending
- **Top Category**: Shows your highest spending category with amount
- **Largest Expense**: Highlights your biggest single expense with title

### Data Visualization
- **Interactive Doughnut Chart**: Visual breakdown of spending by category
- **Chart.js Integration**: Beautiful, responsive charts with hover tooltips
- **Percentage Display**: See exactly how much each category represents

### UI/UX Features
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark Mode Toggle**: Switch between light and dark themes (preference saved)
- **Category Color Coding**: Each category has a unique color for easy recognition
- **Smooth Animations**:
  - Slide-in animation when adding expenses
  - Fade-in modal transitions
  - Hover effects on cards and buttons
- **Empty States**: Helpful messages when no data is available
- **Icon System**: Category-specific emojis for visual appeal

### Bonus Features
- **CSV Export**: Download all expenses as a CSV file
- **Real-time Updates**: Everything updates instantly as you add/edit/delete
- **Keyboard Friendly**: Full form validation and enter-to-submit
- **Auto-scroll to Form**: Clicking edit scrolls to the form smoothly

## 🎨 Category System

The app includes 8 predefined categories with unique colors and icons:

- 🍔 **Food & Dining** (Red)
- 🚗 **Transportation** (Blue)
- 🛍️ **Shopping** (Pink)
- 💡 **Bills & Utilities** (Amber)
- 🎬 **Entertainment** (Purple)
- 💊 **Healthcare** (Green)
- 📚 **Education** (Cyan)
- 📌 **Other** (Gray)

## 🚀 Getting Started

### Installation

1. Download or clone all three files to a folder:
   - `index.html`
   - `styles.css`
   - `app.js`

2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)

### No Build Process Required!

This is a pure HTML/CSS/JavaScript application that runs entirely in the browser. No installation, no npm, no build steps needed!

## 📱 Usage Guide

### Adding an Expense

1. Fill in the form on the left panel:
   - **Title**: Description of the expense (e.g., "Grocery Shopping")
   - **Amount**: Cost in dollars (must be positive)
   - **Category**: Select from the dropdown
   - **Date**: Pick the expense date (defaults to today)

2. Click **"Add Expense"** button

3. The expense appears instantly in the list with a slide-in animation

### Editing an Expense

1. Click the **edit icon** (✏️) on any expense card
2. The form populates with the expense data
3. Make your changes
4. Click **"Update Expense"** to save

### Deleting an Expense

1. Click the **delete icon** (🗑️) on any expense card
2. Confirm deletion in the modal popup
3. The expense is removed and data updates instantly

### Using Filters

- **Category Filter**: Select a category to view only those expenses
- **Sort**: Choose how to order your expenses
- **Date Range**: Set start and/or end dates
- **Search**: Type in the search bar to find specific expenses
- **Clear Filters**: Reset all filters at once

### Exporting Data

1. Click the **download icon** in the header
2. A CSV file downloads automatically with all expenses
3. Filename includes the current date: `expenses_2025-11-19.csv`

### Dark Mode

Click the **moon/sun icon** in the header to toggle between light and dark themes. Your preference is saved automatically.

## 💾 Data Storage

All expense data is stored in your browser's LocalStorage:
- Data persists even after closing the browser
- Data is stored locally on your device (not sent to any server)
- Clear browser data will erase your expenses
- Each browser/device stores data independently

## 🛠️ Technical Details

### Tech Stack
- **HTML5**: Semantic markup with modern structure
- **CSS3**: Custom properties (variables), Flexbox, Grid, animations
- **Vanilla JavaScript**: ES6+ features, no frameworks
- **Chart.js**: Data visualization library (loaded via CDN)
- **Font Awesome**: Icon library (loaded via CDN)

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support
- IE 11: ❌ Not supported (uses modern ES6+ features)

### Key JavaScript Features Used
- LocalStorage API for data persistence
- Array methods (map, filter, reduce, sort)
- ES6+ syntax (arrow functions, destructuring, template literals)
- Date manipulation and formatting
- DOM manipulation
- Event handling
- CSV generation and blob downloads

### Performance
- Lightweight: Total size < 100KB (without CDN assets)
- No external dependencies (except Chart.js and Font Awesome CDN)
- Instant load times
- Smooth 60fps animations

## 📐 Responsive Breakpoints

- **Desktop**: 1200px+ (Two-column layout)
- **Tablet**: 768px - 1199px (Single column, reordered)
- **Mobile**: < 768px (Stacked layout, optimized touch targets)
- **Small Mobile**: < 480px (Further optimized for small screens)

## 🎯 Future Enhancement Ideas

- Add recurring expenses (e.g., subscriptions, rent)
- Budget setting and tracking
- Multiple currency support
- Monthly/yearly comparison charts
- Tags/labels system
- Receipt photo attachments
- Cloud sync across devices
- Import from CSV
- Multi-user support
- Custom categories

## 📄 License

This project is free to use and modify for personal or commercial purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this application. Some areas for contribution:
- Additional chart types (bar, line charts)
- More export formats (PDF, Excel)
- Advanced filtering options
- Budget planning features
- Accessibility improvements

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Ensure you're using a modern browser
- Clear cache and reload if experiencing issues
- Verify LocalStorage is enabled in browser settings

---

**Enjoy tracking your expenses!** 💸
