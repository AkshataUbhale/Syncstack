# 📦 Syncstack — Cloud File & Media Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v2-000000?style=flat)](https://heroui.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F?style=flat)](https://orm.drizzle.team/)
[![ImageKit](https://img.shields.io/badge/Storage-ImageKit_CDN-0055FF?style=flat)](https://imagekit.io/)

A modern, fast, and secure full-stack cloud media storage and file organization web application built with the **Next.js 15 App Router**, **Clerk Authentication**, **ImageKit CDN**, **Neon Serverless PostgreSQL**, and **Drizzle ORM**.

---

## 💡 Why I Built This Project

I built **Syncstack** driven by curiosity to explore and master core full-stack software engineering concepts:

1. **Understanding Database Management Systems (DBMS):**
   I wanted to dive deep into relational database design — specifically how database engines manage hierarchical tree structures, parent-child relationships for nested folders, foreign keys, timestamps, and indexing using **Drizzle ORM** with **Neon PostgreSQL**.
2. **Fascination with Cloud Computing & CDNs:**
   I was fascinated by how cloud storage and Content Delivery Networks (CDNs) process real-world media — handling direct buffer streaming, generating responsive image transformations, optimizing delivery at edge servers, and managing secure cloud assets via **ImageKit**.
3. **Connecting the Full-Stack Ecosystem:**
   Beyond standalone concepts, my main goal was to understand how everything seamlessly fits together in a production-ready application: connecting edge route middlewares, secure authentication tokens, relational database operations, and reactive UI component state.

---

## 🏗️ Architecture & System Flow

Syncstack connects client interactions, server route handlers, serverless relational database queries, and cloud media CDN storage in a unified pipeline.

### System Architecture Diagram

```mermaid
graph TD
    Client["🌐 Client (Next.js 15 + HeroUI)"]
    Middleware["🛡️ Clerk Auth Middleware"]
    API["⚡ Next.js API Route Handlers"]
    NeonDB[("🗄️ Neon Serverless PostgreSQL\n(Drizzle ORM)")]
    ImageKit["☁️ ImageKit Cloud Storage & CDN"]

    Client -->|1. Requests Route / Static Page| Middleware
    Middleware -->|2. Validates Session & Token| Client
    Client -->|3. Upload / File Action / Query| API
    API -->|4. Authenticates Session| Middleware
    API -->|5. Store / Fetch Metadata| NeonDB
    API -->|6. Upload / Transform / Purge Asset| ImageKit
    ImageKit -->|7. Global CDN Asset Delivery| Client
```

---

### End-to-End Sequence Flow

#### 1. File Upload Lifecycle
```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant Client as Next.js Client (Dropzone)
    participant API as Route Handler (/api/files/upload)
    participant Clerk as Clerk Auth
    participant IK as ImageKit Storage & CDN
    participant DB as Neon DB (Drizzle ORM)

    User->>Client: Drag & drop image / file
    Client->>Client: Validate file type & size (5MB max)
    Client->>API: POST multipart/form-data (File + userId + parentId)
    API->>Clerk: auth() check session validity
    Clerk-->>API: Verified userId
    API->>IK: Upload file buffer (Generate UUID filename & path)
    IK-->>API: Return fileUrl, thumbnail, filePath
    API->>DB: INSERT into files table (name, path, size, fileUrl, parentId, userId)
    DB-->>API: Return new file record
    API-->>Client: 200 OK (File JSON)
    Client->>User: Display success toast & refresh file tree
```

#### 2. File Organization & Soft-Trash / Purge Lifecycle
```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Client as Dashboard UI
    participant API as Route Handler (/api/files/[fileId])
    participant DB as Neon PostgreSQL
    participant IK as ImageKit CDN

    User->>Client: Click "Move to Trash"
    Client->>API: PATCH /api/files/[fileId]/trash
    API->>DB: UPDATE files SET is_trash = true WHERE id = fileId
    DB-->>API: Updated file record
    API-->>Client: 200 OK (Soft-deleted)
    
    User->>Client: Click "Empty Trash" (Permanent Delete)
    Client->>API: DELETE /api/files/empty-trash
    API->>DB: SELECT * FROM files WHERE is_trash = true
    DB-->>API: List of trashed files
    API->>IK: Bulk delete file assets from cloud storage
    API->>DB: DELETE FROM files WHERE is_trash = true
    DB-->>API: Deletion confirmed
    API-->>Client: 200 OK (Purged permanently)
```

---

## ✨ Features

- 🔒 **Enterprise Authentication**: User sign-up, email verification code workflows, sign-in, and session management powered by **Clerk**.
- 📁 **Hierarchical Folders**: Create nested folders with real-time path tracking, breadcrumbs, and directory navigation.
- ⚡ **Drag & Drop Uploads**: Interactive dropzone with client-side file size verification (5MB limit) and upload progress indicators.
- ⭐ **Star & Favorites**: Instant bookmarking for quick filtering and access.
- 🗑️ **Two-Tier Deletion & Recovery**:
  - **Soft Trash**: Move files to trash and restore them anytime.
  - **Permanent Purge**: Clean up storage by permanently deleting files from both Neon PostgreSQL and ImageKit cloud storage simultaneously.
- 🖼️ **CDN Transformations & Optimized Viewer**: High-resolution image previewing and transformed direct downloads via ImageKit.
- 🎨 **Modern Dark Aesthetic**: Responsive dark theme built with **HeroUI** and **Tailwind CSS**.

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) | React framework with Server Components & API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end static type safety |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [HeroUI](https://heroui.com/) | Accessible, modern dark UI components |
| **Authentication** | [Clerk](https://clerk.com/) | Secure authentication, user management & middleware guards |
| **Database** | [Neon PostgreSQL](https://neon.tech/) | Serverless cloud PostgreSQL database |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL schema modeling & migrations |
| **Media Storage** | [ImageKit](https://imagekit.io/) | Global CDN delivery, real-time media transformations |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography |

---

## 🚀 Getting Started

Follow these steps to clone and run the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)
- Accounts for:
  - [Clerk](https://clerk.com/) (for authentication keys)
  - [Neon](https://neon.tech/) (for serverless PostgreSQL database connection)
  - [ImageKit](https://imagekit.io/) (for cloud image storage and CDN)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/syncstack.git
cd syncstack
```

---

### 2. Install Required Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
cp .env.example .env.local
```

Fill in your respective API credentials:

```env
# Clerk Authentication (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# ImageKit Storage & CDN (https://imagekit.io)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Fallback URLs
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database - Neon PostgreSQL (https://neon.tech)
DATABASE_URL=postgresql://username:password@ep-your-endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require
```

---

### 4. Push Database Schema to Neon

Run Drizzle push to create the `files` schema in your Neon PostgreSQL database:

```bash
npm run db:push
```

---

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000` |
| `npm run build` | Builds the optimized production application bundle |
| `npm run start` | Runs the built production server |
| `npm run lint` | Runs ESLint to check for code quality and errors |
| `npm run db:push` | Pushes the Drizzle schema directly to Neon PostgreSQL |
| `npm run db:generate` | Generates SQL migration files from Drizzle schema |
| `npm run db:studio` | Opens Drizzle Studio GUI to view and edit database rows |

---

## 🤝 Contributing & Feedback

Contributions, issues, and feature requests are welcome!

- 🐛 **Found a bug?** Open an [Issue](https://github.com/yourusername/syncstack/issues).
- 💡 **Have a feature idea?** Submit a [Pull Request](https://github.com/yourusername/syncstack/pulls).
- 🌟 **Like the project?** Feel free to fork and give the repository a star!

### How to Contribute:
1. **Fork** the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📺 Reference & Learning Resources

This project was built and inspired while learning from the tutorial series by **Hitesh Choudhary (Chai aur Code)**:

- 🎥 **Reference Video**: [Next.js Full Stack Project - Droply / Chai aur Code](https://www.youtube.com/@chaiaurcode)
- 🔗 **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
- 🔗 **Neon PostgreSQL Docs**: [neon.tech/docs](https://neon.tech/docs)
- 🔗 **Drizzle ORM Docs**: [orm.drizzle.team](https://orm.drizzle.team)
- 🔗 **ImageKit Next.js Integration**: [imagekit.io/docs](https://docs.imagekit.io)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
