# Database Setup - Local PostgreSQL

## ✅ What Was Done

1. Created `.env` file with your local PostgreSQL credentials
2. Generated Prisma client
3. Created database schema (18 models)
4. Seeding initial data (roles, permissions, admin user, sample projects)

## 📝 Database Connection

- **Host:** localhost:5432
- **Database:** asagus_admin  
- **User:** postgres
- **Password:** Gang$ter111

## 🚀 Quick Commands (From Root Directory)

```bash
# Run everything
pnpm dev:all              # Main site + Admin panel

# Admin panel only
pnpm dev:admin            # All microservices + frontend

# Main site only  
pnpm dev                  # Portfolio website
```

## 🔑 Admin Login

- **URL:** http://localhost:3001
- **Email:** admin@asagus.com
- **Password:** Admin@2026Secure!

## 🗄️ Database Commands (From admin-panel folder)

```bash
cd admin-panel

pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to database
pnpm db:seed              # Seed initial data
pnpm db:studio            # Open Prisma Studio (GUI)
pnpm db:setup             # Run all three commands above
```

## 📊 What's Seeded

- **4 Roles:** super_admin, admin, editor, viewer
- **53 Permissions:** All CRUD operations
- **1 Admin User:** admin@asagus.com (super_admin role)
- **Sample Projects:** LOGBOG, AI Vocal Expert
- **Default Settings:** Site configuration

## ⚙️ Services Running

| Service | Port | URL |
|---------|------|-----|
| Main Site | 3000 | http://localhost:3000 |
| Admin Frontend | 3001 | http://localhost:3001 |
| API Gateway | 4000 | http://localhost:4000 |
| Auth Service | 4001 | http://localhost:4001 |
| Content Service | 4002 | http://localhost:4002 |
| Analytics Service | 4003 | http://localhost:4003 |

## 🎯 Next Steps

1. Run: `pnpm dev:all`
2. Open: http://localhost:3001
3. Login with admin credentials above
4. Start managing your content!

---

**Note:** No Docker required - using your local PostgreSQL installation!
