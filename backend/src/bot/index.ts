import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/env';

const MINI_APP_URL = process.env.MINI_APP_URL || 'https://avto-sotuv.vercel.app';

let bot: TelegramBot | null = null;

export function startBot() {
    const token = config.botToken;

    if (!token || token === 'undefined') {
        console.warn('⚠️ BOT_TOKEN not set, skipping bot startup');
        return;
    }

    try {
        bot = new TelegramBot(token, { polling: true });

        console.log('🤖 AvtoSotuv Bot started!');
        console.log('🔗 Mini App URL:', MINI_APP_URL);

        // /start command
        bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            const firstName = msg.from?.first_name || 'do\'st';

            bot!.sendMessage(
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
                        ],
                    },
                }
            );
        });

        // /help command
        bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;

            bot!.sendMessage(
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
            if (msg.text?.startsWith('/')) return;

            const chatId = msg.chat.id;
            bot!.sendMessage(
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

        // Error handler
        bot.on('polling_error', (error) => {
            console.error('🤖 Bot polling error:', error.message);
        });

    } catch (error) {
        console.error('🤖 Failed to start bot:', error);
    }
}
