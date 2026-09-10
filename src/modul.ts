// src/modul.ts
import { fetchAIExplanationApi } from "./services/apiService";
import { chatBubbleVariants, avatarVariants } from "./components/badge";

const materiContent = document.getElementById('materi-content');
const chatContainer = document.getElementById('chat-container');

if (materiContent && chatContainer) {
  // Tambahkan CSS via JS untuk transisi chat
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    @keyframes pulse-bg {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.95); }
    }
    .skeleton-dot { animation: pulse-bg 1.5s ease-in-out infinite; }
    .skeleton-dot:nth-child(2) { animation-delay: 0.2s; }
    .skeleton-dot:nth-child(3) { animation-delay: 0.4s; }
  `;
  document.head.appendChild(style);

  materiContent.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (!selection) return;
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 3) {
      selection.removeAllRanges();
      processAIResponse(selectedText);
    }
  });

  async function processAIResponse(selectedText: string) {
    appendUserMessage(selectedText);
    const loaderId = appendSkeletonLoader();
    
    try {
      const validData = await fetchAIExplanationApi(selectedText);
      const loader = document.getElementById(loaderId);
      if (loader) loader.remove();
      
      appendBotMessage(validData.message);
    } catch (error: any) {
      const loader = document.getElementById(loaderId);
      if (loader) loader.remove();
      appendBotMessage(`Maaf, terjadi kesalahan: ${error.message}`);
    }
  }

  function appendUserMessage(text: string) {
    const msgHTML = `
      <div class="flex items-start justify-end space-x-3">
        <div class="${chatBubbleVariants({ role: 'user' })}">
          <span class="text-[11px] text-purple-200 block mb-1.5 font-semibold uppercase tracking-wider">Menyorot teks:</span>
          "${escapeHtml(text)}"
        </div>
        <div class="${avatarVariants({ role: 'user' })}">ME</div>
      </div>
    `;
    chatContainer?.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
  }

  function appendSkeletonLoader(): string {
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
    chatContainer?.insertAdjacentHTML('beforeend', loaderHTML);
    scrollToBottom();
    return loaderId;
  }

  function appendBotMessage(text: string) {
    const msgHTML = `
      <div class="flex items-start space-x-3">
        <div class="${avatarVariants({ role: 'bot' })}">NX</div>
        <div class="${chatBubbleVariants({ role: 'bot' })}">
          ${escapeHtml(text)}
        </div>
      </div>
    `;
    chatContainer?.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
  }

  function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}
