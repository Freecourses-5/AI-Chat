const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

const apiKeyInput = document.getElementById("apiKey");
const modelSelect = document.getElementById("model");
const chat = document.getElementById("chat");
const form = document.getElementById("form");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clearBtn");
const saveKey = document.getElementById("saveKey");
const toggleKey = document.getElementById("toggleKey");

apiKeyInput.value = localStorage.getItem("gemini_api_key") || "";
modelSelect.value = localStorage.getItem("gemini_model") || "gemini-2.5-flash";

let history = JSON.parse(localStorage.getItem("gemini_chat_history") || "[]");

function renderHistory() {
  chat.innerHTML = "";
  if (!history.length) {
    chat.innerHTML = `<div class="welcome"><h2>ابدأ المحادثة</h2><p>اكتب سؤالك في الأسفل.</p></div>`;
    return;
  }
  for (const item of history) addMessage(item.role, item.text);
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role === "user" ? "user" : "ai"}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(text) {
  statusEl.textContent = text;
}

saveKey.onclick = () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    setStatus("ضع مفتاح Gemini أولًا.");
    return;
  }
  localStorage.setItem("gemini_api_key", key);
  localStorage.setItem("gemini_model", modelSelect.value);
  setStatus("تم حفظ المفتاح على هذا الجهاز.");
};

toggleKey.onclick = () => {
  const hidden = apiKeyInput.type === "password";
  apiKeyInput.type = hidden ? "text" : "password";
  toggleKey.textContent = hidden ? "إخفاء" : "إظهار";
};

modelSelect.onchange = () => {
  localStorage.setItem("gemini_model", modelSelect.value);
};

clearBtn.onclick = () => {
  history = [];
  localStorage.removeItem("gemini_chat_history");
  renderHistory();
  setStatus("تم مسح المحادثة.");
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();
  const model = modelSelect.value;

  if (!apiKey) {
    setStatus("ضع Gemini API Key أولًا.");
    apiKeyInput.focus();
    return;
  }
  if (!prompt) return;

  addMessage("user", prompt);
  history.push({ role: "user", text: prompt });
  promptInput.value = "";
  sendBtn.disabled = true;
  setStatus("Gemini يفكر...");

  try {
    const contents = history.map(x => ({
      role: x.role === "user" ? "user" : "model",
      parts: [{ text: x.text }]
    }));

    const response = await fetch(
      API_BASE + encodeURIComponent(model) + ":generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text || "")
        .join("") || "لم يُرجع Gemini نصًا.";

    addMessage("ai", text);
    history.push({ role: "model", text });
    localStorage.setItem("gemini_chat_history", JSON.stringify(history));
    setStatus("تم.");
  } catch (err) {
    addMessage("ai", "حدث خطأ: " + err.message);
    setStatus("تحقق من API Key والنموذج وحالة الحصة المجانية.");
  } finally {
    sendBtn.disabled = false;
    promptInput.focus();
  }
};

renderHistory();
