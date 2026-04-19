# 🏛️ Smart Campus Operations Hub
### IT3030 — Programming and Frameworks | Group 54 | 2026

A full-stack **Smart Campus Management System** built with **Spring Boot 3** (backend) and **React + Vite** (frontend), connected to a cloud **Supabase PostgreSQL** database with **Google OAuth 2.0** authentication.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17, Spring Boot 3.2.4, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite, Axios |
| **Database** | Supabase (PostgreSQL) via Transaction Pooler |
| **Auth** | Google OAuth 2.0 with Role-Based Access Control |
| **File Storage** | Supabase Storage Buckets |
| **CI/CD** | GitHub Actions (Maven build on every push) |
| **Build Tool** | Maven 3 with Lombok 1.18.36 |

---

## 📦 Modules Implemented

### Module B — Resource Booking System
- `POST /api/bookings` — Create a new booking (status: `PENDING`)
- `GET /api/bookings` — Admin: view all bookings
- `GET /api/bookings/user` — User: view own bookings
- `PUT /api/bookings/{id}/cancel` — User: cancel own booking
- `PUT /api/bookings/{id}/status` — **Admin only**: Approve or Reject with reason
- Conflict detection using JPQL overlap queries
- Automatic notifications triggered on Approve/Reject

### Module C — Incident Ticketing with Image Uploads
- `POST /api/incidents` — Report an incident with up to **3 image attachments**
- `GET /api/incidents` — Admin: view all incidents
- `GET /api/incidents/user` — User: view own reported incidents
- MIME-type validation (only `image/*` content types accepted)
- UUID-based filename generation (path traversal protection)
- File size limit: 5MB per file

### Module D — Notification System
- Auto-triggered notifications for:
  - Booking approved / rejected
  - Incident status updated
- `GET /api/notifications` — Fetch user's notifications
- `PUT /api/notifications/{id}/read` — Mark notification as read
- React `NotificationPanel` with unread badge counter in navbar

---

## ⚙️ Getting Started

### Prerequisites
- Java 17 (JDK 17 — **do not use JDK 21+ locally due to Lombok compatibility**)
- Maven 3.x
- Node.js 18+
- A Supabase project with PostgreSQL and Storage configured

### 1. Clone the Repository
```bash
git clone https://github.com/sandundimantha/it3030-paf-2026-smart-campus-group54.git
cd it3030-paf-2026-smart-campus-group54
```

### 2. Configure the Backend

Edit `backend/src/main/resources/application.properties`:
```properties
# Use your Supabase Transaction Pooler JDBC URL (Port 6543)
spring.datasource.url=jdbc:postgresql://<pooler-host>:6543/postgres?user=postgres.<ref>&password=<your-password>
spring.datasource.username=postgres.<ref>
spring.datasource.password=<your-password>

# Google OAuth 2.0
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

> ⚠️ Use the **Transaction Pooler** URL from Supabase Settings → Database (Port `6543`), not the Direct Connection (Port `5432`).

### 3. Run the Backend
```powershell
# Windows — must use JDK 17
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
cd backend
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at: `http://localhost:5173`

---

## 🔒 Security

- **OAuth 2.0** via Google — all endpoints require authentication
- **Role-Based Access Control:**
  - `ADMIN` role required for booking status updates
  - Users can only view/cancel their own bookings and incidents
- **CORS** configured for `localhost:5173` and `localhost:3000`
- **CSRF** disabled (stateless JWT session via OAuth tokens)

---

## 🗄️ Database

- **Provider:** Supabase (PostgreSQL 15)
- **Connection:** Transaction Pooler on Port `6543` (PgBouncer proxy)
- **Schema:** Auto-managed via `spring.jpa.hibernate.ddl-auto=update`

Tables created automatically:
- `bookings`
- `resources`
- `incidents`
- `notifications`
- `comments`
- `app_users`

---

## 🔄 CI/CD — GitHub Actions

Every push to any branch triggers an automated Maven build:
- Workflow: `.github/workflows/maven.yml`
- Checks out code → Sets up JDK 17 → Runs `mvn clean compile`

---

## 👥 Group 54 — Contributors

| Student ID | Branch |
|---|---|
| IT23827080 | `feature/bookings-IT23827080` |
| IT23779570 | `feature/auth-alerts-IT23779570` |
| IT23828452 | `feature/facilities-IT23828452` |

---

## 📄 Assignment Documents

- [Marking Rubric](./IT3030_PAF_2026_Marking_Rubric%20(1).pdf)
- [Assignment Description](./PAF_Assignment-2026.pdf)
