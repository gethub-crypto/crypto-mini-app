const TelegramBot = require('node-telegram-bot-api');
const firebase = require('./firebase');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

let bot;

function initBot() {
  if (!bot) {
    bot = new TelegramBot(BOT_TOKEN);
  }
  return bot;
}

module.exports = async (req, res) => {
  try {
    const bot = initBot();
    const { body } = req;

    // Обрабатываем сообщения
    if (body.message) {
      const msg = body.message;
      const chatId = msg.chat.id;
      const text = msg.text;

      // Команда /start
      if (text === '/start' || text === '/menu') {
        const keyboard = {
          reply_markup: {
            keyboard: [
              ['📊 Курсы криптовалют', '⭐ Премиум'],
              ['📱 Открыть Mini App', 'ℹ️ Помощь']
            ],
            resize_keyboard: true
          }
        };

        await bot.sendMessage(chatId, 
          '🚀 *Добро пожаловать в Crypto Tracker!*\n\n' +
          '📊 *Бесплатные функции:*\n' +
          '• Курсы BTC, ETH, BNB\n' +
          '• Изменения за 24 часа\n\n' +
          '⭐ *Премиум (50 Stars):*\n' +
          '• Топ-20 криптовалют\n' +
          '• Расширенная аналитика\n' +
          '• Графики цен\n\n' +
          'Нажмите 📱 для запуска Mini App',
          { 
            parse_mode: 'Markdown',
            ...keyboard 
          }
        );
      }

      // Курсы криптовалют
      else if (text === '📊 Курсы криптовалют') {
        try {
          const axios = require('axios');
          const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd&include_24hr_change=true'
          );
          
          const data = response.data;
          let message = '📊 *Курсы криптовалют*\n\n';
          
          const coins = {
            bitcoin: '₿ Bitcoin',
            ethereum: 'Ξ Ethereum', 
            binancecoin: '🟡 BNB'
          };
          
          for (const [id, name] of Object.entries(coins)) {
            if (data[id]) {
              const price = data[id].usd;
              const change = data[id].usd_24h_change || 0;
              const emoji = change >= 0 ? '📈' : '📉';
              
              message += `*${name}*\n`;
              message += `💵 $${price.toLocaleString()}\n`;
              message += `${emoji} 24ч: ${change.toFixed(2)}%\n\n`;
            }
          }
          
          message += '💡 *Больше криптовалют в премиум версии!*';
          
          await bot.sendMessage(chatId, message, { 
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '📱 Открыть Mini App', web_app: { url: WEBAPP_URL } }
              ]]
            }
          });
        } catch (error) {
          await bot.sendMessage(chatId, '❌ Ошибка загрузки курсов. Попробуйте позже.');
        }
      }

      // Премиум
      else if (text === '⭐ Премиум') {
        await bot.sendMessage(chatId,
          '⭐ *Премиум возможности:*\n\n' +
          '• 📊 Топ-20 криптовалют\n' +
          '• 📈 Графики изменения цен\n' +
          '• 💰 Рыночная капитализация\n' +
          '• 🔔 Уведомления о изменениях\n\n' +
          '*Цена: 50 Telegram Stars*',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '💎 Купить Premium (50 ⭐)', callback_data: 'buy_premium' }],
                [{ text: '📱 Открыть Mini App', web_app: { url: WEBAPP_URL } }]
              ]
            }
          }
        );
      }

      // Открыть Mini App
      else if (text === '📱 Открыть Mini App') {
        await bot.sendMessage(chatId, '🚀 Запустите Mini App:', {
          reply_markup: {
            inline_keyboard: [[
              { text: '📱 Открыть Crypto Tracker', web_app: { url: WEBAPP_URL } }
            ]]
          }
        });
      }

      // Помощь
      else if (text === 'ℹ️ Помощь') {
        await bot.sendMessage(chatId,
          'ℹ️ *Помощь по использованию*\n\n' +
          '*Бесплатно:*\n' +
          '• Курсы BTC, ETH, BNB\n' +
          '• Изменения за 24ч\n\n' +
          '*Премиум (50 ⭐):*\n' +
          '• Все криптовалюты\n' +
          '• Расширенная аналитика\n\n' +
          '*Команды:*\n' +
          '/start - Главное меню',
          { parse_mode: 'Markdown' }
        );
      }
    }

    // Обработка callback query (inline кнопки)
    if (body.callback_query) {
      const query = body.callback_query;
      const chatId = query.message.chat.id;
      
      if (query.data === 'buy_premium') {
        // Сохраняем премиум в Firebase
        await firebase.update(`users/${chatId}`, {
          premium: true,
          activatedAt: Date.now()
        });
        
        await bot.sendMessage(chatId, '✅ Премиум активирован! Данные сохранены в Firebase 🎉');
        await bot.answerCallbackQuery(query.id, { text: 'Премиум активирован!' });
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Bot error:', error);
    res.status(500).json({ error: error.message });
  }
};
