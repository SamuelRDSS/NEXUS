# Nexus Otaku API

## FastAPI + PostgreSQL

1. Crie um banco PostgreSQL externo, por exemplo no Neon.
2. No arquivo `.env`, configure a URL fornecida pelo serviço:

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
```

3. No diretório `backend`, instale as dependências e execute:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

A API ficará disponível em `http://localhost:8000`.

No Render, use:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `DATABASE_URL` e `FRONTEND_URL`

Endpoints atuais:

- `GET /api/health`
- `GET /api/posts`
