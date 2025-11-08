# HealthSync - Modern Healthcare Platform

HealthSync is a comprehensive healthcare management platform that connects patients with doctors, provides AI-powered diagnostics, and manages medical records securely.

![HealthSync Banner](https://via.placeholder.com/800x200?text=HealthSync+Platform)

## 🌟 Features

- **User Management**
  - Role-based access (Admin, Doctor, Patient)
  - Secure authentication via Firebase
  - Profile management & customization

- **Patient Features**
  - AI-powered preliminary diagnosis
  - Book appointments with specialists
  - Track medical history
  - Manage prescriptions & records

- **Doctor Features**
  - Manage appointments & schedules
  - Access patient records securely
  - Record diagnoses & prescriptions
  - Professional profile management

- **Admin Features**
  - Platform analytics & monitoring
  - User management
  - System configuration

## 🏗 Architecture

### Technology Stack

| Layer               | Technology                               | Role                                           |
| ------------------- | ---------------------------------------- | ---------------------------------------------- |
| **Frontend**        | React (Vite + TypeScript)                | All UI, routing, form handling                 |
|                     | Tailwind CSS                             | Styling                                        |
|                     | Lucide Icons                             | Consistent icons                               |
|                     | Axios                                    | Talk to Spring Boot backend                    |
| **Backend**         | Spring Boot (Java 17+)                   | Core logic, processing, integrations           |
|                     | Spring Web / MVC                         | REST APIs for complex logic                    |
|                     | Spring Security (optional)               | Token validation for Firebase Auth             |
|                     | Firebase Admin SDK                       | Securely communicate with Firebase DB and Auth |
| **Database & Auth** | Firebase (Firestore + Auth)              | Data storage & authentication                  |
| **Integrations**    | Google Cloud / OpenAI / Gemini           | AI diagnosis, file storage                     |
| **DevOps**          | Docker, GitHub Actions, Railway / Render | CI/CD + Deployment                             |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Docker (optional)
- Firebase account and project
- Google Cloud account (for AI features)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Lalitadhikari30/HealthSync.git
   cd HealthSync/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and backend configurations
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Configure application.properties:
   ```properties
   # Server Configuration
   server.port=8080
   
   # Firebase Configuration
   firebase.project-id=your-project-id
   firebase.credentials-file=path/to/firebase-credentials.json
   
   # AI Service Configuration
   ai.service.api-key=your-api-key
   ```

3. Build and run:
   ```bash
   ./mvnw spring-boot:run
   ```

## 🛠 Development

### Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (auth, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utility functions & configs
│   │   └── pages/        # Page components
│   └── public/           # Static assets
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/healthsync/
│   │   │   │       ├── config/      # Configurations
│   │   │   │       ├── controller/  # REST endpoints
│   │   │   │       ├── service/     # Business logic
│   │   │   │       └── model/       # Data models
│   │   │   └── resources/
│   │   └── test/                    # Unit tests
│   └── pom.xml
│
└── docker/                          # Docker configurations
```

### Development Guidelines

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - Feature branches: `feature/feature-name`

2. **Commit Messages**
   ```
   feat: Add patient appointment booking
   fix: Resolve doctor dashboard loading issue
   docs: Update API documentation
   ```

3. **Code Style**
   - Frontend: ESLint + Prettier
   - Backend: Google Java Style Guide

## 🚢 Deployment

### Docker Deployment

1. Build images:
   ```bash
   docker-compose build
   ```

2. Run services:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Frontend (Render):
   ```bash
   npm run build
   # Deploy dist/ directory
   ```

2. Backend (Railway):
   ```bash
   ./mvnw clean package
   # Deploy JAR file
   ```

## 📝 API Documentation

API documentation is available at:
- Development: `http://localhost:8080/swagger-ui.html`
- Production: `https://api.healthsync.com/swagger-ui.html`

## 🔐 Security

- Firebase Authentication
- JWT token validation
- CORS configuration
- Data encryption at rest
- Secure communication (HTTPS)

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📞 Support

For support, email support@healthsync.com or join our Slack channel.