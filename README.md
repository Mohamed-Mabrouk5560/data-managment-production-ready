# Data Management System

A production-ready web application for data entry and retrieval with Google Apps Script backend and Google Sheets database.

## 🚀 Features

- ✅ Email/password authentication
- ✅ Admin confirmation required for new users
- ✅ Role-based access control (user/admin)
- ✅ Data entry form with 18 fields
- ✅ Search by National ID
- ✅ Admin dashboard with user management
- ✅ Full CRUD operations for admins
- ✅ Mobile-first responsive design
- ✅ RTL support for Arabic
- ✅ Session management (6-hour expiry)

## 📁 Project Structure

```
AppScript/
├── backend/          # Google Apps Script files
│   ├── Code.gs
│   ├── Auth.gs
│   ├── SheetService.gs
│   └── Utils.gs
│
├── index.html        # Main landing (Login/Register)
├── form.html         # Data entry form
├── search.html       # Search page
├── admin.html        # Admin dashboard
├── my-records.html   # User records page
├── styles.css        # Global styles
└── api.js            # Frontend API client
```

## 🛠️ Setup

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Create two sheets: `Users` and `Data`
3. Add column headers as specified in the deployment guide

### 2. Deploy Backend

1. Open Apps Script editor (Extensions → Apps Script)
2. Copy all files from `backend/` folder
3. Deploy as Web App (Anyone can access)
4. Copy the Web App URL

### 3. Configure Frontend

1. Update `API_URL` in `frontend/api.js` with your Web App URL
2. Host frontend files on GitHub Pages, Netlify, or locally

### 4. Create First Admin

1. Manually add admin user to Users sheet
2. Use hashed password (run `hashPassword()` function in Apps Script)
3. Set `confirmed = TRUE`

## 📚 Documentation

- **Deployment Guide**: Step-by-step setup instructions
- **Testing Guide**: Comprehensive testing procedures
- **Implementation Plan**: Architecture and design decisions

## 🔒 Security

- Passwords hashed with SHA-256
- Session tokens with automatic expiry
- Role-based access control
- Input validation and sanitization
- Admin approval for new users

## 🌐 Live Demo

[Add your deployed URL here]

## 👨‍💻 Author

Mohamed Mabrouk
