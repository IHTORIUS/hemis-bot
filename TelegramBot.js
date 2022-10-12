process.env.NTBA_FIX_319 = 1;
process.env.TZ = 'Asia/Tashkent';
const TelegramApi = require('node-telegram-bot-api')
const timetable = require("./parser")
const updateData = require("./emuter");

console.log(timetable);

//Bot`s token
const token = '5165864513:AAEVXXwyeO_AyiMIlp0YhGq7VmdRKRB8Py8'
const bot = new TelegramApi(token, {
    polling: true
});

//Set time
let nowM = new Date().getMinutes();
let nowH = new Date().getHours() + nowM / 60;
let today = new Date().getDay() - 1;

//Bot API
bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
        await bot.sendMessage(chatId, `Привет ${msg.from.first_name}, пользуйся.`);

        bot.sendMessage(msg.chat.id, "Выбирай одну из расписаний👇🏻", {
            "reply_markup": {
                'resize_keyboard': true,
                "keyboard": [
                    ["Сейчас... ⏳"],
                    ["Сегодня 🌄"],
                    ["За неделю 📆"]
                ]
            },
        });
        console.log(msg.from);
    }

    if (text === "/info") {
        await bot.sendMessage(chatId, "Бот парсит данные из сайта https://student.fbtuit.uz/ По всем вопросам: @ihtorius");
    }

    if (text === "/update") {
        await bot.sendMessage(chatId, "Данные обновляются. Ждите...");
        updateData();
    }

    if (text === "Сейчас... ⏳") {
        //Now time
        nowM = new Date().getMinutes();
        nowH = new Date().getHours() + nowM / 60;
        today = new Date().getDay() - 1;
        let now = "";

        //Check to epmty
        if (timetable.length != 0) {
            //Lesson now
            if (8.5 <= +nowH && nowH <= 9.8333) {
                now =
                    `
${timetable[today].less1}
`
            } else if (9.833 < nowH && nowH < 10) {
                now =
                    `До начала урока: ${60-nowM} мин.

${timetable[today].less2}
`
            } else if (10 <= +nowH && nowH <= 11.3333) {
                now =
                    `
${timetable[today].less2}
`
            } else if (11.3333 < nowH && nowH < 11.5) {
                now =
                    `До начала урока: ${30-nowM} мин.

${timetable[today].less3}
`
            } else if (11.5 <= +nowH && nowH <= 12.8333) {
                now =
                    `
${timetable[today].less3}
`
            } else if (nowH < 8.5 || nowH > 14.8333) {
                now = "В данный момент уроков нет."

            } else {
                now = "В данный момент уроков нет."
            }
        } else {
            now = "В данный момент уроков нет?"
        }
        await bot.sendMessage(chatId, now)
    }

    if (text === "Сегодня 🌄") {
        //Today`s table
        today = new Date().getDay() - 1
        var todayTable =
            `
${timetable[today].day}
${timetable[today].date}:

${timetable[today].less1}

${timetable[today].less2}

${timetable[today].less3}
    `
        await bot.sendMessage(chatId, todayTable)
    }

    if (text === "За неделю 📆") {
        //Week`s table
        var week = "";
        for (let i = 0; i < 5; i++) {
            week +=
                `
${timetable[i].day.toUpperCase()}
${timetable[i].date}:

${timetable[i].less1}
${timetable[i].less2}
${timetable[i].less3}
    `
        }
        await bot.sendMessage(chatId, week)
    }

})