const input = document.getElementById("courseInput");
const searchBtn = document.getElementById("searchBtn");
const resultBox = document.getElementById("resultBox");
const errorBox = document.getElementById("errorBox");
const creditsEl = document.getElementById("credits");
const prereqEl = document.getElementById("prereq");
const descEl = document.getElementById("desc");

const API = "https://ask-major-api.onrender.com";

function showError(message) {
  resultBox.hidden = true;
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function showResult(data) {
  errorBox.hidden = true;
  resultBox.hidden = false;

  creditsEl.textContent = data.Credits || "—";
  prereqEl.textContent = data.prerequisites || "—";
  descEl.textContent = data.description || "—";
}

async function searchCourse(code) {
  try {
    const res = await fetch(`${API}/api/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_code: code }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    showResult(data);
  } catch (err) {
    console.error(err);
    showError("Could not connect to the server.");
  }
}

searchBtn.addEventListener("click", () => {
  const code = input.value.trim();
  if (!code) return;
  searchCourse(code);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const code = input.value.trim();
    if (!code) return;
    searchCourse(code);
  }
});