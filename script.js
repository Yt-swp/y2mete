const urlInput = document.getElementById("video-url");
const fileInput = document.getElementById("file-input");
const pasteBtn = document.getElementById("paste-btn");
const openBtn = document.getElementById("generate-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const previewEl = document.getElementById("preview");
const downloadLink = document.getElementById("download-link");
const formatSelect = document.getElementById("format-select");

let currentObjectUrl = null;

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

function setStatus(msg, isError = false) {
  statusEl.textContent = msg || "";
  statusEl.style.color = isError ? "#f97373" : "#cbd5ff";
}

pasteBtn.addEventListener("click", async () => {
  if (!navigator.clipboard) {
    setStatus("Clipboard is not available in this browser.", true);
    return;
  }
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text.trim();
    setStatus("Pasted link from clipboard. Click Open video to load it.");
  } catch (e) {
    setStatus("Could not read from clipboard.", true);
  }
});

openBtn.addEventListener("click", () => {
  setStatus("");
  resultEl.classList.add("hidden");

  const file = fileInput.files[0];
  const url = urlInput.value.trim();

  // clear previous object URL
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  let sourceUrl = "";
  let downloadName = "video";

  if (file) {
    // Local file selected
    currentObjectUrl = URL.createObjectURL(file);
    sourceUrl = currentObjectUrl;
    downloadName = file.name || "video.mp4";
  } else if (url) {
    // URL provided
    if (!isDirectVideoUrl(url)) {
      setStatus(
        "This looks like a normal web page link. Use only direct .mp4 / .webm file URLs that you are allowed to use.",
        true
      );
      return;
    }
    sourceUrl = url;
    const parts = url.split("/");
    downloadName = parts[parts.length - 1] || "video.mp4";
  } else {
    setStatus("Select a video file or paste a direct video link first.", true);
    return;
  }

  // Load into player
  previewEl.src = sourceUrl;
  downloadLink.href = sourceUrl;
  downloadLink.download = downloadName;

  const fmt = formatSelect.value;
  if (fmt === "mp4" && !downloadName.toLowerCase().endsWith(".mp4")) {
    setStatus(
      "Selected MP4 but the file is not .mp4 – it may still play, depending on your browser."
    );
  } else if (fmt === "webm" && !downloadName.toLowerCase().endsWith(".webm")) {
    setStatus(
      "Selected WEBM but the file is not .webm – playback depends on your browser."
    );
  } else {
    setStatus("Video loaded. Use the player and Save a copy if needed.");
  }

  resultEl.classList.remove("hidden");
});
