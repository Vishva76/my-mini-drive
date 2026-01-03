# MiniDrive - Project Structure

```
my-mini-drive/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── files/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # GET, PATCH, DELETE, PUT (file operations)
│   │   │   └── route.ts          # GET (list files with filters)
│   │   ├── folders/
│   │   │   └── route.ts          # GET, POST, PATCH, DELETE (folder operations)
│   │   ├── history/
│   │   │   └── [fileId]/
│   │   │       └── route.ts      # GET (file history)
│   │   ├── tag/
│   │   │   └── route.ts          # GET, POST (tag management)
│   │   └── upload/
│   │       └── route.ts          # POST (file upload)
│   ├── drive/
│   │   └── page.tsx              # My Drive page
│   ├── file/
│   │   └── [id]/
│   │       └── page.tsx          # File preview page
│   ├── trash/
│   │   └── page.tsx              # Trash page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (Recent Files)
│
├── components/                   # React Components
│   ├── common/
│   │   ├── EmptyState.tsx        # Empty state component
│   │   ├── Loader.tsx            # Loading spinner
│   │   └── SearchBar.tsx         # Search input component
│   ├── files/
│   │   ├── FileActions.tsx       # File action buttons
│   │   ├── FileCard.tsx          # File card (grid view)
│   │   ├── FileGrid.tsx          # Grid view container
│   │   └── FileList.tsx          # List view container
│   ├── folders/
│   │   ├── BreadcrumbNav.tsx     # Breadcrumb navigation
│   │   └── FolderTree.tsx        # Folder tree sidebar
│   ├── layout/
│   │   ├── AppLayout.tsx         # Main app layout wrapper
│   │   └── sidebar.tsx           # Sidebar navigation
│   └── modals/
│       ├── DeleteConfirm.tsx     # Delete confirmation modal
│       ├── DetailsModal.tsx      # File details modal
│       ├── RenameModal.tsx       # Rename modal
│       ├── TagModal.tsx          # Tag management modal
│       └── UploadModal.tsx       # File upload modal
│
├── lib/                          # Utility Libraries
│   ├── services/
│   │   ├── file.service.ts       # File service functions
│   │   ├── folder.service.ts     # Folder service functions
│   │   └── history.service.ts    # History service functions
│   ├── db.ts                     # MongoDB connection
│   ├── storage.ts                # File storage utilities
│   └── validators.ts             # Validation utilities
│
├── models/                       # Mongoose Models
│   ├── file.ts                   # File model
│   ├── FileHistory.ts            # File history model
│   └── folder.ts                 # Folder model
│
├── types/                        # TypeScript Types
│   ├── file.ts                   # File type definitions
│   ├── folder.ts                 # Folder type definitions
│   └── history.ts                # History type definitions
│
├── public/                      # Static Assets
│   ├── uploads/                 # Uploaded files directory
│   └── *.svg                     # SVG icons
│
├── .env.example                  # Environment variables example
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
└── tsconfig.json                 # TypeScript configuration
```

## Key Directories

- **`app/`** - Next.js App Router pages and API routes
- **`components/`** - Reusable React components organized by feature
- **`lib/`** - Business logic, services, and utilities
- **`models/`** - Mongoose database models
- **`types/`** - TypeScript type definitions
- **`public/`** - Static files served directly

