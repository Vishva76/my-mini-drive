# MiniDrive – Local File Management System

A local-only file management web application built with Next.js that simulates core Google Drive features such as folder organization, file preview, tagging, search, filters, and file history tracking—without cloud storage, sharing, or authentication.

## 📌 Project Overview

MiniDrive is designed purely for learning and development to understand real-world application architecture, UI complexity, and data modeling. It demonstrates skills in UI architecture, data modeling, UX design, file workflows, and audit logging.

## 🎯 Goals & Learning Objectives

- Learn component-based architecture using Next.js
- Understand file handling and metadata management
- Implement advanced UI patterns (modals, filters, previews)
- Practice audit logging using file history
- Build a realistic CRUD-heavy application

## 🚫 Out of Scope (Intentional)

- No authentication
- No file sharing
- No cloud storage
- No multi-user support
- Local development only

## 🧱 Application Pages

1. **Home (Recent Files)** - Recently updated files with global search and quick actions
2. **My Drive** - Folder navigation with breadcrumb, file list/grid view, search, filters, and sorting
3. **File Preview** - Image, PDF, and video preview with quick file actions
4. **File Details** - File metadata, timestamps, and file history timeline
5. **Trash** - Soft-deleted files with restore or permanently delete options

## 🧩 Core Features

### File Management
- Upload files from local machine
- Save files to local `/public/uploads` directory
- Rename, move, delete files
- Soft delete support

### Folder Management
- Create nested folders
- Rename folders
- Navigate nested folders with breadcrumb navigation

### Tags System
- Add multiple tags to files
- Remove tags
- Suggested tags (recently used)
- Filter files by tags
- Support multi-tag filtering

### Search & Filters
- **Search**: Case-insensitive file name search with partial matches
- **Filters**: File type (image/pdf/video/other), tags, folder, date range
- **Sorting**: Name (A–Z), last updated, file size

### File Metadata & History
- Store timestamps (created, updated, deleted)
- Maintain file history log with events:
  - CREATED
  - RENAMED
  - MOVED
  - TAGS_UPDATED
  - DELETED
  - RESTORED
- Display history timeline in file details

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **UI Library**: Ant Design (antd)
- **Storage**: Local filesystem (`public/uploads`)
- **Database**: MongoDB with Mongoose
- **State Management**: React state/hooks
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-mini-drive
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/minidrive
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minidrive
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for production

```bash
npm run build
npm start
```

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed project structure.

```
my-mini-drive/
├── app/              # Next.js App Router (pages & API routes)
├── components/       # React components
├── lib/             # Services & utilities
├── models/          # Mongoose models
├── types/           # TypeScript types
└── public/          # Static assets & uploads
```

## 🔧 API Routes

- `GET /api/files` - List files with filters
- `GET /api/files/[id]` - Get file details
- `PATCH /api/files/[id]` - Update file (rename, move, tags)
- `DELETE /api/files/[id]` - Delete file (soft delete)
- `PUT /api/files/[id]` - Restore file from trash
- `POST /api/upload` - Upload file
- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `PATCH /api/folders` - Update folder
- `DELETE /api/folders` - Delete folder
- `GET /api/tag` - Get all tags
- `POST /api/tag` - Update file tags
- `GET /api/history/[fileId]` - Get file history

## 🎨 UI Features

- **List & Grid View Toggle** - Switch between list and grid views
- **Modals** - Upload, rename, delete confirmation, tag management, file details
- **Empty States** - User-friendly empty state messages
- **Error Handling** - Clear error messages and feedback
- **Responsive Design** - Works on different screen sizes

## 📝 File Operations

- **Upload**: Drag & drop or click to upload files
- **Preview**: View images, PDFs, and videos directly in browser
- **Rename**: Change file names
- **Move**: Move files between folders
- **Delete**: Soft delete (move to trash) or permanent delete
- **Restore**: Restore files from trash
- **Tag**: Add/remove tags for better organization
- **Search**: Quick search by file name
- **Filter**: Filter by type, tags, folder
- **Sort**: Sort by name, date, or size

## 🔍 Development

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript is configured with strict mode. Check types with:

```bash
npx tsc --noEmit
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Ant Design Documentation](https://ant.design/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🚀 Future Enhancements

- Trash auto-cleanup
- File versioning
- Folder tags
- Advanced search syntax
- Offline indicators
- Drag & drop file upload
- Bulk operations

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

Built with ❤️ using Next.js, React, and TypeScript
