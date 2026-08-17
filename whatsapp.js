// import greenAPI from '@green-api/whatsapp-api-client';

// // 1. Подключаем твои настоящие ключи от GREEN-API
// const whatsapp = greenAPI.restAPI({
//     idInstance: "720122701964", 
//     apiTokenInstance: "4dbc1de82d9644818689546653254a8e16b22c98fc1948d5b8"
// });

// // 2. Функция для отправки сообщения тебе на телефон
// export async function sendWhatsAppNotification(candidateName, candidateEmail) {
//     try {
//         // Твой номер телефона для отправки уведомлений
//         const myPhoneNumber = "79804127991"; 

//         // Текст сообщения
//         const messageText = `🔥 Новая регистрация на сайте!\nИмя: ${candidateName}\nПочта: ${candidateEmail}`;

//         console.log(`⏳ [WhatsApp SDK]: Отправка сообщения для -> Имя: ${candidateName}`);

//         // Отправляем сообщение
//         const response = await whatsapp.message.sendMessage(
//             `${myPhoneNumber}@c.us`, 
//             null, 
//             messageText
//         );

//         console.log("✅ [WhatsApp SDK]: Сообщение успешно доставлено тебе на телефон!", response);
//         return { success: true };

//     } catch (error) {
//         console.error("❌ [WhatsApp SDK] Ошибка при отправке сообщения:", error.message);
//         return { success: false, error: error.message };
//     }
// }
















import greenAPI from '@green-api/whatsapp-api-client'; 

// 1. Подключаем твои настоящие ключи от GREEN-API
const whatsapp = greenAPI.restAPI({ 
    idInstance: "720122701964", 
    apiTokenInstance: "4dbc1de82d9644818689546653254a8e16b22c98fc1948d5b8" 
}); 

// 2. Универсальная функция: теперь принимает любой готовый текст и шлет тебе в Ватсап!
export async function sendWhatsAppNotification(messageText) { 
    try { 
        // Твой номер телефона для отправки уведомлений
        const myPhoneNumber = "79804127991"; 

        console.log(`⏳ [WhatsApp SDK]: Отправка уведомления на номер ${myPhoneNumber}...`); 

        // Отправляем сообщение через официальный метод SDK
        const response = await whatsapp.message.sendMessage( 
            `${myPhoneNumber}@c.us`, 
            null, 
            messageText 
        ); 

        console.log("✅ [WhatsApp SDK]: Сообщение успешно доставлено тебе на телефон!", response); 
        return { success: true }; 
    } catch (error) { 
        console.error("❌ [WhatsApp SDK] Ошибка при отправке сообщения:", error.message); 
        return { success: false, error: error.message }; 
    } 
}
