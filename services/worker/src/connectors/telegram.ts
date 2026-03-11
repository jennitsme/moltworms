import TelegramBot, { Message as TgMessage } from "node-telegram-bot-api";
import { prisma } from "../db.js";
import { queues } from "../queues.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.warn("[telegram] TELEGRAM_BOT_TOKEN not set; connector disabled");
}

let bot: TelegramBot | null = null;

export function getTelegramBot() {
  if (!token) return null;
  if (bot) return bot;
  bot = new TelegramBot(token, { polling: true });
  bot.on("message", handleMessage);
  console.log("[telegram] polling started");
  return bot;
}

async function handleMessage(msg: TgMessage) {
  if (!msg.chat || !msg.text) return;
  const chatId = msg.chat.id.toString();
  const from = msg.from?.username || msg.from?.first_name || "unknown";

  // Ensure channel exists
  let channel = await prisma.channel.findUnique({ where: { id: chatId } });
  if (!channel) {
    channel = await prisma.channel.create({
      data: {
        id: chatId,
        type: "telegram",
        label: msg.chat.title || msg.chat.username || `tg-${chatId}`,
        config: {},
        userId: await ensureDemoUser(),
      },
    });
  }

  // Thread per chat
  let thread = await prisma.thread.findFirst({ where: { channelId: channel.id, externalId: chatId } });
  if (!thread) {
    thread = await prisma.thread.create({
      data: {
        channelId: channel.id,
        externalId: chatId,
        subject: msg.chat.title || msg.chat.username || `Chat ${chatId}`,
        status: "open",
      },
    });
  }

  await prisma.message.create({
    data: {
      threadId: thread.id,
      direction: "inbound",
      author: from,
      content: msg.text,
      metadata: { telegram: { chatId, messageId: msg.message_id } },
      occurredAt: new Date(msg.date * 1000),
    },
  });

  // Enqueue processing
  await queues.processMessage.add("tg", { messageId: `${msg.message_id}-${thread.id}` });
}

async function ensureDemoUser(): Promise<string> {
  const email = "demo@moltworms.local";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo User" },
  });
  return user.id;
}
