# backend/rag_core.py
from __future__ import annotations
from pathlib import Path
from typing import Dict, Any
import re

import pandas as pd

# =========================
# المسار
# =========================
BASE      = Path(__file__).parent
EXCEL_DIR = BASE / "dataset_excel"

# =========================
# الفهرس في الذاكرة
# =========================
_index: Dict[str, Dict[str, str]] = {}


# =========================
# تنظيف القيم
# =========================
def _clean(s: Any) -> str:
    if s is None:
        return ""
    v = re.sub(r"\s+", " ", str(s)).strip()
    return "" if v.upper() in ("NONE", "N/A", "NULL", "-", "NAN", "") else v


# =========================
# قراءة ملف CSV/XLSX/XLS
# =========================
def _load_file(path: Path) -> pd.DataFrame:
    if path.suffix.lower() == ".csv":
        for enc in ("utf-8-sig", "cp1252", "cp1256", "utf-8"):
            try:
                return pd.read_csv(path, encoding=enc)
            except Exception:
                continue
    return pd.read_excel(path)


# =========================
# بناء الفهرس مباشرة من dataset_excel
# =========================
def _build_index() -> Dict[str, Dict[str, str]]:
    index: Dict[str, Dict[str, str]] = {}

    files = (
        list(EXCEL_DIR.glob("*.csv")) +
        list(EXCEL_DIR.glob("*.xlsx")) +
        list(EXCEL_DIR.glob("*.xls"))
    )

    if not files:
        raise FileNotFoundError(f"ما في ملفات في: {EXCEL_DIR}")

    for path in files:
        try:
            df = _load_file(path)
        except Exception as e:
            print(f"⚠️  فشل قراءة {path.name}: {e}")
            continue

        df.columns = [str(c).strip().lower() for c in df.columns]
        df = df.dropna(how="all")

        if "course_code" not in df.columns:
            continue

        df = df[df["course_code"].notna()]
        df = df[df["course_code"].astype(str).str.strip() != ""]
        df = df.drop_duplicates(subset=["course_code"], keep="first")

        for _, row in df.iterrows():
            code = str(row["course_code"]).strip().upper()
            if not code or code == "NAN":
                continue
            if code in index:
                continue
            index[code] = {
                "Credits":       _clean(row.get("credits",       "")),
                "prerequisites": _clean(row.get("prerequisites", "")),
                "description":   _clean(row.get("description",   "")),
            }

    return index


# =========================
# تحميل عند الإقلاع
# =========================
def load_index_and_chain() -> None:
    global _index
    _index = _build_index()
    print(f"✅  تم تحميل {len(_index)} مقرر من الملفات مباشرةً.")


def is_index_ready() -> bool:
    return len(_index) > 0


# =========================
# البحث المباشر
# =========================
def find_by_course_code(course_code: str) -> Dict[str, Any]:
    empty = {"answer": {"Credits": "", "prerequisites": "", "description": ""}}

    if not is_index_ready():
        raise RuntimeError("الفهرس غير جاهز.")

    code = re.sub(r"[\s\-]", "", (course_code or "").strip().upper())
    if not code:
        return empty

    if code in _index:
        return {"answer": _index[code]}

    for key in _index:
        if re.sub(r"[\s\-]", "", key) == code:
            return {"answer": _index[key]}

    return empty