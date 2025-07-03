# 🔐 Secure File Sharing System

A secure file sharing system with role-based access between **Ops Users** and **Client Users**. Built with **ReactJS frontend** and **Python backend** (Flask/FastAPI).

---

## 📁 Features

### 🛠 Ops User
- Login
- Upload `.pptx`, `.docx`, `.xlsx` files only

### 👤 Client User
- Sign Up (returns encrypted verification URL)
- Email verification via secure token
- Login
- View list of uploaded files
- Download files via secure encrypted link

---

## 📦 Tech Stack

- Frontend: **ReactJS**
- Backend: **Python (Flask or FastAPI)**
- Database: **SQL or NoSQL** (e.g., MongoDB, PostgreSQL)
- Security: JWT tokens, Encrypted URL generation

---

## 📁 Full Project Structure

```bash
secure-file-sharing/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── file.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── file_routes.py
│   │   ├── controllers/
│   │   │   ├── auth_controller.py
│   │   │   ├── file_controller.py
│   │   ├── services/
│   │   │   ├── email_service.py
│   │   │   ├── token_service.py
│   │   └── utils/
│   │       ├── encryption.py
│   │       ├── validators.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── file.js
│   │   ├── components/
│   │   │   ├── FileUploader.js
│   │   │   ├── FileList.js
│   │   │   ├── SecureDownload.js
│   │   ├── pages/
│   │   │   ├── ClientSignup.js
│   │   │   ├── ClientLogin.js
│   │   │   ├── OpsLogin.js
│   │   │   ├── VerifyEmail.js
│   │   │   ├── FileListPage.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── README.md
```

## Backend Setup
```base
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Frontend Setup
```base
cd frontend
npm install
npm start
```
## 🔐 Security Notes

- All file downloads are guarded by encrypted, time-sensitive links.
- Only Client Users can access download endpoints.
- File types are validated during upload (Ops only: .pptx, .docx, .xlsx).
