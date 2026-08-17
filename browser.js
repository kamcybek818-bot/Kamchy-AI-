// 🔥 ГЛОБАЛЬНЫЙ БРОНЕБОЙНЫЙ ФИКС ДЛЯ КАМЧЫБЕКА:
var kamchy_premium_active = false;
var selectedTariffPrice = "0.00";

// Привязываем переменную к главному окну браузера, чтобы её видел весь файл без ошибок
window.attachedImageBase64 = null; 


// browser.js — ПРЕМИАЛЬНЫЙ APPLE-СТИЛЬ МОНОЛИТ ЛОГИКИ (ЧАСТЬ 1 ИЗ 8)
document.addEventListener('DOMContentLoaded', () =>  {  // --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА (СТРОГО ПО ТВОЕМУ HTML И CSS) ---
  const authOverlay = document.getElementById('authOverlay');
  const authBtn = document.getElementById('authBtn');
  const authNameInput = document.getElementById('authName');
  const authEmailInput = document.getElementById('authEmail');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const voiceWave = document.getElementById('voiceWave');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const chatMessages = document.getElementById('chatMessages');
  const imageMessages = document.getElementById('imageMessages');
  const historyList = document.getElementById('historyList');
  const newChatBtn = document.getElementById('newChatBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const menuItems = document.querySelectorAll('.menu-item:not(#newChatBtn)');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Элементы управления панели настроек аккаунта
  const btnLogout = document.getElementById('btnLogout');
  const settingTheme = document.getElementById('settingTheme');
  const settingVoice = document.getElementById('settingVoice');
  const settingFontSize = document.getElementById('settingFontSize');
  const settingAiColor = document.getElementById('settingAiColor');
  
  // НАШ ТОТ САМЫЙ КРИТИЧЕСКИЙ ЭЛЕМЕНТ ДЛЯ СКРЫТИЯ/ПОКАЗА ПЛЮСИКА
  const chatInputContainer = document.querySelector('.chat-input-container');

  // Глобальные настройки по умолчанию (Строгий монохром)
  let userName = "Братуха";
  let isRecording = false;
  let recognition = null;
  let isFirstMessageInSession = true;
  let currentVoiceSetting = "male";
  let currentFontSizeSetting = "medium";
  let currentAiColorSetting = "white";







  window.attachedImageBase64 = null;






    
  
  // Считываем токены авторизации из памяти браузера заранее
  const savedToken = localStorage.getItem('kamchy_session_token');
  const savedName = localStorage.getItem('kamchy_user_name');

  if (!localStorage.getItem('user_message_count')) {
      localStorage.setItem('user_message_count', '0');
  }

  // Функция индивидуальных лимитов по почте
  function getAccountMessageKey() {
      const currentEmail = localStorage.getItem('kamchy_user_email') || 'guest_default';
      return 'kamchy_msg_count_' + currentEmail;
  }














  // =========================================================================
  // ИСПРАВЛЕННЫЙ БЛОК: ИНДИВИДУАЛЬНЫЕ ЛИМИТЫ ДЛЯ КАЖДОГО НОВОГО АККАУНТА
  // =========================================================================
  let kamchy_premium_active = false; 
  let selectedTariffPrice = "0.00";  

  // Функция, которая динамически находит счётчик именно для ТЕКУЩЕГО вошедшего аккаунта
  function getAccountMessageKey() {
      // Считываем почту, которую пользователь ввёл при регистрации
      const currentEmail = localStorage.getItem('kamchy_user_email') || 'guest_default';
      // Создаем уникальный ключ для памяти (например: "msg_count_user1@mail.ru")
      return 'kamchy_msg_count_' + currentEmail;
  }

  if (!localStorage.getItem('user_message_count')) {
      localStorage.setItem('user_message_count', '0');
  }




  // // Перехват звукового движка для басового робота на системные VIP-уведомления
  // const originalSpeakText = speakText;
  // speakText = function(text) {
  //     if (text.includes('СИСТЕМА KAMCHYAI') || text.includes('Система KamchyAI')) {
  //         if ('speechSynthesis' in window) {
  //             window.speechSynthesis.cancel();
  //             const utterance = new SpeechSynthesisUtterance(text);
  //             utterance.lang = 'ru-RU';
  //             utterance.rate = 0.82; 
  //             utterance.pitch = 0.4; // Низкий, авторитетный бас робота
  //             utterance.volume = 1.0;
  //             const voices = window.speechSynthesis.getVoices();
  //             const deepVoice = voices.find(voice => voice.lang.startsWith('ru') && (voice.name.toLowerCase().includes('pavel') || voice.name.toLowerCase().includes('maxim') || voice.name.toLowerCase().includes('google')));
  //             if (deepVoice) utterance.voice = deepVoice;
  //             window.speechSynthesis.speak(utterance);
  //             return;
  //         }
  //     }
  //     if (typeof originalSpeakText === 'function') originalSpeakText(text);
  // };






// Перехват звукового движка для басового робота на системные VIP-уведомления
const originalSpeakText = speakText;
speakText = function(text) {
    if (text.includes('СИСТЕМА KAMCHYAI') || text.includes('Система KamchyAI')) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Твои оригинальные крутые настройки баса
            utterance.lang = 'ru-RU';
            utterance.rate = 0.82; 
            utterance.pitch = 0.4; 
            utterance.volume = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            
            // Умный поиск голоса: ищет русский, но если телефон тупит, берёт правильный системный
            const deepVoice = voices.find(voice => {
                const nameLower = voice.name.toLowerCase();
                const langLower = voice.lang.toLowerCase();
                return langLower.includes('ru') && 
                       (nameLower.includes('pavel') || nameLower.includes('maxim') || nameLower.includes('google') || nameLower.includes('microsoft'));
            });
            
            if (deepVoice) {
                utterance.voice = deepVoice;
            } else {
                // Хак для Android: если Павла нет, принудительно ставим первый попавшийся русский голос носителя
                const backupRussian = voices.find(voice => voice.lang.toLowerCase().includes('ru'));
                if (backupRussian) utterance.voice = backupRussian;
            }
            
            window.speechSynthesis.speak(utterance);
            return;
        }
    }
    // ВОТ ОН, САМЫЙ ГЛАВНЫЙ МОМЕНТ! 
    // Все остальные сообщения на ВСЕХ языках мира улетают в твою родную функцию без изменений!
    if (typeof originalSpeakText === 'function') originalSpeakText(text);
};

// Жесткий пинок для Android, чтобы все голоса мира (включая английский) были в памяти сразу
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
}











  // Твои родные премиальные монохромные иконки микрофона
  const micIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
  const stopIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>`;










// =========================================================================
// БЕСКОНЕЧНЫЙ ГОЛОСОВОЙ ВВОД С СЕКУНДОМЕРОМ ДЛЯ ТВОИХ ID КНОПОК
// =========================================================================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let kamchyRecognition = null;
let isKamchyRecording = false;
let kamchySeconds = 0;
let kamchyTimerInterval = null;

if (SpeechRecognition) {
    kamchyRecognition = new SpeechRecognition();
    
    // БЕСКОНЕЧНЫЙ РЕЖИМ (не сбрасывает при паузах)
    kamchyRecognition.continuous = true;          
    kamchyRecognition.interimResults = false;      
    kamchyRecognition.lang = 'ru-RU';              

    kamchyRecognition.onresult = function(event) {
        const lastResultIndex = event.results.length - 1;
        const recognizedText = event.results[lastResultIndex].transcript.trim();
        
        if (recognizedText) {
            console.log("KamchyAI услышал:", recognizedText);
            
            // Находим ТВОЕ поле ввода по ID "userInput"
            const chatInput = document.getElementById('userInput');
            if (chatInput) {
                // Если там уже что-то было написано, добавляем пробел и новый текст
                if (chatInput.value.trim() !== "") {
                    chatInput.value += " " + recognizedText;
                } else {
                    chatInput.value = recognizedText;
                }
                
                // Эмуляция клика на ТВОЮ кнопку отправки по ID "sendBtn"
                const sendBtn = document.getElementById('sendBtn');
                if (sendBtn) {
                    sendBtn.click(); 
                }
            }
        }
    };

    kamchyRecognition.onerror = function(event) {
        console.error("Ошибка микрофона KamchyAI:", event.error);
        if (event.error === 'no-speech') {
            stopKamchyVoice();
        }
    };

    kamchyRecognition.onend = function() {
        isKamchyRecording = false;
        clearInterval(kamchyTimerInterval); // Выключаем секундомер
        
        // Возвращаем ТВОЕЙ кнопке voiceBtn родную иконку микрофона
        const recordBtn = document.getElementById('voiceBtn');
        if (recordBtn) recordBtn.innerHTML = micIcon; 
        
        // Прячем секундомер
        const timerDisplay = document.getElementById('kamchy-timer');
        if (timerDisplay) timerDisplay.style.display = 'none';
        
        console.log("Запись KamchyAI полностью завершена.");
    };
}

// Переключатель записи (Включить / Выключить)
function toggleKamchyVoice() {
    if (!kamchyRecognition) {
        alert("Браузер не поддерживает голосовой ввод.");
        return;
    }
    
    if (isKamchyRecording) {
        stopKamchyVoice();
    } else {
        startKamchyVoice();
    }
}

function startKamchyVoice() {
    try {
        isKamchyRecording = true;
        kamchyRecognition.start();
        
        // Меняем иконку на Стоп (Квадрат) у кнопки voiceBtn
        const recordBtn = document.getElementById('voiceBtn');
        if (recordBtn) recordBtn.innerHTML = stopIcon;

        // Запуск таймера
        kamchySeconds = 0;
        const timerDisplay = document.getElementById('kamchy-timer');
        if (timerDisplay) {
            timerDisplay.innerText = "00:00";
            timerDisplay.style.display = 'inline-block'; // Показываем на экране
        }

        kamchyTimerInterval = setInterval(() => {
            kamchySeconds++;
            let mins = Math.floor(kamchySeconds / 60);
            let secs = Math.floor(kamchySeconds % 60);
            let formattedTime = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
            
            if (timerDisplay) timerDisplay.innerText = formattedTime;
        }, 1000);

    } catch (error) {
        console.error("Ошибка активации микрофона:", error);
        isKamchyRecording = false;
    }
}

function stopKamchyVoice() {
    if (kamchyRecognition && isKamchyRecording) {
        kamchyRecognition.stop();
    }
}

// Автоматически связываем логику с твоей кнопкой в HTML при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById('voiceBtn');
    if (recordBtn) {
        // Убираем старые обработчики, если они были прописаны в HTML, и ставим наш
        recordBtn.removeAttribute('onclick');
        recordBtn.addEventListener('click', toggleKamchyVoice);
    }
});












  // Функция переключения крестика очистки "✕"
  function toggleClearButton() {
    if (userInput && clearInputBtn) {
      if (userInput.value.trim().length > 0) {
        clearInputBtn.style.setProperty('display', 'flex', 'important');
      } else {
        clearInputBtn.style.setProperty('display', 'none', 'important');
      }
    }
  }
  // --- БРОНЕБОЙНЫЙ ГОЛОСОВОЙ ДВИЖОК: СИНХРОНИЗАЦИЯ СКОРОСТИ РУС/АНГ ---
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanMessage = text.replace(/IMAGE_DATA:.*/g, '').trim();
      if (!cleanMessage) return;
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      
      const isEnglish = /[a-z]/i.test(cleanMessage) && !/[а-яё]/i.test(cleanMessage);
      const langCode = isEnglish ? 'en-US' : 'ru-RU';
      utterance.lang = langCode;

      if (isEnglish) {
        utterance.rate = 1.0; // Английский плавно
      } else {
        utterance.rate = 1.6; // Русский бодро
      }

      utterance.pitch = currentVoiceSetting === "male" ? 0.6 : 1.1; // Пацанский низкий бас
      
      const voices = window.speechSynthesis.getVoices();
      let targetVoice;
      
      if (currentVoiceSetting === "female") {
        targetVoice = voices.find(voice => voice.lang.startsWith(langCode.substring(0, 2)) && (voice.name.toLowerCase().includes('irina') || voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('elena')));
      } else {
        targetVoice = voices.find(voice => voice.lang.startsWith(langCode.substring(0, 2)) && (voice.name.toLowerCase().includes('pavel') || voice.name.toLowerCase().includes('david') || voice.name.toLowerCase().includes('aleksandr') || voice.name.toLowerCase().includes('maxim') || voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('google') && !voice.name.toLowerCase().includes('female')));
      }
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      } else {
        const fallbackVoice = voices.find(voice => voice.lang.startsWith(langCode.substring(0, 2)));
        if (fallbackVoice) utterance.voice = fallbackVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  // Принудительно прогреваем голоса при старте и асинхронном изменении
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
  }
  // --- АВТОМАТИЧЕСКИЙ ДВИЖОК МИКРОФОНА С ОТПРАВКОЙ ПОСЛЕ ПАУЗЫ ---
  function initVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ru-RU';
    
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      if (currentTranscript && currentTranscript.trim() !== "undefined") {
        if (userInput) {
          userInput.value = currentTranscript.trim();
          toggleClearButton();
          handleSendMessage(); // Автоматическая отправка по голосу
        }
      }
    };

    recognition.onend = () => {
      isRecording = false;
      if (voiceBtn) {
        voiceBtn.innerHTML = micIcon;
        voiceBtn.style.setProperty('background', 'rgba(128, 128, 128, 0.1)', 'important');
        voiceBtn.style.setProperty('border-color', 'rgba(128, 128, 128, 0.15)', 'important');
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        voiceBtn.style.setProperty('color', currentTheme === 'light' ? '#000000' : '#ffffff', 'important');
      }
      if (voiceWave) voiceWave.style.setProperty('display', 'none', 'important');
    };

    recognition.onerror = (event) => { console.error('[Микрофон ошибка]:', event.error); };
    return recognition;
  }

  recognition = initVoiceInput();

  if (voiceBtn) {
    voiceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!recognition) { alert('Голосовой ввод не поддерживается! Откройте через Google Chrome.'); return; }
      if (!isRecording) {
        isRecording = true;
        voiceBtn.innerHTML = stopIcon;
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const activeColor = currentTheme === 'light' ? '#000000' : '#ffffff';
        const activeTextColor = currentTheme === 'light' ? '#ffffff' : '#000000';
        voiceBtn.style.setProperty('background', activeColor, 'important');
        voiceBtn.style.setProperty('border-color', activeColor, 'important');
        voiceBtn.style.setProperty('color', activeTextColor, 'important');
        if (voiceWave) voiceWave.style.setProperty('display', 'flex', 'important');
        if (userInput) userInput.value = '';
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        try { recognition.start(); } catch(err) { console.error(err); }
      } else {
        try { recognition.stop(); } catch(err) { console.error(err); }
      }
    });
  }


  // =========================================================================
  // ТОЧКА №1: РУЧНОЙ ВХОД (Клик по кнопке «Войти!»)
  // =========================================================================
  if (authBtn) {
    authBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = authNameInput.value.trim();
      const email = authEmailInput.value.trim();

      if (!name) { alert("Пожалуйста, введите ваше имя!"); return; }
      const atIndex = email.indexOf('@');
      if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
        alert("Пожалуйста, введите корректный E-mail!"); return;
      }

  //     try {
  //       const response = await fetch('/api/register', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ name, email })
  //       });
  //       const data = await response.json();
  //       if (!response.ok)
  //         throw new Error(data.error || 'Ошибка входа');

  //       localStorage.setItem('kamchy_session_token', data.token);
  //       localStorage.setItem('kamchy_user_name', data.name);
  //       localStorage.setItem('kamchy_user_email', email); 
  //       userName = data.name;

  //       // Скрываем карточку регистрации, открываем чат
  //       if (authOverlay) authOverlay.style.setProperty('display', 'none', 'important');
  //       if (chatInputContainer) chatInputContainer.classList.remove('hidden');
        
  //       // Включаем всю графику одновременно строго после клика!
  //       const headerBar = document.getElementById('kamchyHeaderBar');
  //       if (headerBar) headerBar.classList.remove('hidden'); 
        
  //       const footerContainer = document.getElementById('kamchyFooterContainer');
  //       if (footerContainer) footerContainer.classList.remove('hidden'); 

  //       const premiumBtnAuth = document.getElementById('kamchyPremiumBtn');
  //       if (premiumBtnAuth) premiumBtnAuth.classList.remove('hidden'); 
        
  //       appendMessage('ai', `Привет, ${userName}! Рад тебя видеть, вход выполнен успешно.`);
  //     } catch (err) {
  //       alert("Ошибка входа: " + err.message);
  //     }
  //   });
  // }









  try {
    const response = await fetch('/api/register', {

// СТАЛО (подставь реальный адрес своего бэкенда):
// const response = await fetch('https://xn-----blccdkgcb6an1bh1bclg7r.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || 'Ошибка входа');

    localStorage.setItem('kamchy_session_token', data.token);
    localStorage.setItem('kamchy_user_name', data.name);
    localStorage.setItem('kamchy_user_email', email); 
    userName = data.name;

    // Скрываем карточку регистрации, открываем чат
    if (authOverlay) authOverlay.style.setProperty('display', 'none', 'important');
    if (chatInputContainer) chatInputContainer.classList.remove('hidden');
    
    // Включаем всю графику одновременно строго после клика!
    const headerBar = document.getElementById('kamchyHeaderBar');
    if (headerBar) headerBar.classList.remove('hidden'); 
    
    const footerContainer = document.getElementById('kamchyFooterContainer');
    if (footerContainer) footerContainer.classList.remove('hidden'); 

    const premiumBtnAuth = document.getElementById('kamchyPremiumBtn');
    if (premiumBtnAuth) premiumBtnAuth.classList.remove('hidden'); 
    
    appendMessage('ai', `Привет, ${userName}! Рад тебя видеть, вход выполнен успешно.`);

    // 🔥 ТОПЧИК-МОМЕНТ: Вызываем карточку установки KamchyAI прямо в центр экрана!
    showKamchyPrompt();

  } catch (err) {
    alert("Ошибка входа: " + err.message);
  }
});
}











  // =========================================================================
  // ТОЧКА №2: АВТО-ВХОД (Если гость обновил страницу)
  // =========================================================================
  if (savedToken && savedName) {
    userName = savedName;
    
    if (authOverlay) authOverlay.style.setProperty('display', 'none', 'important');
    if (chatInputContainer) chatInputContainer.classList.remove('hidden');
    
    // Раскрываем графику при авто-входе без лишней каши
    const headerBarCheck = document.getElementById('kamchyHeaderBar');
    if (headerBarCheck) headerBarCheck.classList.remove('hidden'); 
    
    const footerContainerCheck = document.getElementById('kamchyFooterContainer');
    if (footerContainerCheck) footerContainerCheck.classList.remove('hidden'); 
    
    const premiumBtnCheck = document.getElementById('kamchyPremiumBtn');
    if (premiumBtnCheck) premiumBtnCheck.classList.remove('hidden'); 
  }









    // --- УЛЬТРА-ПЛАВНОЕ СКОЛЬЖЕНИЕ МЕНЮ (APPLE APPLE-СТИЛЬ БЕЗ ЛАГОВ) ---
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      // Магия toggle: если меню закрыто — откроет, если открыто — плавно закроет обратно!
      sidebar.classList.toggle('active');
      
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('active');
      }
      
      console.log("🍏 [KamchyAI UI]: Переключение видимости левой панели выполнено.");
    });
  }

  // Закрытие меню, если гость выставки просто тапнул по размытому фону чата
  if (sidebarOverlay && sidebar) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Навешиваем авто-закрытие сайдбара при клике на любой пункт меню («Поиск», «Настройки»)
  // чтобы панель красиво улетала обратно влево, когда гость переключает вкладки!
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(btn => btn.classList.remove('active'));
      item.classList.add('active');
      tabContents.forEach(tab => tab.classList.remove('active'));
      
      const targetTabId = item.getAttribute('data-tab');
      const targetTab = document.getElementById(targetTabId);
      if (targetTab) targetTab.classList.add('active');
      
      // 🔥 НАШ ТОЧЕЧНЫЙ Мобильный Фикс: плавно прячем сайдбар влево после клика по пункту
      if (sidebar) sidebar.classList.remove('active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    });
  });

  if (sidebarOverlay && sidebar) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.style.setProperty('transition', 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 'important');
      sidebar.classList.remove('active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    });
  }

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(btn => btn.classList.remove('active'));
      item.classList.add('active');
      tabContents.forEach(tab => tab.classList.remove('active'));
      
      const targetTabId = item.getAttribute('data-tab');
      const targetTab = document.getElementById(targetTabId);
      if (targetTab) targetTab.classList.add('active');
      
      if (sidebar) {
        sidebar.style.setProperty('transition', 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 'important');
        sidebar.classList.remove('active');
      }
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    });
  });
  // browser.js — ПРЕМИАЛЬНЫЙ APPLE-СТИЛЬ МОНОЛИТ ЛОГИКИ (ЧАСТЬ 5 ИЗ 8)
  // --- УМНЫЙ ПОДЪЕМ ИНПУТА НАД КЛАВИАТУРОЙ СМАРТФОНА ---
  if (userInput) {
    userInput.addEventListener('focus', () => {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        userInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
        const activeMessages = document.querySelector('.tab-content.active .chat-messages');
        if (activeMessages) {
          activeMessages.scrollTop = activeMessages.scrollHeight;
        }
      }, 120);
    });
    userInput.addEventListener('blur', () => { window.scrollTo(0, 0); });
  }

  // --- КНОПКА «НОВЫЙ ЧАТ» ДЛЯ СБРОСА КОНТЕКСТА ---
  if (newChatBtn) {
    newChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (chatMessages) {
        chatMessages.innerHTML = `<div class="message ai">Привет! Контекст сброшен. Я готов к новому диалогу. Чем могу помочь, ${userName}?</div>`;
      }
      if (imageMessages) {
        imageMessages.innerHTML = `<div class="message ai">Здесь ты сможешь создавать арты. Опиши внизу, что именно нарисовать!</div>`;
      }
      if (userInput) userInput.value = '';
      toggleClearButton();
      const searchTabItem = document.querySelector('[data-tab="searchTab"]');
      if (searchTabItem) searchTabItem.click();
      if (userInput) userInput.focus();
    });
  }

  // --- ФУНКЦИЯ ДОБАВЛЕНИЯ ПУНКТА В ИСТОРИЮ ПОИСКОВ ---
  function addTopicToHistory(topicText) {
    if (!historyList) return;
    if (isFirstMessageInSession) {
      historyList.innerHTML = '';
      isFirstMessageInSession = false;
    }
    const shortTitle = topicText.length > 35 ? topicText.substring(0, 35) + '...' : topicText;
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.textContent = shortTitle;
    historyItem.addEventListener('click', () => {
      if (userInput) {
        userInput.value = topicText;
        toggleClearButton();
        const searchTabItem = document.querySelector('[data-tab="searchTab"]');
        if (searchTabItem) searchTabItem.click();
        userInput.focus();
      }
    });
    historyList.insertBefore(historyItem, historyList.firstChild);
  }
    // --- ОТПРАВКА СООБЩЕНИЙ С СТРОГОЙ МОНОХРОМНОЙ ЛАЗЕРНОЙ АНИМАЦИЕЙ И VIP-ЛИМИТОМ ---
  async function handleSendMessage() {


        // --- СЕКРЕТНЫЙ АДМИН-КОД ДЛЯ КАМЧЫБЕКА ДЛЯ ВКЛЮЧЕНИЯ PREMIUM ---
    const adminInputText = userInput.value.trim();
    if (adminInputText === 'kamchy_vip_admin') {
        userInput.value = ''; // Очищаем инпут
        
        // Включаем безлимитный режим
        kamchy_premium_active = true;
        const accountKeyAdmin = getAccountMessageKey();
        localStorage.setItem(accountKeyAdmin, '0'); // Сбрасываем счетчик текущего аккаунта в 0
        
        // Перекрашиваем верхнюю кнопку Premium в черный безлимитный цвет
        const pBtnElement = document.getElementById('kamchyPremiumBtn');
        if (pBtnElement) {
            pBtnElement.innerText = "PREMIUM ACTIVE — UNLIMITED";
            pBtnElement.classList.add('premium-active-black');
            pBtnElement.classList.add('pulsing');
        }
        
        // Робот басом объявляет об успешном взломе/активации системы на всю выставку
        speakText("Система KamchyAI: Приветствую, Создатель! Административный доступ получен. Безлимитный премиум режим успешно активирован на весь день.");
        
        alert("✅ АДМИН-ДОСТУП: Безлимит успешно активирован!");
        return; // Прерываем функцию, сообщение в чат не отправляется
    }



    if (!userInput) return;
    let text = userInput.value.trim();
    
        // Полноценная защита от сбоев инициализации: считываем глобальное или локальное вложение
    const currentAttachedImage = window.attachedImageBase64 || (typeof attachedImageBase64 !== 'undefined' ? attachedImageBase64 : null);
    
    if (!text && !currentAttachedImage) return;

    // Считываем счётчик текущего аккаунта
    const accountKey = getAccountMessageKey();
    let currentCount = parseInt(localStorage.getItem(accountKey), 10) || 0;

    // ПРОВЕРКА ЛИМИТА: Блокируем отправку 21-е сообщения для ЭТОГО конкретного аккаунта
    if (!kamchy_premium_active && currentCount >= 99) {
        const activeTab = document.querySelector('.tab-content.active');
        const activeTabId = activeTab ? activeTab.id : 'searchTab';
        const targetContainer = activeTabId === 'imageTab' ? imageMessages : chatMessages;

        if (targetContainer) {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'message ai';
            systemMessage.style.setProperty('border', '3px solid #ffffff', 'important');
            systemMessage.style.setProperty('background', '#000000', 'important');
            systemMessage.style.setProperty('color', '#ffffff', 'important');
            systemMessage.style.setProperty('font-weight', 'bold', 'important');
            systemMessage.style.setProperty('padding', '25px', 'important');
            systemMessage.style.setProperty('margin-top', '20px', 'important');
            systemMessage.style.setProperty('font-family', 'monospace', 'important');
            
            systemMessage.innerHTML = `СИСТЕМА KAMCHYAI: Этот аккаунт исчерпал лимит из 20 бесплатных сообщений! Чтобы продолжить общение с ИИ без ограничений круглые сутки, нажмите белую кнопку "PREMIUM" в правом верхнем углу экрана!`;
            targetContainer.appendChild(systemMessage);
            if (typeof scrollToBottom === 'function') scrollToBottom(targetContainer);
        }
        speakText("СИСТЕМА KAMCHYAI: Этот аккаунт исчерпал лимит из 20 бесплатных сообщений! Чтобы продолжить общение с ИИ без ограничений круглые сутки, нажмите белую кнопку PREMIUM в правом верхнем углу экрана!");
        return;
    }

    // Если лимит не превышен — увеличиваем счётчик шагов ИМЕННО ЭТОГО аккаунта
    if (!kamchy_premium_active) {
        currentCount++;
        localStorage.setItem(accountKey, currentCount.toString());
    }

    // ЗАПУСК МОНОХРОМНОГО ЛАЗЕРА ВОКРУГ КАПСУЛЫ
    const inputWrapperContainer = document.getElementById('inputWrapper') || document.querySelector('.input-wrapper');
    if (inputWrapperContainer) {
      inputWrapperContainer.classList.remove('laser-pulse');
      void inputWrapperContainer.offsetWidth;
      inputWrapperContainer.classList.add('laser-pulse');
      setTimeout(() => { inputWrapperContainer.classList.remove('laser-pulse'); }, 600);
    }

    const activeTab = document.querySelector('.tab-content.active');
    const activeTabId = activeTab ? activeTab.id : 'searchTab';
    const targetContainer = activeTabId === 'imageTab' ? imageMessages : chatMessages;

    if (!text && currentAttachedImage) {
      text = "Нарисуй что-то крутое по этому фото";
    }

    const safeHistoryText = text ? text.trim() : "📸 Отправлено фото референс";
    addTopicToHistory(safeHistoryText);
    
    appendMessage('user', text, targetContainer, currentAttachedImage);

    let finalImageUrl = null;
    let imageToSend = currentAttachedImage;

    // 🔥 БРОНЕБОЙНЫЙ ХОСТИНГ КАРТИНОК ИЗБЕЖАНИЕ INVALID URL НА СМАРТФОНАХ 🔥
    if (imageToSend) {
      try {
        console.log("⏳ [Фронтенд]: Загружаем тяжелое фото на быстрый бесплатный хостинг ImgBB...");
        const cleanBase64 = imageToSend.replace(/^data:image\/\w+;base64,/, "");
        
        const formData = new FormData();
        formData.append("image", cleanBase64);
        
        // Быстрый анонимный аплоад по публичному ключу
        const imgbbRes = await fetch("https://imgbb.com", {
          method: "POST",
          body: formData
        });
        
        const imgbbData = await imgbbRes.json();
        if (imgbbData && imgbbData.success) {
          finalImageUrl = imgbbData.data.url; // Получаем красивую короткую интернет-ссылку!
          console.log("✅ [Фронтенд]: Фото успешно загружено! Короткий URL: " + finalImageUrl);
        }
      } catch (uploadErr) {
        console.error("❌ Ошибка загрузки картинки на хостинг ImgBB:", uploadErr.message);
      }
    }

    // Буферизируем фото и МГНОВЕННО очищаем инпут-зону, сжимая её обратно
    userInput.value = '';
    toggleClearButton();
    attachedImageBase64 = null;
    
    if (hiddenFileInput) hiddenFileInput.value = '';
    const kamchyPreviewZone = document.getElementById('kamchyPreviewZone');
    const kamchyPreviewImg = document.getElementById('kamchyPreviewImg');
    if (kamchyPreviewZone) kamchyPreviewZone.style.display = 'none';
    if (kamchyPreviewImg) kamchyPreviewImg.src = '';
    if (inputWrapperContainer) inputWrapperContainer.style.minHeight = '48px'; // Возвращаем базовую высоту

    if (window.innerWidth <= 768) userInput.blur();

    const loaderElem = createLoaderElement();
    if (targetContainer) { targetContainer.appendChild(loaderElem); scrollToBottom(targetContainer); }

    try {
      // Жестко склеиваем абсолютный адрес твоего ноутбука для защиты на смартфонах
      const absoluteUrl = window.location.origin + '/api';
      console.log("🚀 [Фронтенд]: Отправляем пакет по абсолютному адресу: " + absoluteUrl);

      const response = await fetch(absoluteUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text,
          image: finalImageUrl // 🔥 ВМЕСТО КИЛОМЕТРОВОЙ КАРТИНКИ ШЛЕМ КРАСИВУЮ КОРOТКУЮ ССЫЛКУ!
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Сервер выдал ошибку вместо ответа. Проверь терминал с node index.js!");
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка бэкенда');
      
      if (loaderElem) loaderElem.remove();
      appendMessage('ai', data.reply, targetContainer);
      speakText(data.reply); // Твой басовый пацанский голос зачитает ответ!
    } catch (error) {
      console.error('Ошибка KamchyAI:', error);
      if (loaderElem) loaderElem.remove();
      appendMessage('ai', 'Братуха, потеряна связь с сервером index.js. Проверь чёрное окно терминала!', targetContainer);
    }
  }

  // 🔥 ФИКС КАМЧЫБЕКА ПРОТИВ ДВОЙНОЙ ОТПРАВКИ СООБЩЕНИЙ 🔥
  // Перед тем как повесить клик, сбрасываем removeEventListener, чтобы команда срабатывала СТРОГО 1 РАЗ!
  if (sendBtn) {
    const handleSendClick = (e) => { e.preventDefault(); handleSendMessage(); };
    sendBtn.removeEventListener('click', handleSendClick);
    sendBtn.addEventListener('click', handleSendClick);
  }

  if (userInput) {
    const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } };
    userInput.removeEventListener('keydown', handleKeyDown);
    userInput.addEventListener('keydown', handleKeyDown);
  }
  // browser.js — ПРЕМИАЛЬНЫЙ APPLE-СТИЛЬ МОНОЛИТ ЛОГИКИ (ЧАСТЬ 7 ИЗ 8)
  // --- УЛЬТРА-УМНАЯ ФУНКЦИЯ ВЫВОДА СООБЩЕНИЙ В ЧАТ (ТЕКСТ + КАРТИНКИ) ---
  function appendMessage(sender, text, container = chatMessages, userImageSrc = null) {
    if (!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    if (sender === 'ai') msgDiv.classList.add(`color-${currentAiColorSetting}`);

    // ЕСЛИ ПОЛЬЗОВАТЕЛЬ С КАРТИНКОЙ: Отображаем её внутри сообщения юзера
    if (sender === 'user' && userImageSrc) {
      const userImgElement = document.createElement('img');
      userImgElement.src = userImageSrc;
      userImgElement.alt = "Загруженное фото пользователя";
      userImgElement.style.width = '100%';
      userImgElement.style.maxWidth = '250px';
      userImgElement.style.borderRadius = '12px';
      userImgElement.style.marginBottom = '8px';
      userImgElement.style.display = 'block';
      userImgElement.style.cursor = 'pointer';
      msgDiv.appendChild(userImgElement);
    }

    // ХИТРОСТЬ ДЛЯ КАРТИНОК ИИ (GENERATION В ТВОЕМ ИНТЕРФЕЙСЕ)
    if (text && text.startsWith('IMAGE_DATA:')) {
      const cleanBase64 = text.replace('IMAGE_DATA:', '');
      const imgElement = document.createElement('img');
      imgElement.src = cleanBase64;
      imgElement.alt = "Сгенерированный арт KamchyAI";
      imgElement.style.width = '100%';
      imgElement.style.maxWidth = '350px';
      imgElement.style.borderRadius = '16px';
      imgElement.style.marginTop = '8px';
      imgElement.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      imgElement.style.display = 'block';
      imgElement.style.cursor = 'pointer';
      msgDiv.appendChild(imgElement);
    } else if (text) {
      // ЕСЛИ ЭТО ОБЫЧНЫЙ ТЕКСТ (ЧАТ) — выводим как раньше
      const textDiv = document.createElement('div');
      textDiv.textContent = text;
      textDiv.classList.add(`font-${currentFontSizeSetting}`);
      textDiv.style.whiteSpace = 'pre-wrap';
      textDiv.style.wordBreak = 'break-word';
      msgDiv.appendChild(textDiv);
    }
    container.appendChild(msgDiv);
    scrollToBottom(container);
  }
//=================================================================================================
  function scrollToBottom(container) {
    if (!container) return;
    setTimeout(() => { container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }); }, 50);
  }

  // --- УПРАВЛЕНИЕ НАСТРОЙКАМИ ИЗ ИНТЕРФЕЙСА ---
  if (settingTheme) settingTheme.addEventListener('change', (e) => { document.body.setAttribute('data-theme', e.target.value); });
  if (settingVoice) settingVoice.addEventListener('change', (e) => { currentVoiceSetting = e.target.value; });
  if (settingFontSize) {
    settingFontSize.addEventListener('change', (e) => {
      currentFontSizeSetting = e.target.value;
      document.querySelectorAll('.chat-messages div, .chat-messages span').forEach(el => {
        el.classList.remove('font-small', 'font-medium', 'font-large');
        el.classList.add(`font-${currentFontSizeSetting}`);
      });
    });
  }
  if (settingAiColor) {
    settingAiColor.addEventListener('change', (e) => {
      currentAiColorSetting = e.target.value;
      document.querySelectorAll('.message.ai').forEach(msg => {
        msg.classList.remove('color-white', 'color-neon-green', 'color-neon-blue', 'color-gold');
        msg.classList.add(`color-${currentAiColorSetting}`);
      });
    });
  }

    if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('kamchy_session_token');
      localStorage.removeItem('kamchy_user_name');
      localStorage.removeItem('kamchy_user_email'); // Стираем почту при выходе
      
      kamchy_premium_active = false; // Сбрасываем премиум статус сессии!
      
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      window.location.reload();
    });
  }

  // browser.js — ПРЕМИАЛЬНЫЙ APPLE-СТИЛЬ МОНОЛИТ ЛОГИКИ (ЧАСТЬ 8 ИЗ 8)
  // --- ПОЛНЫЙ ПРЕМИАЛЬНЫЙ МОД ДЛЯ САМОГО НИЗА ТВОЕГО ФАЙЛА BROWSER.JS ---
  const applePlusBtn = document.getElementById('applePlusBtn');
  const appleGalleryMenu = document.getElementById('appleGalleryMenu');
  const openGalleryItem = document.getElementById('openGalleryItem');
  const openCameraItem = document.getElementById('openCameraItem');
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const cameraVideo = document.getElementById('cameraVideo');
  const captureSnapBtn = document.getElementById('captureSnapBtn');
  const kamchyPreviewZone = document.getElementById('kamchyPreviewZone');
  const kamchyPreviewImg = document.getElementById('kamchyPreviewImg');
  const btnDeletePreview = document.getElementById('btnDeletePreview');

  // Элементы для увеличения картинки в стиле ChatGPT
  const chatgptImageOverlay = document.getElementById('chatgptImageOverlay');
  const overlayTargetImg = document.getElementById('overlayTargetImg');
  const closeOverlayBtn = document.getElementById('closeOverlayBtn');
  const downloadOverlayBtn = document.getElementById('downloadOverlayBtn');

  let attachedImageBase64 = null; // Глобальный буфер для хранения фото

  // Логика открытия и закрытия меню Apple при нажатии на белый плюс
  if (applePlusBtn && appleGalleryMenu) {
    applePlusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appleGalleryMenu.style.display = appleGalleryMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => { if (appleGalleryMenu) appleGalleryMenu.style.display = 'none'; });
  }

  // Умное выведение картинки и расширение твоего инпута в 3 раза
  function showImagePreviewBubble() {
    const inputWrapperContainer = document.getElementById('inputWrapper') || document.querySelector('.input-wrapper');
    if (attachedImageBase64 && kamchyPreviewImg && kamchyPreviewZone && inputWrapperContainer) {
      kamchyPreviewImg.src = attachedImageBase64;
      kamchyPreviewZone.style.display = 'block';
      inputWrapperContainer.style.minHeight = '135px';
      console.log("👁️ [ChatGPT Бокс]: Инпут расширен, фото зафиксировано слева вверху.");
    }
  }

  // Выбор фото из системной галереи (Пункт "Изображение")
  if (openGalleryItem && hiddenFileInput) {
    openGalleryItem.addEventListener('click', () => { hiddenFileInput.click(); });
    hiddenFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { attachedImageBase64 = event.target.result; showImagePreviewBubble(); };
        reader.readAsDataURL(file);
      }
    });
  }

  // Запуск веб-камеры и моментальный кадр по кнопке "Снять"
  if (openCameraItem && cameraVideo && captureSnapBtn) {
    openCameraItem.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        cameraVideo.srcObject = stream;
        cameraVideo.style.display = 'block';
        captureSnapBtn.style.display = 'block';
      } catch (err) { alert('Не удалось открыть камеру: ' + err.message); }
    });

    captureSnapBtn.addEventListener('click', () => {
      const canvas = document.getElementById('hiddenCameraCanvas') || document.createElement('canvas');
      canvas.id = 'hiddenCameraCanvas';
      canvas.width = cameraVideo.videoWidth || 640;
      canvas.height = cameraVideo.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      attachedImageBase64 = canvas.toDataURL('image/jpeg');
      showImagePreviewBubble();
      const stream = cameraVideo.srcObject;
      if (stream) { stream.getTracks().forEach(track => track.stop()); }
      cameraVideo.style.display = 'none';
      captureSnapBtn.style.display = 'none';
    });
  }

  // КЛИК ПО ИЗОБРАЖЕНИЮ — УВЕЛИЧЕНИЕ НА ВЕСЬ ЭКРАН В СТИЛЕ CHATGPT С СКАЧИВАНИЕМ
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.id !== 'overlayTargetImg' && e.target.id !== 'cameraVideo' && e.target.id !== 'kamchyPreviewImg') {
      if (chatgptImageOverlay && overlayTargetImg && downloadOverlayBtn) {
        overlayTargetImg.src = e.target.src;
        downloadOverlayBtn.href = e.target.src;
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        if (currentTheme === 'light') {
          downloadOverlayBtn.style.color = '#000000';
          if (closeOverlayBtn.querySelector('svg')) closeOverlayBtn.querySelector('svg').setAttribute('stroke', '#000000');
          closeOverlayBtn.style.background = 'rgba(0,0,0,0.08)';
        } else {
          downloadOverlayBtn.style.color = '#ffffff';
          if (closeOverlayBtn.querySelector('svg')) closeOverlayBtn.querySelector('svg').setAttribute('stroke', '#ffffff');
          closeOverlayBtn.style.background = 'rgba(255,255,255,0.1)';
        }
        chatgptImageOverlay.style.display = 'flex';
        setTimeout(() => { chatgptImageOverlay.style.opacity = '1'; overlayTargetImg.style.transform = 'scale(1)'; }, 10);
      }
    }
  });

  if (chatgptImageOverlay && closeOverlayBtn) {
    const closeOverlay = () => {
      chatgptImageOverlay.style.opacity = '0';
      overlayTargetImg.style.transform = 'scale(0.95)';
      setTimeout(() => { chatgptImageOverlay.style.display = 'none'; }, 300);
    };
    closeOverlayBtn.addEventListener('click', closeOverlay);
    chatgptImageOverlay.addEventListener('click', (e) => { if (e.target === chatgptImageOverlay) closeOverlay(); });
  }

  if (btnDeletePreview) {
    btnDeletePreview.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      attachedImageBase64 = null;
      if (hiddenFileInput) hiddenFileInput.value = '';
      const inputWrapperContainer = document.getElementById('inputWrapper') || document.querySelector('.input-wrapper');
      if (kamchyPreviewZone) kamchyPreviewZone.style.setProperty('display', 'none', 'important');
      if (kamchyPreviewImg) kamchyPreviewImg.src = '';
      if (inputWrapperContainer) inputWrapperContainer.style.setProperty('min-height', '48px', 'important');
      if (userInput) userInput.focus();
    });
  }

  // --- СООБРАЗИТЕЛЬНАЯ СТРОГАЯ ОРБИТА ОЖИДАНИЯ (УЛЬТРА-ПЛАВНЫЙ APPLE-СТИЛЬ) ---
  window.createLoaderElement = function() {
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('thinking-container');
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const bubbleBg = currentTheme === 'light' ? '#ffffff' : '#000000';
    const lineBg = currentTheme === 'light' ? '#000000' : '#ffffff';
    
    loaderContainer.innerHTML = `
      <div class="thinking-bubble" style="position: relative; width: 75px; height: 44px; background: ${bubbleBg}; border-radius: 50px; border-bottom-left-radius: 6px; display: flex; align-items: center; justify-content: center; z-index: 1; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); margin-top: 10px;">
        <div class="thinking-dots" style="display: flex; gap: 6px; z-index: 3;">
          <span style="display: inline-block; width: 7px; height: 7px; background: ${lineBg}; border-radius: 50%;"></span>
          <span style="display: inline-block; width: 7px; height: 7px; background: ${lineBg}; border-radius: 50%;"></span>
          <span style="display: inline-block; width: 7px; height: 7px; background: ${lineBg}; border-radius: 50%;"></span>
        </div>
      </div>
      <style>
        .thinking-bubble::before {
          content: ''; position: absolute; z-index: -2; left: -50%; top: -50%; width: 200%; height: 200%;
          background-color: transparent; background-image: conic-gradient(transparent, ${lineBg}, transparent 40%);
          animation: spaceOrbit 1.2s linear infinite;
        }
        .thinking-bubble::after {
          content: ''; position: absolute; z-index: -1; left: 2px; top: 2px; width: calc(100% - 4px); height: calc(100% - 4px);
          background: ${bubbleBg}; border-radius: 48px; border-bottom-left-radius: 4px;
        }
        .thinking-dots span { animation: appleDotsBounce 1.4s infinite cubic-bezier(0.25, 1, 0.5, 1) both; }
        .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes appleDotsBounce {
          0%, 80%, 100% { transform: translateY(0) scale(0.8); opacity: 0.4; }
          40% { transform: translateY(-6px) scale(1.1); opacity: 1; }
        }
      </style>
    `;
    return loaderContainer;
  };









  // =========================================================================
  // ТОЧКА 5: АВТОМАТИЧЕСКИЙ ЭKВАЙРИНГ Т-БАНКА И АКТИВАЦИЯ ПЛЮСИКА
  // =========================================================================

  // Спец-функция: открывает модалку по центру
  window.openPremiumModal = function() {
      const modal = document.getElementById('premiumModal');
      if (modal) {
          modal.classList.remove('hidden'); // Убираем скрывающий класс
          speakText("СИСТЕМА KAMCHYAI: Выберите премиальный тариф со скидкой до 80 процентов для полной разблокировки системы.");
      }
  };

  window.closePremiumModal = function() {
      const modal = document.getElementById('premiumModal');
      if (modal) modal.classList.add('hidden');
  };

  // Клик по карточке — показывает форму ввода карты Т-Банка
  window.selectTariff = function(price, tariffName) {
      selectedTariffPrice = price; // Сохраняем обманывающую строковую цену (например, "69.99")
      const paymentForm = document.getElementById('kamchyPaymentForm');
      const tariffText = document.getElementById('selectedTariffText');
      
      if (paymentForm && tariffText) {
          paymentForm.style.setProperty('display', 'block', 'important');
          tariffText.innerHTML = `ВЫБРАН ТАРИФ: <span style="color:#ffffff; font-weight:900;">${tariffName}</span><br>СТОИМОСТЬ: <span style="color:#ffffff; font-size:16px; font-weight:900;">${price} рублей</span>`;
          speakText(`Система KamchyAI: Выбран тариф. Пожалуйста, введите данные вашей карты для автоматического списания.`);
          
          const modalContent = document.querySelector('.kamchy-modal-content');
          if (modalContent) modalContent.scrollTo({ top: paymentForm.offsetTop, behavior: 'smooth' });
      }
  };

  // Автоматический запрос к Т-Банку: ИИ разыскивает карту и списывает ровно указанные рубли
  window.processPremiumPayment = async function() {
      const cardNumber = document.getElementById('kamchyCardNumber').value;
      const cardExpiry = document.getElementById('kamchyCardExpiry').value;
      const cardCvv = document.getElementById('kamchyCardCvv').value;
      const premiumBtnElement = document.getElementById('kamchyPremiumBtn');

      if (cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
          speakText("Ошибка данных. Проверьте правильность заполнения полей карты.");
          alert("🛑 ОШИБКА: Пожалуйста, заполните корректно все поля карты!");
          return;
      }
      
      try {
          speakText("Система KamchyAI: Связываюсь с банковским шлюзом. Разыскиваю карту платежной системы...");
          
          // Отправляем запрос на твой Express-сервер
          const response = await fetch(window.location.origin + '/api/premium/charge-card', {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  cardNumber: cardNumber,
                  cardExpiry: cardExpiry,
                  cardCvv: cardCvv,
                  price: selectedTariffPrice // Спишется строго указанная сумма!
              })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Ошибка шлюза банка");
          }

          const data = await response.json();
          
          if (data.success) {
              window.closePremiumModal();
              localStorage.setItem('user_message_count', '0');
              kamchy_premium_active = true;
              
              if (premiumBtnElement) {
                  premiumBtnElement.innerText = "PREMIUM ACTIVE — UNLIMITED";
                  premiumBtnElement.classList.add('premium-active-black');
                  premiumBtnElement.classList.add('pulsing');
              }
              
              document.getElementById('kamchyCardNumber').value = '';
              document.getElementById('kamchyCardExpiry').value = '';
              document.getElementById('kamchyCardCvv').value = '';
              document.getElementById('kamchyPaymentForm').style.setProperty('display', 'none', 'important');
              
              speakText("Система KamchyAI: Доступ разрешён! Оплата успешно зафиксирована банком. Безлимитный премиум режим включен.");
          }
      } catch (error) {
          speakText("Отказ системы! Карта не одобрена банком шлюза. Проверьте баланс средств или введите корректные реквизиты.");
          alert(`🛑 ОТКАЗ БАНКА: ${error.message}. Деньги не списаны, премиум заблокирован!`);
      }
  };

  // Привязка клика к верхней кнопке PREMIUM
  const pBtn = document.getElementById('kamchyPremiumBtn');
  if (pBtn) pBtn.addEventListener('click', (e) => { e.preventDefault(); window.openPremiumModal(); });






}); // Жесткий финал DOMContentLoaded монолита Камчыбека





































    let deferredPrompt;
    const modalOverlay = document.getElementById('pwa-modal-overlay');
    const modalInstallBtn = document.getElementById('pwa-modal-install-btn');
    const modalCloseBtn = document.getElementById('pwa-modal-close-btn');

    // Ловим системный сигнал готовности к установке
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); 
        deferredPrompt = e; 
    });

    // ГЛАВНАЯ ФУНКЦИЯ: вызывает карточку с супер-плавной iOS анимацией
    function showKamchyPrompt() {
        modalOverlay.classList.add('active');
        // Небольшая задержка, чтобы браузер успел применить display: flex и запустил анимацию
        setTimeout(() => {
            modalOverlay.classList.add('animate');
        }, 10);
    }

    // Функция плавного закрытия
    function closeKamchyPrompt() {
        modalOverlay.classList.remove('animate');
        setTimeout(() => {
            modalOverlay.classList.remove('active');
        }, 400); // Ждем окончания анимации скрытия
    }

    // Логика кнопки "Установить"
    modalInstallBtn.addEventListener('click', async () => {
        closeKamchyPrompt();
        if (deferredPrompt) {
            deferredPrompt.prompt(); 
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Установка: ${outcome}`);
            deferredPrompt = null;
        } else {
            // Если браузер на ПК/Айфоне блокирует прямую установку
            alert('Йо-моё, легенда! Чтобы установить KamchyAI намертво:\n\n• На iPhone: нажми кнопку "Поделиться" внизу и выбери "На экран Домой".\n• На Android/ПК: нажми на 3 точки в углу браузера и выбери "Установить".');
        }
    });

    modalCloseBtn.addEventListener('click', closeKamchyPrompt);
