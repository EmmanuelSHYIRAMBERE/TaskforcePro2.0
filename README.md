# TaskforcePro2.0 - Wallet Web Application

<a name="readme-top"></a>

<div align="center">
  <h3>Personal Wallet Management System</h3>
  <p>
    A comprehensive web application for managing personal finances across multiple accounts with transaction tracking, budgeting, and reporting features.
    <br />
    <a href="https://taskforcepro2-0-web-wallet-frontend.onrender.com">View Demo</a>
  </p>
</div>

## Table of Contents

- [About The Project](#about-the-project)
  - [Key Features](#key-features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Contact](#contact)

## About The Project

`Wallet Web Application` is a comprehensive wallet management system designed to help users track and manage their finances across multiple accounts. The application provides features for transaction tracking, budget management, expense categorization, and financial reporting.

### Key Features

1. **Multi-Account Transaction Tracking**

   - Track transactions across multiple account types (bank, mobile money, cash)
   - Record and categorize income and expenses
   - Real-time balance updates

2. **Budget Management**

   - Set budget limits for different expense categories
   - Receive notifications when approaching or exceeding budget limits
   - Track budget utilization in real-time

3. **Expense Categorization**

   - Create and manage custom expense categories
   - Add subcategories for detailed expense tracking
   - Link transactions to specific categories

4. **Financial Reports**

   - Generate detailed financial reports for any time period
   - Visual representations of income and expenses
   - Category-wise spending analysis
   - Account-wise transaction history

5. **Dashboard Analytics**
   - Visual summary of financial status
   - Expense trends and patterns
   - Budget vs. actual spending comparisons

### Built With

#### Frontend

- React with TypeScript
- Tailwind CSS
- Radix UI Components
- React Router
- Recharts for data visualization
- SWR for data fetching

#### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (>= 14.20.1)
- MongoDB
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/EmmanuelSHYIRAMBERE/TaskforcePro2.0.git
cd TaskforcePro2.0
```

2. Install Backend Dependencies

```bash
cd backend
npm install
```

3. Configure Environment Variables

```bash
cp .env.example .env
# Update .env with your configuration
```

4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the Backend Server

```bash
cd backend
npm run server
```

2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Documentation: http://localhost:8000/api-docs

## Project Structure

```
TaskforcePro2.0/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── types/
│   └── package.json
└── README.md
```

## API Documentation

The API documentation is available through Swagger UI when running the application:

- Development: http://localhost:8000/api-docs
- Production: https://taskforcepro2-0.onrender.com/api-docs

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Emmanuel SHYIRAMBERE - [LinkedIn Profile](https://www.linkedin.com/in/emashyirambere/)

Project Link: [https://github.com/EmmanuelSHYIRAMBERE/TaskforcePro2.0](https://github.com/EmmanuelSHYIRAMBERE/TaskforcePro2.0)

Demo Link: [https://taskforcepro2-0-web-wallet-frontend.onrender.com](https://taskforcepro2-0-web-wallet-frontend.onrender.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
