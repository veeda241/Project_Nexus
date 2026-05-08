# NEXUS — Multimodal RAG System

A private, self-hosted multimodal search engine with AI-generated answers. Upload PDFs, Word docs, images, and audio files into knowledge bases, then ask natural language questions and get grounded answers with inline citations.

---

## Prerequisites

| Tool | Install |
|---|---|
| Python 3.10+ | https://python.org |
| Node.js 20+ | https://nodejs.org |
| pnpm | `npm i -g pnpm` |

---

## Setup

### Backend

```bash
cd Backend
pip install -r requirements.txt
pip install spacy
python -m spacy download en_core_web_sm
```

Edit `Backend/.env` — minimum required:

```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
```

Get a free Groq key at https://console.groq.com — the default model (`llama-3.3-70b-versatile`) is fast and free.

Other supported providers: set `LLM_PROVIDER` to `openai`, `gemini`, or `ollama` and fill the matching key.

### Frontend

```bash
cd Frontend
pnpm install
```

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Startup

Run each command in a **separate terminal**, in this order:

### 1. ChromaDB (vector store)

```bash
cd Backend
chroma run --host localhost --port 8100 --path ./chroma_data
```

> First run downloads ~200MB. Wait for `Application startup complete`.

### 2. FastAPI server

```bash
cd Backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Celery worker (document ingestion)

```bash
cd Backend
celery -A app.worker.celery_app worker --loglevel=info --pool=solo
```

> `--pool=solo` required on Windows. Linux/Mac can omit it.

### 4. Frontend

```bash
cd Frontend
pnpm dev
```

---

## Access

| | URL |
|---|---|
| **App** | http://localhost:3000 |
| **API docs** | http://localhost:8000/docs |

**Default admin login:**
```
Email:    admin@nexus.local
Password: changeme123
```

---

## Using the App

### 1. Create a Knowledge Base
Login → click **+ New KB** → give it a name.

### 2. Upload Documents
KB → **Documents** tab → drag and drop files.

Supported formats:
- **Documents:** PDF, DOCX
- **Images:** PNG, JPG, WEBP, GIF, BMP, TIFF
- **Audio/Video:** MP3, WAV, M4A, MP4, MKV, MOV, WEBM

Watch the progress bar — status flips to `ready` when ingestion is complete.

### 3. Query
KB → **Query** tab → type a question → press Enter.

- AI answer appears with numbered citation chips `[1]` `[2]`
- Click a chip → see source file, page, or timestamp
- Click **Show chain** → open evidence graph for that citation
- Retrieved chunks listed below with similarity scores

Options panel (gear icon):
- **Top-K** — number of chunks to retrieve (1–20)
- **Modality** — filter to text/image/audio only
- **Evidence chains** — expand linked chunks
- **Generate answer** — toggle LLM answer on/off

### 4. Evidence Graph
KB → **Graph** tab.

Node colors:
- 🔵 Blue = text chunk
- 🟣 Violet = image chunk
- 🟢 Green = audio chunk

Edge colors:
- Cyan = semantic similarity
- Amber = shared named entities
- Pink = temporal co-occurrence

Click a node → detail drawer. Use the legend (top-left) to filter by modality or link type.

### 5. Admin Panel
Sidebar → **Admin** (admin role only).

- **Users** — change roles, deactivate accounts
- **Usage** — total documents, chunks, queries
- **LLM Status** — verify provider is reachable before querying

---

## Architecture

```
Browser (Next.js 15)
        │  JWT / REST
        ▼
FastAPI (port 8000)
        │
        ├─── ChromaDB (port 8100)   ← vector search
        ├─── SQLite (nexus.db)      ← metadata
        ├─── NetworkX graph         ← evidence links
        └─── Celery worker          ← async ingestion
                    │
                    ├── SentenceTransformers  (text embeddings)
                    ├── CLIP                  (image embeddings)
                    ├── Whisper               (audio transcription)
                    └── spaCy                 (named entity recognition)
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Ingestion stuck at `queued` | Celery worker not running — start terminal 3 |
| Ingestion error: `'list' object has no attribute 'ents'` | `pip install spacy && python -m spacy download en_core_web_sm` |
| Query shows error toast | Admin → LLM Status — provider must show **Reachable** |
| All LLM providers unreachable | Set `GROQ_API_KEY` in `.env`, restart FastAPI |
| Login loops back to login page | Open browser devtools → Application → Local Storage → clear `nexus_token` |
| `chroma` command not found | `pip install chromadb` |
| ChromaDB connection refused | Start terminal 1 before terminal 2 |
| Frontend blank / 404 | Run `pnpm install` then `pnpm dev` from `Frontend/` |

---

## Public Demo (Vercel + Cloudflare Tunnel)

```bash
# Expose backend publicly
cloudflared tunnel --url http://localhost:8000
# → outputs: https://xxxx.trycloudflare.com
```

In Vercel project settings, set:
```
NEXT_PUBLIC_API_BASE_URL = https://xxxx.trycloudflare.com
```

In `Backend/.env`, add the Vercel domain to CORS:
```env
CORS_ORIGINS=["https://your-app.vercel.app", "http://localhost:3000"]
```

Restart FastAPI after changing `.env`.

---

## Project Structure

```
Project_Nexus/
├── Backend/
│   ├── app/
│   │   ├── api/routes/      # FastAPI endpoints
│   │   ├── auth/            # JWT + RBAC
│   │   ├── db/              # SQLite models
│   │   ├── embeddings/      # SentenceTransformers + CLIP
│   │   ├── graph/           # NetworkX graph + entity linker
│   │   ├── llm/             # Groq / OpenAI / Gemini / Ollama
│   │   ├── processing/      # PDF/DOCX/image/audio extractors
│   │   ├── vectorstore/     # ChromaDB wrapper
│   │   └── worker/          # Celery tasks
│   ├── .env                 # ← edit this with your keys
│   └── requirements.txt
└── Frontend/
    ├── app/                 # Next.js App Router pages
    ├── components/          # React components
    ├── lib/
    │   ├── api/             # API client (axios)
    │   ├── hooks/           # TanStack Query hooks
    │   ├── stores/          # Zustand auth store
    │   └── types/           # TypeScript types
    └── .env.local           # ← create this with API URL
```
