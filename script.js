const urlInput = document.getElementById("video-url");
const pasteBtn = document.getElementById("paste-btn");
const generateBtn = document.getElementById("generate-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const previewEl = document.getElementById("preview");
const downloadLink = document.getElementById("download-link");
const formatSelect = document.getElementById("format-select");

function isDirectVideoUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return path.endsWith(".mp4") || path.endsWith(".webm");
  } catch {
    return false;
  }
}

pasteBtn.addEventListener("click", async () => {
  if (!navigator.clipboard) {
    statusEl.textContent = "Clipboard not available in this browser.";
    return;
  }
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text.trim();
    statusEl.textContent = "Pasted from clipboard. Click Generate.";
  } catch (e) {
    statusEl.textContent = "Could not read from clipboard.";
  }
});

generateBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  statusEl.textContent = "";
  resultEl.classList.add("hidden");

  if (!url) {
    statusEl.textContent = "Please paste a video URL first.";
    return;
  }
  if (!isDirectVideoUrl(url)) {
    statusEl.textContent =
      "This looks like a page link (YouTube / Facebook / etc). " +
      "This tool only accepts direct .mp4 / .webm file URLs you are allowed to use.";
    return;
  }

  // Set preview and download
  previewEl.src = url;
  downloadLink.href = url;

  const fmt = formatSelect.value;
  if (fmt === "mp4" && !url.toLowerCase().endsWith(".mp4")) {
    statusEl.textContent =
      "Selected MP4 but the link is not an .mp4 file. It may still play, but download depends on your browser.";
  } else if (fmt === "webm" && !url.toLowerCase().endsWith(".webm")) {
    statusEl.textContent =
      "Selected WEBM but the link is not a .webm file.";
  } else {
    statusEl.textContent = "Preview ready. If it plays, you can use Download now.";
  }

  resultEl.classList.remove("hidden");
});
