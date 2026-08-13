document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("aiChatToggle");
  const panel = document.getElementById("aiChatPanel");
  const closeBtn = document.getElementById("aiChatClose");
  const messagesEl = document.getElementById("aiChatMessages");
  const form = document.getElementById("aiChatForm");
  const input = document.getElementById("aiChatInput");

  if (!toggle || !panel || !form || !input || !messagesEl) return;

  const STORAGE_KEY = "licenciados_chat_history";
  const WHATSAPP_LINK = "https://wa.me/523121162476";
  const GREETING =
    "¡Hola! Soy el asistente virtual de Licenciados | Legal & Business Group. Puedo ayudarte con información sobre nuestras áreas de práctica, certificaciones, horarios y formas de contacto. ¿En qué puedo ayudarte hoy?";

  let history = loadHistory();
  let sending = false;

  if (history.length === 0) {
    pushMessage("assistant", GREETING, { persist: true });
  } else {
    history.forEach((item) => renderBubble(item.role, item.content));
  }

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => input.focus(), 200);
    }
  });

  closeBtn?.addEventListener("click", () => {
    panel.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message || sending) return;

    input.value = "";
    pushMessage("user", message, { persist: true });

    sending = true;
    const typingEl = renderTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: history.slice(0, -1), // historial previo, sin el mensaje que acabamos de mandar (va aparte)
        }),
      });

      const data = await res.json().catch(() => null);
      typingEl.remove();

      if (!res.ok || !data || !data.reply) {
        renderBubble("assistant", fallbackReply(), { isFallback: true });
      } else {
        pushMessage("assistant", data.reply, { persist: true });
      }
    } catch {
      typingEl.remove();
      renderBubble("assistant", fallbackReply(), { isFallback: true });
    } finally {
      sending = false;
      scrollToBottom();
    }
  });

  function fallbackReply() {
    return `Ahora mismo no puedo responder. Escríbenos directo por WhatsApp: ${WHATSAPP_LINK}`;
  }

  function pushMessage(role, content, { persist } = {}) {
    renderBubble(role, content);
    if (persist) {
      history.push({ role, content });
      saveHistory();
    }
  }

  function renderBubble(role, content) {
    const bubble = document.createElement("div");
    bubble.className = `ai-chat-bubble ai-chat-bubble-${role}`;
    bubble.innerHTML = linkify(content);
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function renderTyping() {
    const bubble = document.createElement("div");
    bubble.className = "ai-chat-bubble ai-chat-bubble-assistant ai-chat-typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-30)));
    } catch {
      /* almacenamiento no disponible, la conversación sigue funcionando en memoria */
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function linkify(text) {
    const escaped = escapeHtml(text);
    return escaped.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
    );
  }
});
