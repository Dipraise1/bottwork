import { Telegraf, Scenes, session } from "telegraf";
import fs from "fs";
import stringify from "json-stringify-safe";
import { config } from "dotenv";

// Load the environment variables from the '.env' file
config();

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

// Function to generate HTML content with a bold heading and bulleted points
function generateHTMLContent(dataArray, header) {
  let htmlContent = `<b>${header}:</b>\n\n`;

  // Add each item as a bulleted point
  dataArray.forEach((item) => {
    htmlContent += `• username: @${item?.username}\n\u00A0\u00A0\u00A0price: ${item.price}\n\n`;
  });

  htmlContent += `<i>enter the username of the freelancer you wish to contract</i>`;

  return htmlContent;
}

// Initialize state and data
const state = {
  "Software Developer": [],
  "Graphic Designer": [],
  "Web Developer": [],
  Marketer: [],
  Raider: [],
  "Blockchain Engineer": [],
  "Software Tester": [],
};

let data = {};
try {
  const rawData = fs.readFileSync("data.json");
  data = JSON.parse(rawData);
} catch (error) {
  console.error("Error reading data.json:", error);
}

// Create scenes
const startScene = new Scenes.BaseScene("start");
const tradeScreen = new Scenes.BaseScene("tradeScreens");
const freelanceScene = new Scenes.BaseScene("freelance");
const softwareDeveloperScene = new Scenes.BaseScene("softwareDeveloper");
const graphicDesignerScene = new Scenes.BaseScene("graphicDesigner");
const webDevScene = new Scenes.BaseScene("webDev");
const marketerScene = new Scenes.BaseScene("marketerS");
const raiderScene = new Scenes.BaseScene("raiderS");
const blockchainEngineerScene = new Scenes.BaseScene("blockchainEngineer");
const softwareTesterScene = new Scenes.BaseScene("softwareTester");

// Start scene handlers
startScene.enter((ctx) => {
  ctx.replyWithPhoto({
    source: "IMG_7627 (1).JPG" // Replace "path_to_your_image.jpg" with the actual path to your image file
  }, {
    caption: "What can this bot do?\n\nWelcome to Vet Ai Bot!\n\nThe best safety bot on ETH.\n\nFirst Command: /start\n\nThis is the official safety Bot \n\nTelegram: [VetAiERC](https://t.me/VetAiERC) Community before",
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Initialize a trade", callback_data: "trade" },
          { text: "Apply as a web3 freelancer", callback_data: "freelance" },
        ],
      ],
    },
  });
});

startScene.action("freelance", (ctx) => {
  ctx.scene.enter("freelance");
});

startScene.action("trade", (ctx) => {
  ctx.scene.enter("tradeScreens");
});


