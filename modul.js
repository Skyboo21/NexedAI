import { z } from "zod";
import { cva } from "class-variance-authority";

const AiResponseSchema = z.object({
  status: z.literal("success").or(z.literal("error")),
  message: z.string(),
  timestamp: z.string().optional()
});

const chatBubbleVariants = cva(
  "p-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed transition-all transform animate-fade-in-up",
  {
    variants: {
      role: {
        user: "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-tr-none shadow-purple-500/20",
        bot: "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
      }
    }
  }
);

const avatarVariants = cva(
  "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-md",
  {
    variants: {
      role: {
        user: "bg-purple-100 text-purple-700",
        bot: "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
      }
    }
  }
);

const materiContent = document.getElementById('materi-content');
const chatContainer = document.getElementById('chat-container');

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
`;
document.head.appendChild(style);

materiContent?.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 3) {
    window.getSelection().removeAllRanges();
    processAIResponse(selectedText);
  }
});

function appendUserMessage(text) {
  const msgHTML = `
    <div class="flex items-start justify-end space-x-3">
      <div class="${chatBubbleVariants({ role: 'user' })}">
        <span class="text-[11px] text-purple-200 block mb-1.5 font-semibold uppercase tracking-wider">Menyorot teks:</span>
        "${escapeHtml(text)}"
      </div>
      <div class="${avatarVariants({ role: 'user' })}">ME</div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', msgHTML);
  scrollToBottom();
}

function appendSkeletonLoader() {
  const loaderId = `loader-${Date.now()}`;
  const loaderHTML = `
    <div id="${loaderId}" class="flex items-start space-x-3">
      <div class="${avatarVariants({ role: 'bot' })}">NX</div>
      <div class="${chatBubbleVariants({ role: 'bot' })} flex items-center space-x-1.5 py-5 px-5">
        <div class="w-2 h-2 bg-purple-400 rounded-full skeleton-dot"></div>
        <div class="w-2 h-2 bg-purple-400 rounded-full skeleton-dot"></div>
        <div class="w-2 h-2 bg-purple-400 rounded-full skeleton-dot"></div>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', loaderHTML);
  scrollToBottom();
  return loaderId;
}

function appendBotMessage(text) {
  const msgHTML = `
    <div class="flex items-start space-x-3">
      <div class="${avatarVariants({ role: 'bot' })}">NX</div>
      <div class="${chatBubbleVariants({ role: 'bot' })}">${escapeHtml(text)}</div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', msgHTML);
  scrollToBottom();
}

async function processAIResponse(selectedText) {
  appendUserMessage(selectedText);
  const loaderId = appendSkeletonLoader();
  try {
    const replyData = await fetchAIExplanationApi(selectedText);
    const validData = AiResponseSchema.parse(replyData);
    document.getElementById(loaderId).remove();
    appendBotMessage(validData.message);
  } catch (error) {
    document.getElementById(loaderId).remove();
    appendBotMessage(`Maaf, terjadi kesalahan: ${error.message}`);
  }
}

async function fetchAIExplanationApi(text) {
  await new Promise(resolve => setTimeout(resolve, 1500)); 
  const lowerText = text.toLowerCase();
  let message = `Konsep "${text}" ini sangat krusial dalam algoritma. Ini sering dipakai untuk memanipulasi banyak data sekaligus secara otomatis. Tetap semangat belajarnya!`;
  if (lowerText.includes('infinite loop')) message = "Infinite Loop terjadi bila batas kondisi tidak pernah tercapai. Program akan terus berjalan sampai kehabisan memori.";
  else if (lowerText.includes('for loop')) message = "FOR Loop ibarat kamu berlari 5 putaran. Kamu sudah tahu persis jumlah akhirnya (5) sebelum mulai.";
  else if (lowerText.includes('while loop')) message = "WHILE Loop ibarat berlari sampai kamu capek. Kamu tidak tahu berapa putarannya, tapi tahu kapan berhenti.";
  
  return { status: "success", message: message, timestamp: new Date().toISOString() };
}

function escapeHtml(str) { return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])); }
function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }
