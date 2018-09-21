"use strict";

const fs = require("fs");
const Telegraf = require("telegraf");
const key = process.argv[2];
const Markov = require("markov-json");
const cron = require("node-cron");

const bot = new Telegraf(key);
const skeleton = new Markov();
bot.telegram.getMe().then(data =>
	bot.options.username = data.username);

bot.command("markov", ({ message, reply }) => {
	if(fs.existsSync(`./database/${message.chat.id}.json`)) {
		let skelman = new Markov(`./database/${message.chat.id}.json`);
		reply((skelman.sentence(1)).slice(0, 500))
			.catch();
	} else reply("Chain is empty.");
});

bot.on("text", ({ message, reply }) => {
	skeleton.train(message.text);
	skeleton.output(`./database/${message.chat.id}.json`);
});

bot.startPolling();
