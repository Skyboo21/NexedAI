# NexedAI FastAPI Backend

Repositori backend FastAPI terpisah untuk API, autentikasi, serta AI & RAG Engine platform NexedAI.

## Cara Menjalankan Secara Lokal

1. **Buat & Aktifkan Virtual Environment:**
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Linux / macOS:
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Jalankan Server Development:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

Backend akan berjalan di `http://localhost:8000`.
- Dokumentasi Interaktif Swagger UI: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`
- Auth Current User: `http://localhost:8000/api/auth/me`
- Modul Katalog: `http://localhost:8000/api/modul`
