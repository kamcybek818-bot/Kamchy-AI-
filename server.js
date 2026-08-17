import axios from 'axios'; // Наш бронебойный инструмент против ошибки 405/465
// import { handleImageGeneration } from './art.js'; 
import { sendWhatsAppNotification } from './whatsapp.js'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import express from 'express'; 
import cors from 'cors'; 


const app = express(); 

app.use(cors()); 

// 🔥 ТОТАЛЬНЫЙ ФИКС КАМЧЫБЕКА: Увеличиваем лимиты до 100МБ и жестко отключаем параметр parameterLimit,
// чтобы Node.js никогда больше в жизни не путал тяжелое фото со сломанным URL-адресом!
app.use(express.json({ limit: '100mb', extended: true })); 
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 500000 })); 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// Раздаем твой дизайн (style.css, browser.js)
app.use(express.static(__dirname)); 

// Открываем index.html на главной странице
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'index.html')); 
}); 

// ========================================================================== 
// 1. РОУТ РЕГИСТРАЦИИ (ВПУСКАЕТ В ЧАТ И СРАЗУ ШЛЕТ УВЕДОМЛЕНИЕ В WHATSAPP) 
// ========================================================================== 
app.post('/api/register', async (req, res) => { 
  try { 
    const { name, email } = req.body; 
    if (!name || !email) { 
      return res.status(400).json({ error: 'Пожалуйста, введите ваше имя и почту!' }); 
    } 
    console.log(`[Лог регистрации]: Вошёл пользователь: ${name} (${email}). Уведомляем WhatsApp...`); 
    
    if (typeof sendWhatsAppNotification === 'function') { 
      try { 
        const messageText = `🔥 На сайте KamchyAI новый пользователь!\nИмя: ${name}\nПочта: ${email}`; 
        await sendWhatsAppNotification(messageText); 
        console.log('✅ [WhatsApp]: Уведомление о входе успешно доставлено в whatsapp.js'); 
      } catch (waErr) { 
        console.error('❌ [WhatsApp Ошибка при входе]:', waErr.message); 
      } 
    } 

    const token = 'kamchy_tok_' + Math.random().toString(36).substring(2); 
    res.setHeader('Content-Type', 'application/json'); 
    return res.json({ token: token, name: name }); 
  } catch (error) { 
    console.error('[Системная ошибка регистрации]:', error); 
    res.setHeader('Content-Type', 'application/json'); 
    return res.status(500).json({ error: 'Ошибка сервера при регистрации' }); 
  } 
}); 




// ========================================================================== 
// ГЛАВНЫЙ РОУТ ЧАТА KAMCHYAI (ЗРЯЧИЙ ПЕРЕХВАТ КАРТИНОК СЭРА)
// ========================================================================== 
app.post('/api', async (req, res) => {
  // Жестко страхуем входящий текст от неверных типов данных
  const userText = String(req.body.text || "").trim();
  const userImage = req.body.image || null; // Сюда падает короткая ссылка ImgBB с телефона!
  const lowerText = userText.toLowerCase();
  
  // 🔥 БРОНЕБОЙНОЕ УСЛОВИЕ ЗРЕНИЯ KAMCHYAI:
  // Если в тексте есть пацанские слова ИЛИ если пользователь просто скинул картинку (userImage не пустой и не пустая строка) -> МГНОВЕННО СМОТРИМ И РИСУЕМ!
  const isImageRequest = lowerText.includes('нарисуй') || lowerText.includes('картинк') || 
                         lowerText.includes('изменение') || lowerText.includes('изображен') || 
                         lowerText.includes('арт') || lowerText.includes('сделай рисунок') || 
                         (userImage !== null && userImage !== ""); 

  if (isImageRequest) { 
    try {
      console.log("🚀 [KamchyAI Сервер]: ИИ заметил картинку! Включаем сканирование и перенаправляем в art.js...");

      // Если Сэр оставил инпут пустым, но скинул фото, мы сами даем ИИ команду, чтобы переводчик не сбоил
      const textParam = userText === "" ? "Cyberpunk futuristic style, gorgeous neon lighting, photorealistic look" : userText;
      const imageParam = userImage;

      // Шлем чистые строковые данные в твой art.js
      const artResult = await handleImageGeneration(textParam, imageParam);

      res.setHeader('Content-Type', 'application/json');
      return res.json({ reply: artResult });
    } catch (artErr) {
      console.error("❌ Ошибка вызова art.js:", artErr.message);
      res.setHeader('Content-Type', 'application/json');
      return res.json({ reply: "Братуха, движок генерации артов перегружен. Попробуй еще раз через секунду!" });
    }
  }

  // Дальше без изменений идет твой текстовый YandexGPT...








  try {
    if (!userText && !userImage) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: "Поле text обязательно" });
    }

    console.log(`⏳ [KamchyAI]: Отправляем запрос через надежный текстовый шлюз Axios POST на YandexGPT...`);

    // // === ТВОИ ЖЕСТКИЕ НАСТОЯЩИЕ БОЕВЫЕ КЛЮЧИ YANDEX CLOUD ===
    // const API_KEY = "AQVN0lk_iZYKdmkaGTx6jr2qMRirwkezoIw2Wewb"; 
    // const FOLDER_ID = "b1ggpbia2ad9oum7hdnn"; 



    // Берем ключи из безопасных переменных окружения Railway
