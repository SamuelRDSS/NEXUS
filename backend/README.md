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
- `GET /api/news`: agrega manchetes dos feeds RSS do Anime News Network e Anime Corner, com atribuição e link para a matéria original. A resposta fica em cache por 10 minutos; se uma fonte falhar, as demais ainda podem ser exibidas.
- `GET /api/bot/daily-post`: retorna a pergunta diária pré-escrita do Nexus Bot, identificada como bot. A pergunta é escolhida por data UTC, não usa IA e não é salva no banco.

O frontend usa `VITE_API_URL` (por exemplo, `http://localhost:8000`) para acessar a API. Configure o endereço público da API no ambiente de build do frontend ao publicar. As manchetes podem estar em inglês; a Nexus mostra título, fonte, categoria e data e direciona o usuário ao site de origem.
