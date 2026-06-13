# SyncScript - Knowledge Vault Management System

<div align="center">

**Organize. Collaborate. Learn. All in one place.**

• [Features](#-features) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📚 Overview

**SyncScript** is a modern, full-stack web application designed for individuals and teams to create, organize, and collaborate on knowledge vaults. Whether you're a student managing study materials, a researcher organizing citations, or a team documenting project resources, SyncScript provides an intuitive platform to centralize your learning resources with collaborative features.

Users can create personal vaults, add resources (links and files), annotate with rich text, and securely share vaults with team members through role-based access control. The system features email-based invitations, comprehensive permission management, and a responsive design that works seamlessly across all devices.

---

## 🌟 Key Features

### **Knowledge Organization**
- 📦 Create unlimited personal knowledge vaults
- 📚 Organize resources by topic, subject, or project
- 🏷️ Add descriptive names and detailed descriptions to vaults
- 📊 View vault statistics (resource count, creation date)

### **Resource Management**
- 🔗 Add links/URLs with titles and descriptions
- 📁 Upload and manage files within vaults
- 🎯 Quick access with organized resource lists
- 🔍 Easy navigation to view resource details

### **Rich Annotations**
- ✍️ Create detailed annotations using TinyMCE rich text editor
- 🎨 Format text with bold, italic, lists, links, and more
- 👥 Multiple users can annotate the same resource
- ⏰ Track annotation timestamps and authors

### **Team Collaboration**
- 👤 Share vaults with team members via email invitations
- 🔐 Role-based access control (Owner, Contributor, Viewer)
- 📧 Email-based invitation system with secure tokens
- ⚙️ Granular permission management
  - **Owner:** Full control over vault and members
  - **Contributor:** Add resources and annotations, edit own content
  - **Viewer:** Read-only access to resources and annotations

### **User Authentication**
- 🔐 Secure JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 💾 Session persistence across browser sessions
- 🚀 Auto-login functionality

### **Responsive Design**
- 📱 Mobile-first responsive layout
- 💻 Works seamlessly on desktop, tablet, and mobile
- ⚡ Fast loading with optimized assets
- 🎯 Intuitive user interface

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI component framework
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **TinyMCE** - Rich text editor for annotations
- **Lucide React** - Icon library

### **Backend**
- **Node.js + Express.js** - Server runtime and web framework
- **MongoDB + Mongoose** - NoSQL database and ODM
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service for invitations
- **CORS** - Cross-origin resource sharing
- **Express Middleware** - Logging, error handling, validation

### **Deployment**
- **Frontend:** Vercel (serverless)
- **Backend:** Railway/Render (container deployment)
- **Database:** MongoDB Atlas (cloud)

---

## 📋 Project Structure

```
SyncScript/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   ├── VaultCard.jsx
│   │   │   ├── CreateVaultModal.jsx
│   │   │   ├── InviteMemberForm.jsx
│   │   │   └── ResourceForm.jsx
│   │   ├── pages/                     # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── VaultDetailPage.jsx
│   │   │   └── AcceptInvitationPage.jsx
│   │   ├── api/                       # API integration
│   │   │   └── axios.js
│   │   ├── App.jsx                    # Main app component with routing
│   │   └── main.jsx                   # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           # Node.js backend application
│   ├── src/
│   │   ├── controllers/               # Business logic
│   │   │   ├── authController.js
│   │   │   ├── vaultController.js
│   │   │   ├── resourceController.js
│   │   │   └── annotationController.js
│   │   ├── models/                    # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Vault.js
│   │   │   ├── Resource.js
│   │   │   ├── Annotation.js
│   │   │   ├── VaultMember.js
│   │   │   └── Invitation.js
│   │   ├── routes/                    # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── vault.routes.js
│   │   │   ├── resource.routes.js
│   │   │   └── annotation.routes.js
│   │   ├── middleware/                # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── utils/                     # Utility functions
│   │   │   ├── emailService.js
│   │   │   └── storage.js
│   │   └── index.js                   # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── docs/                              # Project documentation
    ├── DATABASE.md                    # Database schema
    ├── API.md                         # API documentation
    └── DEPLOYMENT.md                  # Deployment guide
```

---

## 📖 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB connection string (MongoDB Atlas)
- Gmail account for email service (or alternative)

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/users/register      - User registration
POST   /api/v1/users/login         - User login
POST   /api/v1/users/logout        - User logout
POST   /api/v1/users/refresh-token - Refresh JWT token
GET    /api/v1/users/me            - Get current user
```

### Vaults
```
POST   /api/v1/vaults              - Create vault
GET    /api/v1/vaults              - Get all user vaults
GET    /api/v1/vaults/:id          - Get single vault
PUT    /api/v1/vaults/:id          - Update vault
DELETE /api/v1/vaults/:id          - Delete vault
```

### Resources
```
POST   /api/v1/vaults/:id/resources       - Add resource
GET    /api/v1/vaults/:id/resources       - Get vault resources
PUT    /api/v1/resources/:id              - Update resource
DELETE /api/v1/resources/:id              - Delete resource
```

### Annotations
```
POST   /api/v1/resources/:id/annotations  - Add annotation
GET    /api/v1/resources/:id/annotations  - Get annotations
PUT    /api/v1/annotations/:id            - Update annotation
DELETE /api/v1/annotations/:id            - Delete annotation
```

### Vault Members & Sharing
```
POST   /api/v1/vaults/:id/invite         - Send vault invitation
POST   /api/v1/invitations/:token/accept - Accept invitation
GET    /api/v1/vaults/:id/members        - Get vault members
DELETE /api/v1/vaults/:id/members/:id    - Remove member
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Stateless, scalable auth
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **CORS Protection** - Restricted cross-origin requests
- ✅ **Role-Based Access Control** - Granular permissions
- ✅ **Email Verification** - Token-based invitations
- ✅ **HTTPS Only** - Encrypted data in transit
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **Rate Limiting** - Prevent brute force/abuse
- ✅ **Input Validation** - Server-side validation
- ✅ **Error Handling** - Secure error messages

---

## 📊 Database Schema

SyncScript uses a normalized MongoDB schema with 7 collections:

### Collections
- **Users** - User accounts and credentials
- **Vaults** - Knowledge vaults created by users
- **Resources** - Links and files within vaults
- **Annotations** - Rich text notes on resources
- **VaultMembers** - User-vault relationships with roles
- **Invitations** - Pending/accepted vault sharing invitations
- **Files** - Uploaded file metadata


## 🙏 Acknowledgments

This project was developed as part of the **Software Construction and Development** course at NED University of Engineering and Technology. Special thanks to:

- Course instructors for guidance
- Classmates for feedback and testing
- Open source communities for amazing tools and libraries

---

## 📊 Project Statistics

- **Lines of Code:** ~2,500 (frontend) + ~3,000 (backend)
- **Components:** 8 (frontend)
- **API Endpoints:** 25+
- **Database Collections:** 7
- **Test Cases:** 33+
- **Documentation Pages:** 5
- **Development Time:** ~8 weeks
- **Deployment Platforms:** 3 (Vercel, Railway, MongoDB Atlas)

---

## 🎓 Learning Outcomes

By exploring SyncScript, you'll learn:

- Full-stack web development with React + Node.js
- Database design and normalization (1NF to BCNF)
- RESTful API design and implementation
- Authentication and authorization patterns
- Cloud deployment and DevOps basics
- Real-time email-based collaboration
- Role-based access control implementation
- Production-ready code practices
- Git workflow and version control
- Responsive mobile-first design

---

## 💡 Future Roadmap

| Priority | Feature | Target | Status |
|----------|---------|--------|--------|
| High | Search & Filter | v1.1 | 🔄 In Progress |
| High | Dark Mode | v1.1 | 📋 Planned |
| Medium | Tags/Categories | v1.2 | 📋 Planned |
| Medium | Activity Logs | v1.2 | 📋 Planned |
| Low | Mobile App | v2.0 | 🎯 Future |
| Low | Real-time Sync | v2.0 | 🎯 Future |

---

<div align="center">

### Made with ❤️

⭐ If you find this project useful, please consider starring it!

[⬆ Back to Top](#syncscript---knowledge-vault-management-system)

</div>

---

## 📞 Questions?

Feel free to open an issue or reach out directly. Happy learning! 🚀

