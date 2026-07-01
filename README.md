# Tulisan — Platform Mini Blog

Aplikasi web platform mini blog yang memungkinkan pengguna untuk menulis, mempublikasikan, dan berinteraksi dengan artikel. Dibangun sebagai project UAS mata kuliah Web Advanced Development.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Node.js + Express.js |
| Frontend | React.js (Vite) |
| ORM | Prisma |
| Database | MySQL |
| Autentikasi | JSON Web Token (JWT) |
| API Testing | Postman |

---

## Fitur Utama

- Register & Login dengan JWT Authentication
- CRUD Artikel (Create, Read, Update, Delete)
- Authorization — hanya pemilik artikel yang bisa edit/hapus
- Komentar pada artikel
- Toggle Like / Unlike artikel
- Proteksi endpoint dengan JWT middleware
- Backend berjalan standalone (dapat ditest via Postman tanpa frontend)

---

---

## Cara Menjalankan Project

### Prasyarat

Pastikan sudah terinstall:
- Node.js (v18 atau lebih baru)
- MySQL (running di lokal)
- npm

---

### 1. Clone Repository

```bash
git clone https://github.com/username/UAS_blog_app.git
cd UAS_blog_app
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/`:

```env
PORT=5000
DATABASE_URL="mysql://root:password@127.0.0.1:3306/mini_blog_db"
JWT_SECRET="isi_dengan_secret_key_kamu"
```

Jalankan migrasi database:

```bash
npx prisma migrate dev
```

Jalankan backend:

```bash
node index.js
```

Backend akan berjalan di `http://localhost:5000`

---

### 3. Setup Frontend

Buka terminal baru (jangan tutup terminal backend):

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

---

## Daftar Endpoint API

Base URL: `http://localhost:5000/api`

### Autentikasi

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrasi akun baru | — |
| POST | `/auth/login` | Login dan mendapatkan JWT token | — |

### Artikel

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/articles` | Ambil semua artikel yang dipublikasikan | — |
| GET | `/articles/:id` | Ambil detail artikel beserta komentar | — |
| POST | `/articles` | Buat artikel baru | JWT |
| PUT | `/articles/:id` | Edit artikel milik sendiri | JWT |
| DELETE | `/articles/:id` | Hapus artikel milik sendiri | JWT |

### Komentar & Likes

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/articles/:id/comments` | Tambah komentar pada artikel | JWT |
| POST | `/articles/:id/like` | Toggle like / unlike artikel | JWT |

> Endpoint yang membutuhkan **Auth (JWT)** harus menyertakan header:
> ```
> Authorization: Bearer <token>
> ```

---

## Contoh Request & Response

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Angga",
  "email": "angga@test.com",
  "password": "123456"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "angga@test.com",
  "password": "123456"
}
```
Response:
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Angga",
    "email": "angga@test.com"
  }
}
```

### Buat Artikel (JWT required)
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Judul Artikel",
  "body": "Isi artikel di sini...",
  "published": true
}
```

---

## Database Schema

```prisma
model User {
  id        Int           @id @default(autoincrement())
  name      String
  email     String        @unique
  password  String
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  articles  Article[]
  comments  Comment[]
  likes     ArticleLike[]
}

model Article {
  id        Int           @id @default(autoincrement())
  title     String
  body      String        @db.Text
  published Boolean       @default(false)
  authorId  Int
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  author    User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  likes     ArticleLike[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  userId    Int
  articleId Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  article   Article  @relation(fields: [articleId], references: [id])
}

model ArticleLike {
  userId    Int
  articleId Int
  user      User    @relation(fields: [userId], references: [id])
  article   Article @relation(fields: [articleId], references: [id])

  @@id([userId, articleId])
}
```

---

## Catatan Penting

- File `.env` tidak ikut di-commit ke repository (sudah ada di `.gitignore`)
- Folder `node_modules` tidak ikut di-commit
- Backend dapat diuji secara **standalone** menggunakan Postman tanpa menjalankan frontend
