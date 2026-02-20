import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://your-domain.com';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 AvtoSotuv Bot is running...');

// /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'do\'st';

    bot.sendMessage(
        chatId,
        `🚗 *Assalomu alaykum, ${firstName}!*\n\n` +
        `*AvtoSotuv* — Telegram orqali mashina oldi-sotdi platformasi.\n\n` +
        `✅ Mashina e'lonlarini ko'ring\n` +
        `✅ O'z mashinangizni joylashtiring\n` +
        `✅ Eng qulay narxlarni toping\n\n` +
        `_Quyidagi tugmani bosib boshlang_ 👇`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🚗 Mashina Bozori',
                            web_app: { url: MINI_APP_URL },
                        },
                    ],
                    [
                        {
                            text: '📢 Kanal',
                            url: 'https://t.me/avtosotuv_uz',
                        },
                    ],
                ],
            },
        }
    );
});

// /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `ℹ️ *AvtoSotuv yordam*\n\n` +
        `📱 /start — Botni ishga tushirish\n` +
        `❓ /help — Yordam\n\n` +
        `🚗 Mashina bozorini ochish uchun "Mashina Bozori" tugmasini bosing.`,
        { parse_mode: 'Markdown' }
    );
});

// Handle any text message
bot.on('message', (msg) => {
    if (msg.text?.startsWith('/')) return; // Skip commands

    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        '🚗 Mashina bozorini ochish uchun /start buyrug\'ini yuboring yoki quyidagi tugmani bosing:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🚗 Mashina Bozori',
                            web_app: { url: MINI_APP_URL },
                        },
                    ],
                ],
            },
        }
    );
});
