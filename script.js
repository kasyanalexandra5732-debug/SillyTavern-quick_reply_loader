// script.js для расширения Quick Reply

(function() {
    'use strict';
    
    console.log('Quick Reply extension loading...');
    
    // Ваша функция генерации ответа
    async function generateQuickReply() {
        try {
            // Получаем имя пользователя
            const userName = window.chat?.name1 || 
                            localStorage.getItem('SillyTavern_Preset') || 
                            'User';
            
            // Шаблон ответа
            const template = `👕: [Описываю свою внешность и одежду]
💭: ${userName} чувствует...
[Эмоциональное состояние с милым описанием] | [О чем они тайно думают - 1 предложение]
🦄: [Вторичная эмоция, интенсивность в процентах] | [Физическое описание напряжения/состояния тела]`;
            
            // Отправляем сообщение
            const textarea = document.getElementById('send_textarea');
            const sendButton = document.getElementById('send_but');
            
            if (textarea && sendButton) {
                textarea.value = template;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    sendButton.click();
                    
                    // Очищаем поле
                    setTimeout(() => {
                        textarea.value = '';
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    }, 100);
                }, 50);
            }
        } catch (error) {
            console.error('Quick Reply error:', error);
        }
    }
    
    // === ВОТ ЭТОТ КОД ДОБАВЛЯЕМ ===
    // Функция регистрации кнопки в Magic
    function registerButtonInMagic() {
        if (window.MagicButtonRegistry) {
            window.MagicButtonRegistry.register({
                id: 'quick_reply',
                name: 'Quick Reply',
                icon: '⚡',
                onClick: generateQuickReply,
                tooltip: 'Быстрый ответ по шаблону',
                category: 'user'  // опционально: user, chat, system, etc
            });
            console.log('Quick Reply button registered in Magic');
        }
    }
    
    // Инициализация расширения
    function initExtension() {
        console.log('Initializing Quick Reply extension...');
        
        // Пытаемся зарегистрировать кнопку сразу
        registerButtonInMagic();
        
        // Если MagicButtonRegistry еще не загружен, ждем
        if (!window.MagicButtonRegistry) {
            console.log('Waiting for MagicButtonRegistry...');
            
            // Слушаем событие загрузки Magic
            document.addEventListener('magicRegistryReady', registerButtonInMagic);
            
            // Или проверяем периодически
            const checkInterval = setInterval(() => {
                if (window.MagicButtonRegistry) {
                    clearInterval(checkInterval);
                    registerButtonInMagic();
                }
            }, 500);
        }
        
        // Также можно добавить кнопку в UI как fallback
        addFallbackButton();
    }
    
    // Fallback кнопка (если Magic не работает)
    function addFallbackButton() {
        setTimeout(() => {
            const sendForm = document.getElementById('send_form');
            if (sendForm && !document.getElementById('quickReplyFallbackBtn')) {
                const button = document.createElement('button');
                button.id = 'quickReplyFallbackBtn';
                button.innerHTML = '⚡ Quick';
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
                button.onclick = generateQuickReply;
                button.title = 'Быстрый ответ';
                
                const container = sendForm.querySelector('.flex-container') || sendForm;
                container.appendChild(button);
                console.log('Fallback Quick Reply button added');
            }
        }, 2000);
    }
    
    // Запускаем инициализацию при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExtension);
    } else {
        initExtension();
    }
    
    // Экспортируем функции для глобального доступа
    window.QuickReply = {
        generate: generateQuickReply,
        register: registerButtonInMagic
    };
    
})();