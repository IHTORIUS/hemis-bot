const puppeteer = require('puppeteer');
const fs = require("fs");
const url = 'https://student.fbtuit.uz/dashboard/login';

//Get week number
currentdate = new Date();
var oneJan = new Date(currentdate.getFullYear(), 0, 1);
var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
var thisweek = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7) + 4126;


async function getPage(){
console.log("Неделя:",thisweek);
//Open Chromium and set options
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--use-gl=egl'],
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

//New page with urls
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0'
  });

//Enter data
  await page.type('input[id = formstudentlogin-login]', '392191100445');
  await page.type('input[id = formstudentlogin-password]', 'torius3341');

  await Promise.all([
    page.click('button[type = submit]'),
    page.waitForNavigation({
      waitUntil: 'networkidle0'
    }),
  ]);

  await page.goto(`https://student.fbtuit.uz/ru/education/time-table?week=${thisweek}`, {waitUntil: 'load', timeout: 0});

  const html = await page.content();

//Save or update saved page
  fs.writeFile("hemis.html", html, function (error) {
    if (error) throw error;
    console.log("Асинхронная запись страницы в файла завершена.");
  });

  browser.close()
};
module.exports = getPage;