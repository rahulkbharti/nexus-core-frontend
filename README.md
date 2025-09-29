## Nexus Core: A Multi-Tenant SaaS Library Management System

Nexus Core is a robust, full-stack, multi-tenant SaaS platform engineered from the ground up to serve as a comprehensive Library Management System. Built with a modern TypeScript-first approach, it empowers administrators to create and manage multiple, fully isolated library organizations from a single, intuitive interface. The system features a sophisticated role-based access control system, automated financial tracking, and a seamless user experience for admins, staff, and members.

### Screenshots

![Screenshot of the Dark Mode](./doc/output/dark-mode.png)
[view more](./OUTPUT.md)

---

### Key Features

- **Multi-Tenant Architecture**: A single administrator can create and oversee multiple independent library organizations. The system guarantees complete data isolation between tenants, ensuring privacy and security.
- **Advanced Role-Based Access Control (RBAC)**: Administrators have complete control over their organization. They can create custom roles (e.g., Librarian, Accountant) and assign granular permissions (e.g., `ADD_BOOK`, `ISSUE_BOOK`, `PROCESS_FEES`). Direct permissions can also be assigned to individual staff members for maximum flexibility.
- **Secure User Onboarding & Authentication**:
  - Admin accounts are created via a secure email OTP verification process.
  - Staff and member accounts are provisioned by authorized personnel, triggering automated welcome emails.
  - Authentication is handled via a secure JWT-based system using **Access** and **Refresh Tokens**, with passwords encrypted using **bcrypt**.
  - **Google OAuth** is integrated for convenient social login.
  - A secure "Forgot Password" feature with email OTP is available for all users.
- **Integrated Fee & Membership Management**:
  - Membership fees are automatically generated upon member registration.
  - The system supports partial fee payments, with member accounts automatically activated once 50% of the initial fee is paid.
- **Core Library & Resource Management**:
  - **Book Management**: Easily add new books and track individual copies. Staff can efficiently manage the process of issuing and returning books to members.
  - **Automated Notifications**: The system automatically sends email reminders to members before their book return due dates.
  - **Seat Management**: Create digital layouts of library halls, add individual seats, and reserve them for specific members.

---

### Technical Architecture & Tech Stack

The application is built on a modern, scalable, and maintainable technology stack.

#### **Backend**

- **Framework**: Node.js, Express.js with TypeScript for type safety and robustness.
- **Database & ORM**: **PostgreSQL** for reliable relational data storage, managed with **Prisma ORM** for type-safe database queries and schema management.
- **Authentication & Security**: JWT for stateless authentication, **bcrypt** for password hashing, and a rate-limiter to prevent abuse.
- **Caching**: **Redis** is used for caching frequently accessed resources to ensure high performance and reduce database load.
- **Email Services**: Initially developed with Nodemailer, the system was migrated to the **Resend API** to ensure reliable email delivery in a production environment on Render.com.
- **Logging & Testing**: **Winston** for structured application logging and **Vitest** for unit and integration testing.

#### **Frontend**

- **Framework**: **React.js** for building a dynamic and responsive user interface.
- **State Management**: **Redux Toolkit** for predictable global state management and **React Query** for managing server state, caching, and data fetching.
- **UI & Forms**: **Material-UI** for a clean and professional component library. **Formik** and **Yup** are used for efficient and validatable form handling.
- **Architecture**: Implemented protected routes for secure access, a dark/light theme toggler for user preference, and created generic, reusable components (Table, Form, View) to maintain a consistent and scalable codebase.

#### **DevOps & Deployment**

- **Containerization**: **Docker** was used to containerize the application. Multi-stage builds were implemented to create lightweight, optimized images for production.
- **CI/CD**: **GitHub Actions** were set up to automate the build, test, and deployment pipeline, ensuring seamless integration and delivery.
- **Hosting**: The application is deployed on **Render.com**.

---

### Development Journey & Challenges

The development of Nexus Core was a comprehensive journey that involved overcoming several challenges and making critical architectural decisions.

- **Multi-Tenancy Implementation**: Designing a multi-tenant architecture that ensures complete data isolation while maintaining performance was a significant challenge. This was achieved through careful database schema design and the use of middleware to enforce tenant-specific data access.
- **RBAC System**: Implementing a flexible and granular role-based access control system required careful planning and testing to ensure that permissions were correctly enforced across various user roles.
- **Email Service Migration**: Transitioning from Nodemailer to the Resend API for email delivery was a crucial step to ensure reliability in a production environment. This involved updating the email sending logic and thoroughly testing the new integration.
- **Automated Financial Tracking**: Developing a system that automatically generates and tracks membership fees, including handling partial payments and account activation, required intricate logic and thorough testing to ensure accuracy and reliability.
- **Performance Optimization**: Implementing Redis caching to improve performance and reduce database load was essential for ensuring a smooth user experience, especially as the number of tenants and users grew.
- **Testing & Quality Assurance**: Setting up a robust testing framework using Vitest to ensure code quality and reliability was a continuous effort throughout the development process.

### API Documentation

Comprehensive API documentation was created to outline all available endpoints, required parameters, and expected responses, ensuring the system is maintainable and can be easily integrated with other services in the future.
