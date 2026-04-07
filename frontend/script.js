const $ = (selector) => document.querySelector(selector);

const input = $("#courseInput");
const searchBtn = $("#searchBtn");
const resultBox = $("#resultBox");
const errorBox = $("#errorBox");
const creditsEl = $("#credits");
const prereqEl = $("#prereq");
const descEl = $("#desc");

const API_BASE = "https://ask-major-api.onrender.com";

function showError(message) {
  if (resultBox) resultBox.hidden = true;
  if (errorBox) {
    errorBox.hidden = false;
    errorBox.textContent = message;
  }
}

function showResult(data) {
  if (errorBox) errorBox.hidden = true;
  if (resultBox) resultBox.hidden = false;

  if (creditsEl) creditsEl.textContent = data.Credits || "—";
  if (prereqEl) prereqEl.textContent = data.prerequisites || "—";
  if (descEl) descEl.textContent = data.description || "—";
}

async function searchCourse(courseCode) {
  try {
    const response = await fetch(`${API_BASE}/api/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_code: courseCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    showResult(data);
  } catch (error) {
    showError("Could not connect to the server. Please make sure the backend is running and try again.");
    console.error(error);
  }
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const courseCode = input?.value.trim();
    if (!courseCode) return;
    searchCourse(courseCode);
  });
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const courseCode = input.value.trim();
      if (!courseCode) return;
      searchCourse(courseCode);
    }
  });
}

window.fillAndSearch = function (code) {
  if (!input) return;
  input.value = code;
  searchCourse(code);
};