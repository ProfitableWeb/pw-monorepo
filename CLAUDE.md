# ProfitableWeb Multi-Repo Project

## Repository Structure

- `profitable-web-frontend/` - Next.js public website (Git repo)
- `profitable-web-admin/` - Next.js admin panel (Git repo)
- `profitable-web-backend/` - FastAPI backend (Git repo)
- `profitable-web-docs/` - Project documentation (Git repo)

## Development Status

### Frontend (profitable-web-frontend) 🚧

- ✅ Main page implemented with mock data
- ✅ Basic project structure configured
- 🔄 In active development

### Backend (profitable-web-backend)

- 📋 Planned

### Admin Panel (profitable-web-admin)

- 📋 Planned

## Dependencies

- Frontend depends on Backend API
- Admin depends on Backend API
- All repos share common data models from docs/

## Git Workflow Rules

- Each directory has its own .git
- Commits must be made individually per repository
- Changes affecting multiple repos require separate commits in each repo
- Always specify which repo(s) are affected in task description

## API Contracts

- Backend exposes REST API at /api/v1
- Frontend/Admin consume this API
- See docs/architecture/API_DESIGN.md for details
