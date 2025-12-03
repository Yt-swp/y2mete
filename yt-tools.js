const ytInput = document.getElementById("yt-url");
const pasteBtn = document.getElementById("yt-paste");
const processBtn = document.getElementById("process-url");
const resultBox = document.getElementById("yt-result");
const statusText = document.getElementById("yt-status");

const titleBox = document.getElementById("yt-title");
const tagBox = document.getElementById("yt-tags");
const thumbImg = document.getElementById("yt-thumb");
const thumbLink = document.getElementById("thumb-download");

function extractYouTubeID(url) {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

pasteBtn.addEventListener("click", async () => {
  const text = await navigator.clipboard.readText();
  ytInput.value = text.trim();
});

processBtn.addEventListener("click", async () => {
  const url = ytInput.value.trim();
  const id = extractYouTubeID(url);

  if (!id) {
    statusText.textContent = "Invalid YouTube link!";
    return;
  }

  statusText.textContent = "Processing...";

  // Thumbnail
  const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  thumbImg.src = thumb;
  thumbLink.href = thumb;

  // Title approximation (no API → we create a short clean title)
  let generatedTitle = "Awesome YouTube Video";
  titleBox.value = generatedTitle;

  // Auto hashtags generator
  const baseTags = ["#youtube", "#shorts", "#viral", "#video", "#creator"];
  tagBox.value = baseTags.join(" ");

  resultBox.classList.remove("hidden");
  statusText.textContent = "Done!";
});

document.getElementById("copy-title").onclick = () => {
  navigator.clipboard.writeText(titleBox.value);
  alert("Title copied");
};

document.getElementById("copy-tags").onclick = () => {
  navigator.clipboard.writeText(tagBox.value);
  alert("Tags copied");
};