// Trade screen handlers
tradeScreen.enter((ctx) => {
  ctx.deleteMessage();
  ctx.reply("Select a specialty...", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Software Developer", callback_data: "tradesoftwaredev" },
          { text: "Graphic Designer", callback_data: "tradedesigner" },
        ],
        [
          { text: "Web Developer", callback_data: "tradewebdev" },
          { text: "Marketer", callback_data: "trademarketer" },
        ],
        [
          { text: "Raider", callback_data: "traderaider" },
          { text: "Blockchain Engineer", callback_data: "tradengineer" },
        ],
        [{ text: "Software Tester", callback_data: "tradetester" }],
      ],
    },
  });
});
tradeScreen.action("tradesoftwaredev", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Software Developer"],
    "List of Software Developers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("tradedesigner", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Graphic Designer"],
    "List of Graphic Designers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("tradewebdev", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Web Developer"],
    "List of Web Developers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("trademarketer", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Marketer"],
    "List of Marketers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("traderaider", (ctx) => {
  const htmlContent = generateHTMLContent(data["Raider"], "List of Raiders");
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("tradengineer", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Blockchain Engineer"],
    "List of Blockchain Engineers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});
tradeScreen.action("tradetester", (ctx) => {
  const htmlContent = generateHTMLContent(
    data["Software Tester"],
    "List of Software Testers"
  );
  ctx.deleteMessage();
  ctx.replyWithHTML(htmlContent);
});

// Freelance scene handlers
freelanceScene.enter((ctx) => {
  ctx.deleteMessage();
  ctx.reply("Select your specialty...", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Software Developer", callback_data: "softwaredev" },
          { text: "Graphic Designer", callback_data: "designer" },
        ],
        [
          { text: "Web Developer", callback_data: "webdev" },
          { text: "Marketer", callback_data: "marketer" },
        ],
        [
          { text: "Raider", callback_data: "raider" },
          { text: "Blockchain Engineer", callback_data: "blockchainengineer" },
        ],
        [{ text: "Software Tester", callback_data: "softwaretester" }],
      ],
    },
  });
});
freelanceScene.action("softwaredev", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created a "Software Developer" entry
  const existingEntry = data["Software Developer"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Software Developer entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("softwareDeveloper");
});
freelanceScene.action("designer", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created an entry
  const existingEntry = data["Graphic Designer"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Graphic Designer entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("graphicDesigner");
});
freelanceScene.action("webdev", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created a "Web Developer" entry
  const existingEntry = data["Web Developer"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Web Developer entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("webDev");
});
freelanceScene.action("marketer", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created an entry
  const existingEntry = data["Marketer"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Marketer entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("marketerS");
});
freelanceScene.action("raider", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created an entry
  const existingEntry = data["Raider"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Raider entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("raiderS");
});
freelanceScene.action("blockchainengineer", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created an entry
  const existingEntry = data["Blockchain Engineer"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Blockchain Engineer entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("blockchainEngineer");
});
freelanceScene.action("softwaretester", (ctx) => {
  ctx.deleteMessage();
  // Check if the user has already created an entry
  const existingEntry = data["Software Tester"].find(
    (entry) => entry.id === ctx.from.id && entry.username === ctx.from.username
  );

  if (existingEntry) {
    // Reply to the user if the entry already exists
    ctx.reply("You already have a Software Tester entry.");
    return; // Stop the specialty creation process
  }

  // If entry does not exist, proceed with creating a new entry
  ctx.scene.enter("softwareTester");
});

// Software Developer scene handlers
softwareDeveloperScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
softwareDeveloperScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Software Developer"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Software Developer."
  );
});

// Graphic Designer scene handlers
graphicDesignerScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
graphicDesignerScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Graphic Designer"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Graphic Designer."
  );
});

// Web Developer scene handlers
webDevScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
webDevScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Web Developer"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Web Developer."
  );
});

// Marketer scene handlers
marketerScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
marketerScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Marketer"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Marketer."
  );
});

// Raider scene handlers
raiderScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
raiderScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Raider"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Raider."
  );
});

// Blockchain Engineer scene handlers
blockchainEngineerScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
blockchainEngineerScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Blockchain Engineer"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Blockchain Engineer."
  );
});

// Software Tester scene handlers
softwareTesterScene.enter((ctx) => {
  ctx?.reply("Enter your price range (USD)");
});
softwareTesterScene.on("text", (ctx) => {
  ctx?.deleteMessage();
  const message = ctx.message.text;
  const userInfo = {
    id: ctx.from.id,
    price: parseInt(message),
    username: ctx.from.username || "Unknown",
  };
  data["Software Tester"].push(userInfo);
  fs.writeFileSync("data.json", stringify(data));
  ctx?.deleteMessage();

  // Reply to the user on successful application
  ctx.reply(
    "Thank you for your application! You have successfully applied as a Software Tester."
  );
});

// Initialize scene manager
const stage = new Scenes.Stage([
  startScene,
  tradeScreen,
  freelanceScene,
  softwareDeveloperScene,
  graphicDesignerScene,
  webDevScene,
  marketerScene,
  raiderScene,
  blockchainEngineerScene,
  softwareTesterScene,
]);
bot.use(session());
bot.use(stage.middleware());

// Command to start the conversation
bot.command("start", (ctx) => ctx.scene.enter("start"));

// Start the bot
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
