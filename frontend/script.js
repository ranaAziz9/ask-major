const $ = (sel) => document.querySelector(sel);

const healthBox = $('#healthBox');
const searchBtn = $('#searchBtn');

async function checkHealth() {
  const apiBase = $('#apiBase').value.trim();

  try {
    const response = await fetch(`${apiBase}/api/health`);
    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();

    healthBox.textContent =
      data.status === 'ok'
        ? '✅ Backend is ready.'
        : '⚠️ Backend is running, but course data is not ready.';
  } catch (error) {
    healthBox.textContent = '❌ Unable to connect to the backend.';
  }
}

async function searchCourse() {
  const apiBase = $('#apiBase').value.trim();
  const courseCode = $('#courseCode').value.trim();

  if (!courseCode) return;

  searchBtn.disabled = true;
  searchBtn.textContent = 'Searching...';

  try {
    const response = await fetch(`${apiBase}/api/course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_code: courseCode })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    renderResult(data);
  } catch (error) {
    renderError(error.message || String(error));
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search';
  }
}

function renderResult(data) {
  const box = $('#resultBox');
  box.hidden = false;

  $('#credits').textContent = data.Credits || '—';
  $('#prereq').textContent = data.prerequisites || '—';
  $('#desc').textContent = data.description || '—';
}

function renderError(message) {
  const box = $('#resultBox');
  box.hidden = false;

  $('#credits').textContent = '—';
  $('#prereq').textContent = '—';
  $('#desc').textContent = `Error: ${message}`;
}

searchBtn.addEventListener('click', searchCourse);
window.addEventListener('load', checkHealth);

$('#courseCode').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchCourse();
  }
});