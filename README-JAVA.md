# HealthSync - Full Java Stack Healthcare Platform

HealthSync has been successfully converted to a **full Java stack** application using Spring Boot for both backend and frontend (Thymeleaf).

## 🌟 Java Stack Architecture

### Technology Stack

| Layer               | Technology                               | Role                                           |
| ------------------- | ---------------------------------------- | ---------------------------------------------- |
| **Frontend**        | Spring Boot 3.1.5 + Thymeleaf           | Server-side rendered HTML pages                |
|                     | Tailwind CSS 3.4.1                      | Utility-first CSS framework                    |
|                     | Font Awesome 6.4.0                       | Icon library                                   |
| **Backend**         | Spring Boot 3.1.5 + Java 17              | Core application framework                     |
|                     | Spring Web MVC                           | REST API endpoints                             |
|                     | Spring Data JPA                          | Database ORM layer                             |
|                     | Spring Boot Starter Validation           | Input validation                               |
|                     | SpringDoc OpenAPI 2.2.0                  | API documentation (Swagger UI)                 |
|                     | Lombok                                    | Code generation & boilerplate reduction        |
| **Database**        | H2 (in-memory) / MySQL 8.0               | Development / Production database              |
| **Security**        | Spring Security + JWT (JJWT 0.11.5)      | Authentication & authorization                 |
| **Build Tool**      | Maven 3.6+                               | Dependency management & build tool             |
| **Deployment**      | Docker + Docker Compose                 | Containerized deployment                       |

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- Docker & Docker Compose (optional, for containerized deployment)

### Running the Application

#### Option 1: Direct Maven Run
```bash
cd backend
./mvnw spring-boot:run
```

#### Option 2: Docker Compose
```bash
docker-compose up -d
```

#### Option 3: Build and Run JAR
```bash
cd backend
./mvnw clean package
java -jar target/healthsync-0.0.1-SNAPSHOT.jar
```

### Access Points

- **Web Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Console** (dev): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:healthsync`
  - Username: `sa`
  - Password: `password`

## 🏗 Project Structure

```
HealthSync/
├── backend/                         # Spring Boot Java application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/healthsync/
│   │       │       ├── controller/  # REST endpoints & Web controllers
│   │       │       │   ├── WebController.java      # Thymeleaf page routing
│   │       │       │   ├── PatientController.java   # Patient API
│   │       │       │   ├── DoctorController.java    # Doctor API
│   │       │       │   ├── AppointmentController.java # Appointment API
│   │       │       │   ├── AuthController.java      # Authentication API
│   │       │       │   └── AIController.java        # AI Services API
│   │       │       ├── entity/      # JPA entities
│   │       │       │   ├── Patient.java
│   │       │       │   ├── Doctor.java
│   │       │       │   ├── Appointment.java
│   │       │       │   └── MedicalRecord.java
│   │       │       ├── repository/  # JPA repositories
│   │       │       │   ├── PatientRepository.java
│   │       │       │   ├── DoctorRepository.java
│   │       │       │   ├── AppointmentRepository.java
│   │       │       │   └── MedicalRecordRepository.java
│   │       │       ├── service/     # Business logic
│   │       │       │   ├── PatientService.java
│   │       │       │   ├── DoctorService.java
│   │       │       │   ├── AppointmentService.java
│   │       │       │   └── impl/
│   │       │       └── HealthSyncApplication.java
│   │       └── resources/
│   │           ├── templates/        # Thymeleaf templates
│   │           │   ├── index.html    # Home page
│   │           │   ├── login.html    # Login page
│   │           │   ├── dashboard.html # Dashboard
│   │           │   ├── appointments.html # Appointments page
│   │           │   ├── patients.html # Patients page
│   │           │   ├── doctors.html  # Doctors page
│   │           │   └── admin.html    # Admin page
│   │           └── application.yml   # Configuration
│   ├── pom.xml                       # Maven dependencies
│   └── Dockerfile                    # Docker configuration
├── docker-compose.yml               # Multi-container setup
└── README-JAVA.md                   # This file
```

## 🔧 Configuration

### Database Configuration

**Development (H2)**:
- URL: `jdbc:h2:mem:healthsync`
- Auto-configured in `application.yml`

**Production (MySQL)**:
- URL: `jdbc:mysql://mysql-db:3306/healthsync`
- Configured via Docker Compose environment variables

### Application Properties

Key configurations in `application.yml`:
- Server port: 8080
- Database: H2 (dev) / MySQL (prod)
- Thymeleaf: Server-side templating
- JPA: Hibernate ORM
- Swagger UI: API documentation

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register patient
- `POST /api/auth/register/doctor` - Register doctor
- `POST /api/auth/login` - User login
- `GET /api/auth/user/{firebaseUid}` - Get user by Firebase UID

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient
- `GET /api/patients/search` - Search patients

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor
- `GET /api/doctors/specialization/{specialization}` - Get doctors by specialization

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment
- `GET /api/appointments/patient/{patientId}` - Get patient appointments
- `GET /api/appointments/doctor/{doctorId}` - Get doctor appointments

### AI Services
- `POST /api/ai/diagnose` - Preliminary diagnosis
- `POST /api/ai/chatbot` - AI chatbot

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
- **healthsync-app**: Main Spring Boot application
- **mysql-db**: MySQL 8.0 database

## 🔐 Security Features

- Spring Security integration
- JWT token-based authentication
- Role-based access control (PATIENT, DOCTOR, ADMIN)
- Input validation with Jakarta Bean Validation
- CORS configuration for frontend integration

## 📊 Monitoring & Documentation

- **Swagger UI**: Interactive API documentation at `/swagger-ui.html`
- **H2 Console**: Database management console at `/h2-console` (dev only)
- **Spring Boot Actuator**: Application metrics and health checks

## 🚀 Deployment Options

### 1. Traditional Deployment
```bash
./mvnw clean package
java -jar target/healthsync-0.0.1-SNAPSHOT.jar
```

### 2. Docker Deployment
```bash
docker build -t healthsync ./backend
docker run -p 8080:8080 healthsync
```

### 3. Docker Compose (Recommended for Production)
```bash
docker-compose -f docker-compose.yml up -d
```

## 🔄 Migration from React/Firebase

The following changes were made to convert to full Java stack:

1. **Frontend**: React → Spring Boot + Thymeleaf
2. **Database**: Firebase Firestore → JPA + MySQL/H2
3. **Authentication**: Firebase Auth → Spring Security + JWT
4. **Cloud Functions**: Firebase Functions → Spring Boot REST endpoints
5. **Build Tool**: npm/Vite → Maven
6. **Deployment**: Firebase Hosting → Docker containers

## 🎯 Benefits of Java Stack

- **Unified Technology**: Single language (Java) across entire stack
- **Better Performance**: Compiled Java vs interpreted JavaScript
- **Strong Typing**: Compile-time type safety
- **Mature Ecosystem**: Enterprise-grade libraries and frameworks
- **Simplified Deployment**: Single JAR file deployment
- **Better Tooling**: IDE support, debugging, profiling
- **Enterprise Ready**: Production-tested Spring Boot framework

## 📞 Support

For support with the Java version, please refer to:
- Spring Boot documentation: https://spring.io/projects/spring-boot
- Thymeleaf documentation: https://www.thymeleaf.org/
- Spring Data JPA documentation: https://spring.io/projects/spring-data-jpa
