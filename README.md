## 🚧 Project Approach

This project implements a secure file-sharing system with clearly separated user roles — *Ops Users* and *Client Users* — and strict access control using modern web technologies.

---

### 1. 🧱 Architecture Design

- *Frontend: Built using **ReactJS* with functional components and hooks.
- *Backend: Developed using **Python* (Django or FastAPI) to create RESTful APIs.
- *Database: A flexible design supporting either **SQL (PostgreSQL)* or *NoSQL (MongoDB)* depending on scalability needs.
- *Security*:
  - JWT-based authentication for all API endpoints
  - Encrypted download links for secure file access
  - Role-based access control (RBAC)

---

### 2. 👤 User Roles & Access

| User Type     | Access Permissions                                  |
|---------------|-----------------------------------------------------|
| *Ops User*  | - Login<br>- Upload .pptx, .docx, .xlsx only |
| *Client User* | - Signup with email verification<br>- Login<br>- List and download files via secure link |

---

### 3. 🔒 File Upload & Download Flow

#### 🔼 Upload (Ops User Only)

- Ops User logs in using credentials.
- They access the file uploader (client-side validation for file types).
- File is sent via multipart/form-data to /ops/upload endpoint.
- Backend validates file type and stores it securely in server or cloud storage.

#### 🔽 Download (Client User Only)

- Client User logs in and views the list of uploaded files.
- Upon clicking download, a secure, time-limited encrypted URL is returned.
- SecureDownload.js component accesses that link and triggers download.
- If accessed by a non-client or after expiry, access is denied.

---

### 4. 📬 Email Verification

- On signup, the backend generates a unique verification token.
- A verification email with an encrypted URL is sent to the user.
- Clicking the link verifies the email and activates the account.

---

### 5. 🔐 Encrypted URL Generation

- Download links are:
  - Encrypted using a secure hash function (e.g., HMAC/SHA256)
  - Time-limited with expiry (e.g., valid for 10 mins)
  - Bound to the user type (Client only)

---

### 6. ⚙ Error Handling & Validation

- *Frontend*:
  - Form validations (required fields, file type checks)
  - User-friendly alerts for errors or success
- *Backend*:
  - Role checks for every API endpoint
  - Proper HTTP status codes (401, 403, 422, etc.)
  - Logging for file actions and authentication attempts

---

### 7. 🧪 Testing

- Manual testing for:
  - Ops file upload flow
  - Client signup/login and file access
- API testing via Postman or Swagger
- Frontend tested using dev tools and mocked endpoints
