# 🎓 Ask Major — KAU Course Search System

Ask Major is a web-based course search system that allows students to quickly explore university courses using course codes and instantly view course details.

## 🌐 Live Demo

**Website:** `https://ask-major.vercel.app`
**API:** `https://ask-major-api.onrender.com/api/health`

---

## 🚀 Features

* 🔍 Search courses by course code
* 📚 View:

  * Course credits
  * Prerequisites
  * Course description
* ⚡ Fast backend API using FastAPI
* 💻 Clean and modern responsive interface
* 🌐 Deployed online for public access

---

## 🧠 Tech Stack

* **Backend:** Python, FastAPI
* **Frontend:** HTML, CSS, JavaScript
* **Data Source:** CSV / Excel course catalog
* **Deployment:** Vercel + Render

---

## 📂 Project Structure

```text
ask-major/
├── backend/
│   ├── backend.py
│   ├── search_core.py
│   ├── dataset_excel/
│   │   └── Courses_Final2.csv
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .gitignore
├── preview.png
└── README.md
```

---

## 🔌 API Endpoints

### Health Check

`GET /api/health`

### Search Course

`POST /api/course`

Example request body:

```json
{
  "course_code": "CPCS331"
}
```

---

## 📸 Preview

![Ask Major Preview](preview.png)

---

## ▶️ Local Run

### 1. Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn backend:app --reload
```

### 2. Run frontend

Open `frontend/index.html` directly in the browser
or use:

```bash
cd frontend
python -m http.server 5173
```

---

## Author
**Rana Alzahrani**
## Email
**ranaalzahrani047@gmail.com**