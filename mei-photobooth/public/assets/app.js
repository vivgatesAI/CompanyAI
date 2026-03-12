const presets = [
  { key: "mei_massachusetts", label: "MEI in Massachusetts" },
  { key: "lobster_harbor", label: "Lobster Harbor Pop" },
  { key: "retro_aquarium", label: "Futuristic Retro Aquarium" },
  { key: "clinical_future", label: "Clinical Future Boston" },
  { key: "beacon_night", label: "Beacon Night Glow" },
  { key: "custom", label: "Custom" },
];

const video = document.getElementById("video");
const captureCanvas = document.getElementById("captureCanvas");
const previewImg = document.getElementById("previewImg");
const resultImg = document.getElementById("resultImg");
const startCameraBtn = document.getElementById("startCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const uploadInput = document.getElementById("uploadInput");
const clearBtn = document.getElementById("clearBtn");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveLocalBtn = document.getElementById("saveLocalBtn");
const presetGrid = document.getElementById("presetGrid");
const customPrompt = document.getElementById("customPrompt");
const progressWrap = document.getElementById("progressWrap");
const statusEl = document.getElementById("status");

let selectedPreset = "mei_massachusetts";
let capturedBlob = null;
let outputDataUrl = null;
let stream = null;

function setStatus(message, kind = "") {
  statusEl.className = `status ${kind}`;
  statusEl.textContent = message || "";
}

function renderPresets() {
  presetGrid.innerHTML = "";
  presets.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = `preset ${selectedPreset === p.key ? "active" : ""}`;
    btn.type = "button";
    btn.textContent = p.label;
    btn.onclick = () => {
      selectedPreset = p.key;
      customPrompt.style.display = selectedPreset === "custom" ? "block" : "none";
      renderPresets();
    };
    presetGrid.appendChild(btn);
  });
}

function updateGenerateAvailability() {
  generateBtn.disabled = !capturedBlob;
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 1920 },
      },
      audio: false,
    });
    video.srcObject = stream;
    video.style.display = "block";
    previewImg.style.display = "none";
    captureBtn.disabled = false;
    setStatus("Camera ready", "ok");
  } catch (err) {
    setStatus("Camera access denied. You can upload a photo instead.", "err");
  }
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function captureFromVideo() {
  if (!video.videoWidth || !video.videoHeight) return;
  captureCanvas.width = video.videoWidth;
  captureCanvas.height = video.videoHeight;
  const ctx = captureCanvas.getContext("2d");
  ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  const blob = await new Promise((resolve) => captureCanvas.toBlob(resolve, "image/jpeg", 0.95));
  capturedBlob = blob;
  const dataUrl = await blobToDataURL(blob);
  previewImg.src = dataUrl;
  previewImg.style.display = "block";
  video.style.display = "none";
  updateGenerateAvailability();
  setStatus("Selfie captured", "ok");
}

function clearAll() {
  capturedBlob = null;
  outputDataUrl = null;
  previewImg.src = "";
  resultImg.src = "";
  resultImg.style.display = "none";
  previewImg.style.display = stream ? "none" : "none";
  if (stream) video.style.display = "block";
  generateBtn.disabled = true;
  downloadBtn.disabled = true;
  saveLocalBtn.disabled = true;
  setStatus("");
}

async function generate() {
  if (!capturedBlob) return;
  progressWrap.classList.add("active");
  generateBtn.disabled = true;
  setStatus("Processing started…", "");

  const fd = new FormData();
  fd.append("image", capturedBlob, "input.jpg");
  fd.append("preset", selectedPreset);
  if (selectedPreset === "custom") {
    fd.append("customPrompt", customPrompt.value || "");
  }
  fd.append("aspectRatio", window.innerHeight >= window.innerWidth ? "4:5" : "16:9");

  try {
    const resp = await fetch("/api/edit", { method: "POST", body: fd });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "Generation failed");

    outputDataUrl = data.imageBase64;
    resultImg.src = outputDataUrl;
    resultImg.style.display = "block";
    downloadBtn.disabled = false;
    saveLocalBtn.disabled = false;
    setStatus("Image ready", "ok");
  } catch (err) {
    setStatus(err.message || "Failed to process image", "err");
  } finally {
    progressWrap.classList.remove("active");
    generateBtn.disabled = false;
  }
}

function downloadResult() {
  if (!outputDataUrl) return;
  const a = document.createElement("a");
  a.href = outputDataUrl;
  a.download = `mei-photobooth-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function saveLocal() {
  if (!outputDataUrl) return;
  const key = "mei.photobooth.saved";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.unshift({ id: Date.now(), image: outputDataUrl, preset: selectedPreset });
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
  setStatus("Saved locally on this phone/browser", "ok");
}

startCameraBtn.onclick = startCamera;
captureBtn.onclick = captureFromVideo;
clearBtn.onclick = clearAll;
generateBtn.onclick = generate;
downloadBtn.onclick = downloadResult;
saveLocalBtn.onclick = saveLocal;

uploadInput.onchange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  capturedBlob = file;
  const dataUrl = await blobToDataURL(file);
  previewImg.src = dataUrl;
  previewImg.style.display = "block";
  video.style.display = "none";
  updateGenerateAvailability();
  setStatus("Photo uploaded", "ok");
};

renderPresets();
updateGenerateAvailability();