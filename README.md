# FreelanceFi

A decentralized freelance marketplace built with the **MERN Stack**, **Solidity**, **ethers.js**, and **MetaMask**. FreelanceFi enables clients to post tasks, freelancers to apply for them, and payments to be handled securely using a custom ERC-20 token on the blockchain.

##  Features

### Authentication
- MetaMask Wallet Login
- Automatic Wallet Reconnection
- Role-Based Access (Client & Freelancer)
- Secure Backend Authentication

### Client Features
- Create New Tasks
- View & Manage Tasks
- Review Freelancer Proposals
- Hire Freelancers
- View Active Hires
- Review Submitted GitHub Projects
- Reject Completed Tasks
- Approve Completed Tasks
- Rate Freelancers
- View Freelancer History

### Freelancer Features
- Browse Available Tasks
- Submit Proposals
- View Pending Applications
- Manage Active Tasks
- Submit GitHub Repository Links
- View Completed Tasks
- View Client History

### Blockchain Features
- ERC-20 Skill Token (SKT)
- Smart Contract-Based Task Management
- On-chain Task Approval
- Secure Token Payments
- Event-Driven Contract Updates
- MetaMask Integration
- ESCROW based payment method

### Dashboard
- Task Statistics
- Earnings & Spending Overview
- Wallet Information
- Profile Information

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Context API
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookie Parser

## Blockchain
- Solidity
- Hardhat
- ethers.js
- MetaMask

## Project Structure

```text
FreelanceFi/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── client/
│       │   └── freelancer/
│       ├── context/
│       ├── hooks/
│       ├── API/
│       ├── ethers/
│       └── utils/
│
├── server/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── config/
│
├── contracts/
│   ├── SkillToken.sol
│   └── TaskManager.sol
│
└── README.md
```


---

# Workflow

### Client

1. Connect MetaMask
2. Create Profile
3. Create Task
4. Receive Freelancer Proposals
5. Hire Freelancer
6. Wait for Submission
7. Review GitHub Repository
8. Approve Task
9. Rate Freelancer

---

### Freelancer

1. Connect MetaMask
2. Create Profile
3. Browse Tasks
4. Send Proposal
5. Get Hired
6. Complete Project
7. Submit GitHub Link
8. Receive SKT Tokens

---

## Smart Contracts

### SkillToken.sol
- ERC-20 Skill Token (SKT)
- Used for task payments

### TaskManager.sol
- Create Task
- Delete Task
- Submit Proposal
- Hire Freelancer
- Submit Work
- Approve Task
- Escrow Payment
- Events

Developed using:

- Solidity
- Remix IDE
- ethers.js

## Smart Contract Addresses (Sepolia)

SkillToken:
0x896078c5Ae6B3140195e3F4C74b2941ADFC88370

TaskManager:
0xF2214deDFF9E7518919661742c9e7041F3D40Db5

---


# Screenshots

# Screenshots

### Client Dashboard

![Client Dashboard](./screenshots/client-dashboard.png)

### Create Tasks

![Create Tasks](./screenshots/create-tasks.png)

### Ratings

![Ratings](./screenshots/ratings.png)

### Freelancer History

![Freelancer History](./screenshots/freelancer-history.png)

### Freelancer Profile

![Freelancer Profile](./screenshots/freelancer-profile.png)

### Freelancer Dashboard

![Freelancer Dashboard](./screenshots/freelancer-dashboard.png)

---

# Installation

## Clone Repository

```bash
git clone https://github.com/ayesha2524/FreelanceFi

cd FreelanceFi
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install Smart Contracts

```bash
npm install
```

---

# Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLIENT_URL=http://localhost:5173
```

---

# Run Application

## Start Backend

```bash
cd server

npm run dev
```

## Start Frontend

```bash
cd client

npm run dev
```

---


# Future Improvements

- Chat between Client & Freelancer
- File Upload (IPFS)
- Milestone-Based Payments
- Dispute Resolution
- Notifications
- Search & Filtering
- Dark Mode
- Admin Dashboard

---

# Learning Outcomes

This project demonstrates:

- Full Stack MERN Development
- REST API Development
- MongoDB Integration
- JWT Authentication
- Smart Contract Development
- ERC-20 Token Integration
- ethers.js
- MetaMask Integration
- React Context API
- Custom React Hooks
- Responsive UI Design
- Blockchain Event Handling

---

# Author

**Ayesha Sheikh**

- GitHub: https://github.com/ayesha2524
- LinkedIn: https://www.linkedin.com/in/ayesha-sheikh-722304362/

---

# License

This project is licensed under the MIT License.
