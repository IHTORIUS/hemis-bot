const cheerio = require("cheerio");
const fs = require("fs");

//download local page html file
const data = fs.readFileSync('./hemis.html')

const $ = cheerio.load(data);

//get days
const days = $(".box-title");

const dayslist = [];
days.each((idx, el) => {
    dayslist.push($(el).text().split("\n")[1].trim())
})
//get dates
const date = $(".box-title").children('.pull-right');
const datelist = [];
date.each((idx, el) => {
    datelist.push($(el).text().trim())
})
const listItems = $(".box-footer");
const lessons = [];

//main function
async function parseData() {
    
    listItems.each((idx, el) => {

        const timetable = {
            day: "",
            date: "",
            less1: "",
            less2: "",
            less3: "",
            less4: ""
        };
        timetable.day = dayslist[idx]
        timetable.date = datelist[idx]

        //1-lesson
        if ($(el).text().split("\n")[12]) {

            timetable.less1 = `1. ${$(el).text().split("\n")[12].trim()} | ${$(el).text().split("\n")[6].trim().bold()} |${$(el).text().split("\n")[5].trim().substring(2)} - ${$(el).text().split("\n")[8].trim().toLowerCase().substring(0,4)}.  ${$(el).text().split("\n")[10].trim()} `
        }
        //2-lesson
        if ($(el).text().split("\n")[26]) {

            timetable.less2 = `2. ${$(el).text().split("\n")[26].trim()} |${$(el).text().split("\n")[20].trim().bold()} |${$(el).text().split("\n")[19].trim().substring(2)} - ${$(el).text().split("\n")[22].trim().toLowerCase().substring(0,4)}.  ${$(el).text().split("\n")[24].trim()} `
        }
        //3-lesson
        if ($(el).text().split("\n")[40]) {

            timetable.less3 = `3. ${$(el).text().split("\n")[40].trim()} | ${$(el).text().split("\n")[34].trim().bold()} |${$(el).text().split("\n")[33].trim().substring(2)} - ${$(el).text().split("\n")[36].trim().toLowerCase().substring(0,4)}.  ${$(el).text().split("\n")[38].trim()} `
        }
        //4-lesson
        if ($(el).text().split("\n")[54]) {

            timetable.less4 = `4. ${$(el).text().split("\n")[54].trim()} | ${$(el).text().split("\n")[48].trim().bold()} | ${$(el).text().split("\n")[47].trim()} - ${$(el).text().split("\n")[50].trim().toLowerCase().substring(0,4)}.  ${$(el).text().split("\n")[52].trim()} `
        }

        lessons.push(timetable);
    });
}
// updateData();
parseData();
console.log(lessons);
module.exports = lessons
