# JARVAS AI — Python FastAPI Backend

This directory contains the Python FastAPI backend for JARVAS AI. It is designed to run on your desktop computer or a private GPU server, allowing your Android phone to offload heavy AI motion transfer processing while maintaining full privacy and free operation.

---

### Quick Start (On Your Computer)

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**:
   ```bash
   python main.py
   # or with uvicorn:
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

### Connecting Your Android Phone

1. Ensure your Android smartphone and computer are connected to the same Wi-Fi network.
2. Find your computer's local IP address (e.g. `192.168.1.50`).
3. In JARVAS AI on your phone:
   - Tap **Personal Parameters** > **Local Backend Config**.
   - Select **Python FastAPI Backend** and enter `http://192.168.1.50:8000`.
4. Your Android PWA will now send photo and reference video payloads directly to your computer/server for processing and receive the final MP4 video.
