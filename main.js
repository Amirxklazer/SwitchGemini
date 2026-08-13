const API_KEY = "AQ.Ab8RN6KF_Oe4HJByBB_IUhiCDbjHIl8m7jIEoi8zF2BzHu6hCg";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

const presetQuestions = [
  "What is the meaning of life?",
  "Explain quantum computing in simple terms.",
  "Give me a recipe for chocolate cake.",
  "Write a haiku about the ocean.",
  "What are the benefits of exercise?",
  "Tell me a joke."
];

let chats = [{ messages: [] }];
let currentChat = 0;
let selectedQuestion = 0;

const chatDiv = document.getElementById('chat');
const questionDiv = document.getElementById('question-list');
const statusDiv = document.getElementById('status');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat');
const exportBtn = document.getElementById('export-btn');

// Render questions
function renderQuestions() {
  questionDiv.innerHTML = '';
  presetQuestions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.textContent = q;
    btn.className = 'q-btn' + (i === selectedQuestion ? ' selected' : '');
    btn.onclick = () => { selectedQuestion = i; renderQuestions(); };
    questionDiv.appendChild(btn);
  });
}

// Render chat
function renderChat() {
  const chat = chats[currentChat];
  chatDiv.innerHTML = '';
  chat.messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'msg ' + (msg.role === 'user' ? 'user' : 'ai');
    div.textContent = msg.text;
    chatDiv.appendChild(div);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
  statusDiv.textContent = `Chat ${currentChat+1}/${chats.length}`;
}

// Send message to Gemini
async function sendMessage(text) {
  const chat = chats[currentChat];
  chat.messages.push({ role: 'user', text });
  renderChat();
  try {
    const resp = await fetch(API_URL + API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      })
    });
    const data = await resp.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: no response';
    chat.messages.push({ role: 'assistant', text: reply });
  } catch (e) {
    chat.messages.push({ role: 'assistant', text: 'Error: ' + e.message });
  }
  renderChat();
}

// Event listeners
sendBtn.onclick = () => {
  const q = presetQuestions[selectedQuestion];
  sendMessage(q);
};

newChatBtn.onclick = () => {
  if (chats.length < 10) {
    chats.push({ messages: [] });
    currentChat = chats.length - 1;
    renderChat();
    renderQuestions();
  }
};

exportBtn.onclick = () => {
  const text = chats[currentChat].messages.map(m => `${m.role}: ${m.text}`).join('\n');
  // On Switch, you'd write to a file; for demo, alert.
  alert(text);
};

// Navigation: L/R to switch chats (we'll handle with keyboard events later)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentChat > 0) { currentChat--; renderChat(); }
  if (e.key === 'ArrowRight' && currentChat < chats.length-1) { currentChat++; renderChat(); }
});

renderQuestions();
renderChat();
