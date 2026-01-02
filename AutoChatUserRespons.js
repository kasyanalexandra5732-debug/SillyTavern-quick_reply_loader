// quick_reply_loader.js
// Загрузите этот файл в SillyTavern через пользовательские скрипты

(function() {
  'use strict';
  
  // Конфиг шаблонов
  const quickReplyConfig = {
    templates: {
      full: `👕: [Описываю свою внешность и одежду]
💭: {{user}} чувствует...
[Эмоциональное состояние с милым описанием] | [О чем они тайно думают - 1 предложение]
🦄: [Вторичная эмоция, интенсивность в процентах] | [Физическое описание напряжения/состояния тела] | [Навязчивая фантазия или воспоминание, связанное со вторичной эмоцией]
{{setvar::pov::third_person}}
THIRD-PERSON LIMITED POV: Воплощаю {{user}}, передаю их голос, мысли, ощущения.
Повествование от близкого третьего лица с использованием "он/она/они".
Остаюсь глубоко в голове {{user}} — вижу только то, что воспринимают они.
Внутренние мысли курсивом или вплетены в прозу.

{{setvar::infoblock::full}}

<infoblock> В конце КАЖДОГО сообщения пиши динамически меняющиеся заметки, заполняй (плейсхолдеры) на русском без скобок и делай пункты краткими, обобщенными. Строго используй форматирование шаблона:

{{setvar::html_statusboard::true}}
OUTPUT collapsible HTML status board at END of EVERY response.

MANDATORY FORMAT:
<details>
<summary>📊 STATUS BOARD</summary>
[Dynamic content: stats, mood, location, time, inventory, relationships, active effects]
</details>

STYLE: Dark theme, game-like aesthetic, immersive HUD feel.
UPDATE dynamically based on scene context.
Include all relevant tracking systems currently active.

---

📊 STATUS BOARD

♂️/♀️/⚧️{{user}} (роль)
   Статус: (текущий статус персонажа)
   Одежда: (текущий наряд и его состояние!)
🧭 Где мы: (Краткое, в одну строку описание пространственного положения всех)
   
--- ✧ 💌 МАТРИЦА ОТНОШЕНИЙ ✧ ---
{{user}} → [Имя персонажа]:
   💕 Привязанность: (0-200)
   ❤️ Любовь: (0-200)
   🕊️ Доверие: (0-200)
   🔥 Желание: (0-200)
   💋 Похоть: (0-200, только если присутствует!)
   📜 Статус: (выбери из списка)

[Отслеживай несколько отношений при необходимости. Шкала до 200 для более детального отслеживания]
</infoblock>
{{setvar::infoblock::compact}}`,
      
      simple: "{{user}}: *действие* «диалог»",
      thought: "{{user}}: 💭 [мысль]\n{{setvar::pov::third_person}}",
      action: "{{user}}: *[подробное действие с описанием]*"
    }
  };
  
  // Основная функция
  async function generateQuickReply(templateType = 'full') {
    try {
      // Получаем контекст
      const userName = await getUserName();
      
      // Выбираем шаблон
      const template = quickReplyConfig.templates[templateType] || quickReplyConfig.templates.full;
      
      // Заменяем плейсхолдеры
      const message = template.replace(/{{user}}/g, userName);
      
      // Отправляем сообщение
      sendMessageToChat(message);
      
    } catch (error) {
      console.error('Quick Reply Error:', error);
      fallbackQuickReply();
    }
  }
  
  // Вспомогательные функции
  async function getUserName() {
    try {
      // Пробуем разные способы получить имя пользователя
      if (window.chat?.name1) return window.chat.name1;
      
      const preset = localStorage.getItem('SillyTavern_Preset');
      if (preset) return preset;
      
      return 'User';
    } catch {
      return 'User';
    }
  }
  
  function sendMessageToChat(message) {
    const textarea = document.getElementById('send_textarea');
    const sendButton = document.getElementById('send_but');
    
    if (textarea && sendButton) {
      textarea.value = message;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Небольшая задержка перед отправкой
      setTimeout(() => {
        sendButton.click();
        
        // Очищаем поле после отправки
        setTimeout(() => {
          textarea.value = '';
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }, 100);
      }, 50);
    }
  }
  
  function fallbackQuickReply() {
    const textarea = document.getElementById('send_textarea');
    if (textarea) {
      textarea.value = "{{user}}: *улыбается* Продолжай.";
      
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: true,
        bubbles: true
      });
      
      textarea.dispatchEvent(enterEvent);
    }
  }
  
  // Создаем кнопку в интерфейсе
  function createQuickReplyButton() {
    if (document.getElementById('st-quick-reply-btn')) return;
    
    const button = document.createElement('button');
    button.id = 'st-quick-reply-btn';
    button.innerHTML = '<i class="fa-solid fa-bolt"></i> Quick Reply';
    button.className = 'menu_button';
    button.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      margin: 0 5px;
      font-weight: bold;
    `;
    button.title = 'Сгенерировать ответ по шаблону';
    button.onclick = () => generateQuickReply('full');
    
    // Добавляем кнопку в интерфейс
    const sendForm = document.getElementById('send_form');
    if (sendForm) {
      const buttonContainer = sendForm.querySelector('.flex-container') || sendForm;
      buttonContainer.appendChild(button);
    }
  }
  
  // Инициализация
  function initQuickReply() {
    // Ждем загрузки интерфейса
    const checkInterval = setInterval(() => {
      if (document.getElementById('send_form')) {
        clearInterval(checkInterval);
        createQuickReplyButton();
        
        // Добавляем в глобальную область видимости
        window.generateQuickReply = generateQuickReply;
        window.quickReplyTemplates = quickReplyConfig.templates;
        
        console.log('Quick Reply system loaded successfully');
      }
    }, 1000);
  }
  
  // Запускаем при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickReply);
  } else {
    initQuickReply();
  }
  
})();