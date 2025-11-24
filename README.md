# HealthSync - Modern Healthcare Platform

HealthSync is a comprehensive healthcare management platform that seamlessly connects patients with doctors, provides AI-powered diagnostics, and manages medical records securely with real-time synchronization between frontend and backend.

![HealthSync Banner](./HealthSync%20Image.png)

## 🌟 Features

- **User Management**
  - Role-based access (Admin, Doctor, Patient)
  - Secure authentication via Firebase Auth
  - Profile management & customization

- **Patient Features**
  - AI-powered preliminary diagnosis (OpenAI & Gemini)
  - Book appointments with specialists
  - Track medical history in real-time
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

## 🏗 Architecture Overview

### **Real-time Data Flow Architecture**

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    Firebase SDK    ┌─────────────────┐
│   React App     │ ◄──────────────────► │  Spring Boot    │ ◄────────────────► │ Firebase Firestore│
│   (Port 5173)   │                    │   (Port 8080)   │                    │   (Real-time DB) │
│                 │                    │                 │                    │                 │
│ • TypeScript    │                    │ • Java 17       │                    │ • Patients       │
│ • Firebase Auth │                    │ • Spring Security│                    │ • Doctors        │
│ • Tailwind CSS  │                    │ • Firebase Admin│                    │ • Appointments   │
│ • AI Services   │                    │ • REST APIs     │                    │ • Medical Recs   │
└─────────────────┘                    └─────────────────┘                    └─────────────────┘
```

### **Technology Stack**

| Layer               | Technology                               | Role                                           |
| ------------------- | ---------------------------------------- | ---------------------------------------------- |
| **Frontend**        | React 18.3.1 + TypeScript 5.5.3          | UI components, routing, state management        |
|                     | Vite 7.2.2                               | Build tool & development server                |
|                     | Tailwind CSS 3.4.1 + PostCSS 8.4.35      | Utility-first CSS framework                    |
|                     | Lucide React 0.344.0                     | Icon library                                   |
|                     | React Router DOM 7.9.5                   | Client-side routing                            |
|                     | React Hot Toast 2.6.0                    | Notification system                            |
|                     | Firebase 12.5.0                          | Authentication & real-time database            |
| **Backend**         | Spring Boot 3.1.5 + Java 17              | Core application framework                     |
|                     | Spring Security + JWT (JJWT 0.11.5)      | Authentication & authorization                 |
|                     | Spring Web MVC                           | REST API endpoints                             |
|                     | Firebase Admin SDK 9.2.0                 | Firebase integration & Firestore operations    |
|                     | Spring Boot Starter Validation           | Input validation                               |
|                     | SpringDoc OpenAPI 2.2.0                  | API documentation (Swagger UI)                 |
|                     | Spring Boot Actuator                      | Health monitoring & metrics                   |
|                     | Lombok                                    | Code generation & boilerplate reduction        |
| **Database & Auth** | Firebase Firestore                       | Real-time NoSQL database (shared by both)       |
|                     | Firebase Authentication                  | User authentication & JWT tokens               |
| **AI Services**     | Google Generative AI 0.24.1              | AI-powered diagnostics (Gemini)                |
|                     | OpenAI 6.8.1                             | AI chatbot & analysis features                 |
| **Development**     | ESLint 9.9.1 + TypeScript ESLint 8.3.0    | Code linting & quality assurance               |
|                     | Maven                                    | Dependency management & build tool             |

### **Key Architecture Features**

- **🔄 Real-time Synchronization**: Both frontend and backend connect to the same Firebase Firestore
- **🔥 Firebase Integration**: Spring Boot backend uses Firebase Admin SDK
- **📊 Unified Data Source**: No more separate databases - single source of truth
- **🚀 Modern Tech Stack**: React + TypeScript + Java Spring Boot + Firebase
- **📱 Cross-platform Ready**: Same backend serves web, mobile, and desktop apps
- **🔐 Secure Authentication**: Firebase Auth + Spring Security + JWT

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for React frontend)
- npm or yarn package manager
- Java 17+ (for Spring Boot backend)
- Maven 3.6+
- Firebase account and project
- Google Cloud API keys (for Gemini AI)
- OpenAI API key (for AI features)

### Firebase Setup

1. **Create Firebase Project**
   ```bash
   # Go to https://console.firebase.google.com
   # Create new project or use existing
   ```

2. **Get Service Account Key**
   ```bash
   # In Firebase Console:
   # 1. Go to Project Settings → Service Accounts
   # 2. Click "Generate new private key"
   # 3. Download JSON file
   # 4. Rename to: firebase-service-account.json
   # 5. Place in: backend/src/main/resources/
   ```

3. **Enable Firebase Services**
   - Authentication (Email/Password, Google Sign-In)
   - Firestore Database
   - Storage (for file uploads)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Lalitadhikari30/HealthSync.git
   cd HealthSync
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

4. Start development server:
   ```bash
   npm run dev
   # Frontend runs on: http://localhost:5173
   ```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Configure Firebase (already done in application.yml):
   ```yaml
   # Firebase is configured in src/main/resources/application.yml
   # Make sure firebase-service-account.json is in src/main/resources/
   ```

3. Build and run:
   ```bash
   mvn spring-boot:run
   # Backend runs on: http://localhost:8080
   # API Documentation: http://localhost:8080/swagger-ui.html
   # Health Monitor: http://localhost:8080/actuator/health
   ```

### 🎯 Quick Test

1. **Start both services**:
   ```bash
   # Terminal 1: Frontend
   cd frontend && npm run dev
   
   # Terminal 2: Backend
   cd backend && mvn spring-boot:run
   ```

2. **Test Integration**:
   - Open React App: http://localhost:5173
   - Register a patient
   - Open Swagger UI: http://localhost:8080/swagger-ui.html
   - Try `GET /api/patients/firebase` - you should see the same data!

3. **Test Real-time Sync**:
   - Book appointment in React app
   - Check `GET /api/appointments/firebase` in Swagger UI
   - Both should show identical data in real-time!

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
│   │   │   ├── api.ts              # API utilities (Spring Boot)
│   │   │   └── storage.ts          # File storage utilities
│   │   ├── pages/                  # Page components
│   │   │   ├── patient/            # Patient-specific pages
│   │   │   ├── doctor/             # Doctor-specific pages
│   │   │   └── admin/              # Admin-specific pages
│   │   └── main.tsx                # App entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js

├── backend/                         # Spring Boot Java backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/healthsync/
│   │       │       ├── config/      # Security & Firebase configurations
│   │       │       │   ├── FirebaseConfig.java    # Firebase Admin SDK setup
│   │       │       │   └── SecurityConfig.java    # Spring Security setup
│   │       │       ├── controller/  # REST endpoints
│   │       │       │   ├── PatientController.java # Patients API (Firebase)
│   │       │       │   ├── AppointmentController.java # Appointments API (Firebase)
│   │       │       │   └── HomeController.java     # Health check endpoints
│   │       │       ├── entity/      # Data entities (JPA)
│   │       │       ├── repository/  # Data repositories (JPA)
│   │       │       ├── service/     # Business logic
│   │       │       │   ├── FirebaseService.java    # Firebase operations
│   │       │       │   ├── PatientService.java    # Patient business logic
│   │       │       │   └── AppointmentService.java # Appointment business logic
│   │       │       └── HealthSyncApplication.java  # Main application class
│   │       └── resources/
│   │           ├── application.yml   # Spring Boot configuration
│   │           └── firebase-service-account.json  # Firebase credentials (gitignored)
│   └── pom.xml

├── firebase.json                    # Firebase configuration
├── .firebaserc                      # Firebase project settings
├── .gitignore                       # Git ignore rules (includes Firebase keys)
└── README.md
```

### 🔥 Firebase Integration Details

#### **Backend Firebase Integration**
```java
// FirebaseConfig.java - Automatic Firebase initialization
@Service
public class FirebaseService {
    // CRUD operations on Firestore
    // Real-time data synchronization
    // Document queries and filtering
}

// Controllers use FirebaseService
@RestController
public class PatientController {
    @GetMapping("/firebase")
    public List<Map<String, Object>> getPatientsFromFirebase() {
        return firebaseService.getAllDocuments("patients");
    }
}
```

#### **Frontend Firebase Integration**
```typescript
// lib/firebase.ts - Direct Firebase SDK usage
import { getFirestore, collection, doc } from 'firebase/firestore';

// lib/api.ts - Spring Boot API calls
const apiBaseUrl = 'http://localhost:8080';
export async function apiFetch(path: string) {
    return fetch(`${apiBaseUrl}${path}`);
}
```

### 🔄 Data Flow Examples

#### **Patient Registration Flow**
```
React App (Firebase Auth) → Firebase Firestore → Spring Boot (Firebase Admin SDK) → Swagger UI
```

#### **Appointment Booking Flow**
```
React App → Firebase Firestore → Spring Boot → Real-time Sync → Swagger UI
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
