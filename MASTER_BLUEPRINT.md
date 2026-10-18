# MediVault — Master Blueprint

## Product
MediVault is a digital health record and care-management platform. It is a record-management, organization and reminder system; it is not intended to diagnose conditions or replace professional medical care.

## Core actors
- Patient/User
- Doctor
- Administrator

## Core modules
1. Authentication & authorization
2. Patient profile
3. Medical records
4. Medication management
5. Appointment management
6. Medical documents
7. Health timeline
8. Notifications/reminders
9. Doctor access/sharing
10. Administration

## Technology mapping to WMAD
- REST API → client/server communication
- React → web client
- JSX/components/hooks/routing/forms/accessibility → web implementation
- Kotlin → backend language
- Spring Boot → REST backend
- ORM/JPA → persistence layer
- JWT/role-based authorization → secure API access
- Flutter/Dart → mobile client
- Flutter widgets/layout/state/navigation/async → mobile implementation
- Firebase → authentication/realtime/notification-related services where appropriate

## ASDD mapping
- Agile requirements → epics and user stories
- Jira → backlog and board
- GitHub → source control
- Running React application → implementation evidence
- Code outputs → selected source screenshots
- Final report → project result and evidence

## Important scope rule
All medical data in development/demo environments will be fictional/sample data. The application should not be presented as a diagnostic or emergency-care system.
