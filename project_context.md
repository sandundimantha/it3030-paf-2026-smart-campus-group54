# Project Context: Smart Campus Operations Hub

## Overview
The **Smart Campus Operations Hub** is a full-stack web application designed to manage campus resources and bookings. It enables users to request bookings for different resources (e.g., rooms, equipment) and allows administrators or authorized personnel to approve or reject these requests. 

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.4 (Java 17)
- **Data Access**: Spring Data JPA
- **Database**: MySQL Connect
- **Security**: Spring Security & OAuth2 Client
- **Validation**: Spring Boot Starter Validation
- **Boilerplate Reduction**: Lombok

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (ESModules)

## Project Structure
The project is divided into two main components within the `D:\PAF` workspace:

- `/backend`: Contains the Spring Boot server application, including the REST APIs, security configurations, database entities, and business logic.
- `/frontend`: Contains the React application providing the user interface.

## Domain Model
The core domain revolves around the following entities:

1. **Resource**
   - Represents a physical or logical campus resource (e.g., "Lecture Hall A", "Projector").
   - Contains fields like `id`, `name`, and `status` (`ACTIVE`, `OUT_OF_SERVICE`).

2. **Booking**
   - Represents a reservation request for a specific resource by a user.
   - Contains fields like `id`, `resourceId`, `userId`, `startTime`, `endTime`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `approvedBy`, and `rejectionReason`.

## Architectural Layers (Backend)
- **Entities**: Defining the database schema (e.g., `Resource`, `Booking`).
- **Repositories**: JPA interfaces for database operations.
- **Services**: Business logic for handling bookings, approvals, and resource management.
- **Controllers**: REST APIs exposing functionalities to the frontend.
- **Config**: Security and application configurations (e.g., OAuth2 integration, Database connection).
- **DTOs**: Data Transfer Objects for API requests and responses.
- **Exceptions**: Custom error handling.

## CI/CD and Version Control
- Includes `.github` folder indicating the use of GitHub Actions for CI/CD pipelines.
- Configured as a Git repository.