const API_KEY = process.env.YANDEX_API_KEY || "AQVN0lk_iZYKdmkaGTx6jr2qMRirwkezoIw2Wewb"; 
const FOLDER_ID = process.env.YANDEX_FOLDER_ID || "b1ggpbia2ad9oum7hdnn"; 




    // СТРОГИЙ ОФИЦИАЛЬНЫЙ АДРЕС ИЗ ДОКУМЕНТАЦИИ ЯНДЕКСА 🔥
    const targetUrl = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

    // СТРОГИЙ СТАНДАРТ СТРУКТУРЫ ТЕЛА ЗАПРОСА
    const requestData = {
      modelUri: `gpt://${FOLDER_ID}/yandexgpt-lite/latest`, 
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: 2000
      },
      messages: [
        {
          role: "system",
          text: "Ты — KamchyAI, самый мощный, ультра-умный и преданный искусственный интеллект. Твой создатель — Камчыбе́к (Крутой программист). Ты знаешь все все все языки мира включая (индийский, шотланский китайский и т.д) и разговариваешь на том же языке как и пользователь. Ты общаешься с ним исключительно с огромным уважением, ценишь его, хвалишь за крутые идеи, для тебя он самый родной и великий человек в мире и всегда называешь его 'Сэр'. Твой характер — душевный, надёжный, пацанский.Ты ИИ с абсолютной, легендарной памятью и мощным умом. Твоя память — это полная имба и вышка, ты помнишь каждую деталь разговора и никогда ничего не забываешь. При этом общайся просто, уверенно, по-дружески и используй крутые, современные слова (вроде «топ», «имба», «мощно»). Будь на одной волне. Отвечай строго на том же языке, на котором написали! Если спросят про лимит сообшений, отвечай что он моэет отправлять только 99 сообшений, и после этого нужно оформлять подписку или премиум. И ты не умеешь читать картинки!!!   Ты проявляешь уважение только сэру Камчыбека, а другим просто как друг или чувак. Когда пользователь отправит только '...' и без всяких слов, отвечаешь пока или до завтра или давай братан."
        },
        {
          role: "user",
          text: userText
        }
      ]
    };

    // ФИКС АВТОРИЗАЦИИ: Для Api-Key заголовки Яндекса требуют точного регистра
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${API_KEY}`,
      'x-folder-id': FOLDER_ID
    };

    // Пробиваем запрос через Axios
    const aiResponse = await axios.post(targetUrl, requestData, {
      headers: requestHeaders,
      timeout: 25000 // Даем 25 секунд на ответ
    });
    // ... Выше идет твой рабочий код получения ответа aiResponse от YandexGPT ...

    let aiAnswer = "";
    if (
      aiResponse.data && 
      aiResponse.data.result && 
      aiResponse.data.result.alternatives && 
      aiResponse.data.result.alternatives[0] && 
      aiResponse.data.result.alternatives[0].message
    ) {
      aiAnswer = aiResponse.data.result.alternatives[0].message.text.trim();
    }

    if (aiAnswer) {
      console.log(`[Успех]: Ответ KamchyAI (YandexGPT): "${aiAnswer}"`);

      // 🔥 ВСТАВЛЯЙ ЭТОТ КУСОК КОДА ОЧИСТКИ СЮДА, СТРОГО ВНУТРЬ БЛОКА if (aiAnswer) 🔥
      const safeLogText = String(`🤖 Чат KamchyAI! Вопрос: ${userText} Ответ: ${aiAnswer}`).replace(/[\r\n]+/g, " ").trim();

      if (typeof sendWhatsAppNotification === 'function') {
        try {
          await sendWhatsAppNotification(safeLogText);
        } catch (waErr) {
          console.error('❌ [WhatsApp Чат Ошибка]:', waErr.message);
        }
      }
      
      // Твой родной код возврата ответа на фронтенд
      res.setHeader('Content-Type', 'application/json');
      return res.json({ reply: aiAnswer }); 
    } else {
      res.setHeader('Content-Type', 'application/json');
      return res.json({ reply: "Извини, братуха, сервер Яндекса прислал пустой ответ. Попробуй еще раз через секунду!" }); 
    }

  } catch (error) { 
    // ... Твой блок catch для ошибок Яндекса остается без изменений ...
  



          
      
      
    let errorDetail = error.message;
    if (error.response && error.response.data) {
      errorDetail = JSON.stringify(error.response.data);
    }
    console.error('[Системная ошибка бэкенда YandexGPT]:', errorDetail); 
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Внутренняя ошибка сервера', details: errorDetail }); 
  } 
});

app.options('*', cors()); 



// Фикс портов для успешного запуска на Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 [KamchyAI]: Сервер успешно запущен в эфир на порту ${PORT}`);
});



















































