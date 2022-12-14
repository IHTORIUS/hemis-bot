process.env.NTBA_FIX_319 = 1;
const PORT = process.env.PORT || 3000
process.env.TZ = 'Asia/Tashkent';
const TelegramApi = require('node-telegram-bot-api')
const express = require('express')

const app = express()

let parse = require("./parser")
let updateData = require("./emuter");
console.log(parse());
let timetable = parse()

const server = app.listen(PORT, () => console.log(`Listening at port ${PORT}`))

app.get('/add', (req, res) => {
    req.statusCode(200);
})
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
        await updateData();
        timetable = parse();
        console.log("После",timetable);
        await bot.sendMessage(chatId, "Неделя обнавлена.");
    }

    if (text === "/teachers") {
        await bot.sendMessage(chatId,
            `
[ZULUNOV R. M](https://t.me/TATUFF_DI)
[SADIKOVA M. A.](https://t.me/Muniraxon_17)
[XADJAYEV S. I.](https://t.me/Breddy97)
[TILLYABOYEV A. A.](https://t.me/MasterSPI)
`, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });
    }

    if (text === "Сейчас... ⏳") {
        //Now time
        nowM = new Date().getMinutes();
        nowH = new Date().getHours() + nowM / 60;
        today = new Date().getDay() - 1;
        let now = "";
        //Check to epmty
        if (timetable.length != "") {
            //Lesson now
            if (8.5 <= +nowH && nowH <= 9.8333) {
                now = `
${timetable[today].less1}

До конца урока осталось: ${Math.round((9.8333-nowH)*60)} мин.
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

До конца урока осталось: ${Math.round((11.3333-nowH)*60)} мин.
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

До конца урока осталось: ${Math.round((12.8333-nowH)*60)} мин.
`
            } else if (nowH < 8.5 || nowH > 14.8333) {
                now = "В данный момент уроков нет."

            } else {
                now = "В данный момент уроков нет."
            }
        } else {
            now = "В данный момент уроков нет?"
        }
        await bot.sendMessage(chatId, now, {
            parse_mode: 'HTML'
        })
    }

    if (text === "Сегодня 🌄") {
        //Today`s table
        today = new Date().getDay() - 1
        var todayTable;
        if (today === 5 || today === -1) {
            todayTable = "Сегодня выходной день. Уроков нет.";
        } else {
            todayTable =
                `
${timetable[today].day}
${timetable[today].date}:

${timetable[today].less1}

${timetable[today].less2}

${timetable[today].less3}
    `
        }
        await bot.sendMessage(chatId, todayTable, {
            parse_mode: 'HTML'
        })
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
        await bot.sendMessage(chatId, week, {
            parse_mode: 'HTML'
        })
    }

})