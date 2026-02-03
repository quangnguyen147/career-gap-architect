# Career Gap Architect

An AI-powered app that analyzes the gap between a Resume and a Job Description and generates missing skills, a learning roadmap, and interview questions.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma
- Cache: Redis
- Containerization: Docker Compose

## Features

- Upload Resume (PDF, DOCX, TXT)
- Paste Job Description
- Semantic gap analysis
- Missing skill detection
- Learning roadmap generation
- Interview question suggestions
- Redis caching for performance

## Requirements

- Docker
- Docker Compose

## Run Locally

```bash
git clone https://github.com/yourname/career-gap-architect.git
cd career-gap-architect
//Run by docker
docker compose down -v
docker compose up -d --build
docker exec -it career_api npx prisma db push
docker restart career_api


Frontend: http://localhost:5173
Backend: http://localhost:4000
```
