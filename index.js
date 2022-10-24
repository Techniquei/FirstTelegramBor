const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againgGameOptions}  = require('./options')
const token = '5725749501:AAHPKWDuxkeGUvChfZJT9gImst5e9EPBRng';

const chats = {};

const bot = new TelegramBot(token, {polling: true});



const startGame = async (chatId)  => {
  await bot.sendMessage(chatId, 'Я загадаю число от 0 до 5, попробуй отгадать')
  const randomNumber = Math.floor(Math.random()*5)
  chats[chatId]  = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = function(){

  bot.setMyCommands([
    {command: '/start', description: 'Start'},
    {command: '/info', description: 'Info'},
    {command: '/game', description: 'game'},
  ]);

  bot.on('message', async msg =>{
    const text = msg.text;
    const chatId = msg.chat.id;
    if(text==='/start'){
      await bot.sendMessage(chatId, 'Добро пожаловать в лучшего бота')
      return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/12.webp')
      
    }
    if(text==='/info'){
      return bot.sendMessage(chatId, JSON.stringify(msg.chat))
    }

    if(text==='/game'){
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю');

  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    console.log(data, chats[chatId])
    if(data === '/again'){
      return startGame(chatId);
    }
    if(data == Number(chats[chatId])){
      return bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`)
    } else {
      return bot.sendMessage(chatId, `Ты не угадал`, againgGameOptions)
    }
  })

}

start()