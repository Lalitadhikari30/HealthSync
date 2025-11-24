# HealthSync - Modern Healthcare Platform

HealthSync is a comprehensive healthcare management platform that connects patients with doctors, provides AI-powered diagnostics, and manages medical records securely.

![HealthSync Banner](./HealthSync%20Image.png)

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
| **Frontend**        | React 18.3.1 + TypeScript 5.5.3          | UI components, routing, state management        |
|                     | Vite 7.2.2                               | Build tool & development server                |
|                     | Tailwind CSS 3.4.1 + PostCSS 8.4.35      | Utility-first CSS framework                    |
|                     | Lucide React 0.344.0                     | Icon library                                   |
|                     | React Router DOM 7.9.5                   | Client-side routing                            |
|                     | React Hot Toast 2.6.0                    | Notification system                            |
| **Backend**         | Spring Boot 3.1.5 + Java 17              | Core application framework                     |
|                     | Spring Security + JWT (JJWT 0.11.5)      | Authentication & authorization                 |
|                     | Spring Web MVC                           | REST API endpoints                             |
|                     | Spring Boot Starter Mail                 | Email services                                 |
|                     | Spring Boot Starter Validation           | Input validation                               |
|                     | SpringDoc OpenAPI 2.2.0                  | API documentation (Swagger UI)                 |
|                     | Lombok                                    | Code generation & boilerplate reduction        |
| **Database & Auth** | Firebase 12.5.0 + Firebase Admin 9.2.0   | Authentication & real-time database            |
|                     | Supabase JS 2.81.0                       | Alternative database/backend service           |
| **AI Services**     | Google Generative AI 0.24.1              | AI-powered diagnostics (Gemini)                |
|                     | OpenAI 6.8.1                             | AI chatbot & analysis features                 |
| **Cloud Functions** | Firebase Functions 6.6.0 + Node.js 22    | Serverless backend functions                   |
|                     | Firebase Admin 12.6.0                    | Firebase backend administration                |
|                     | JSON Web Tokens 9.0.2                    | Token handling in cloud functions             |
| **Development**     | ESLint 9.9.1 + TypeScript ESLint 8.3.0    | Code linting & quality assurance               |
|                     | TypeScript 5.7.3 (Functions)            | Type safety for cloud functions                |
|                     | Maven                                    | Dependency management & build tool             |

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (for Firebase Functions)
- npm or yarn package manager
- Java 17+ (for Spring Boot backend)
- Maven 3.6+
- Firebase account and project
- Google Cloud API keys (for Gemini AI)
- OpenAI API key (for AI features)
- Supabase account (optional, for alternative database)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Lalitadhikari30/HealthSync.git
   cd HealthSync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your Firebase and API configurations
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Firebase Functions Setup

1. Navigate to functions directory:
   ```bash
   cd functions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy functions:
   ```bash
   firebase deploy --only functions
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
HealthSync/
├── frontend/                        # React TypeScript frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── medical/            # Medical-related components
│   │   │   ├── patient/            # Patient-specific components
│   │   │   └── layout/             # Layout components
│   │   ├── contexts/               # React contexts (auth, etc.)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility functions & configs
│   │   │   ├── firebase.ts         # Firebase configuration
│   │   │   ├── supabase.ts         # Supabase configuration
│   │   │   ├── storage.ts          # File storage utilities
│   │   │   └── api.ts              # API utilities
│   │   ├── pages/                  # Page components
│   │   │   └── patient/            # Patient-specific pages
│   │   └── main.tsx                # App entry point
│   ├── functions/                   # Firebase cloud functions
│   │   ├── src/
│   │   │   ├── index.ts            # Main functions file
│   │   │   └── supabaseToken.ts    # Supabase token handler
│   │   └── package.json
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js

├── backend/                         # Spring Boot Java backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/healthsync/
│   │       │       ├── config/      # Security & app configurations
│   │       │       ├── controller/  # REST endpoints
│   │       │       ├── entity/      # Data entities
│   │       │       ├── repository/  # Data repositories
│   │       │       ├── security/    # JWT & authentication
│   │       │       └── service/     # Business logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml

├── firebase.json                    # Firebase configuration
├── .firebaserc                      # Firebase project settings
├── package.json                     # Root package.json
└── README.md
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

- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool & dev server
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [Java](https://www.oracle.com/java/) - Programming language
- [Maven](https://maven.apache.org/) - Dependency management
- [Firebase](https://firebase.google.com/) - Authentication & database
- [Google Generative AI](https://ai.google.dev/) - AI diagnostics
- [OpenAI](https://openai.com/) - AI chatbot & analysis
- [Supabase](https://supabase.com/) - Alternative database service
- [JWT](https://jwt.io/) - Authentication tokens
- [ESLint](https://eslint.org/) - Code linting
- [PostCSS](https://postcss.org/) - CSS processing
- [Lombok](https://projectlombok.org/) - Java boilerplate reduction

## 📞 Support

For support, email adhikarilalit9968@gmail.com or join our Slack channel.
