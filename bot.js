const fetch = require('node-fetch');

// Telegram Bot API endpoint (Replace with your actual bot token)
const BASE_URL = "https://api.telegram.org/bot6954064524:AAHHNIOHMi3AFRTZBriOIRUBei8kdgJYQ7E/";

// Global object to store user data
const userData = {};

// Function to send a message using the Telegram Bot API
async function sendMessage(chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text: text,
    reply_markup: replyMarkup,
  };
  const response = await fetch(BASE_URL + 'sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

// Handler for incoming messages
// Handler for incoming messages
async function handleMessage(update) {
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text ? message.text.toLowerCase() : '';
  
    if (text === '/start') {
      // Send a welcome message and options
      const options = {
        keyboard: [['Initialize a trade', 'Apply as a web3 freelancer']],
        resize_keyboard: true,
        one_time_keyboard: true,
      };
      await sendMessage(chatId, 'Hey! Welcome. What do you want to do today?', JSON.stringify(options));
    } else if (text === 'initialize a trade') {
      // Send the available roles for web3 freelancers
      const roles = ['Software Developer', 'Graphic Designer', 'Web Developer', 'Marketer', 'Raider', 'Blockchain Engineer', 'Software Tester'];
      const formattedRoles = roles.map(role => [role]);
      const options = {
        keyboard: formattedRoles,
        resize_keyboard: true,
        one_time_keyboard: true,
      };
      await sendMessage(chatId, 'Available roles for web3 freelancers:', JSON.stringify(options));
    } else if (['software developer', 'graphic designer', 'web developer', 'marketer', 'raider', 'blockchain engineer', 'software tester'].includes(text)) {
      // Record the selected role and prompt for starting prices
      userData[chatId] = userData[chatId] || { role: '', startingPrice: '' }; // Check if userData[chatId] exists, if not, create it
      userData[chatId].role = text;
      await sendChargePrompt(chatId, text);
    } else if (text === 'apply as a web3 freelancer') {
      const options = {
        keyboard: [['Software Developer', 'Graphic Designer'], ['Web Developer', 'Marketer'], ['Raider', 'Blockchain Engineer'], ['Software Tester']],
        resize_keyboard: true,
        one_time_keyboard: true,
      };
      await sendMessage(chatId, 'Select your role:', JSON.stringify(options));
    } else if (text === 'register as freelancer') {
      await sendMessage(chatId, 'Select your role:', JSON.stringify({ remove_keyboard: true }));
      // Add logic to handle user's role selection
      userData[chatId] = userData[chatId] || { role: '', startingPrice: '' }; // Check if userData[chatId] exists, if not, create it
      await sendRoleOptions(chatId);
    } else if (text === 'done') {
      if (userData[chatId] && userData[chatId].role && userData[chatId].startingPrice) {
        // Finalize the process
        const { role, startingPrice } = userData[chatId];
        await sendMessage(chatId, `You have selected the role: ${role} and your starting price is: ${startingPrice}. Thank you for providing the information!`);
        delete userData[chatId]; // Clean up user data
      } else {
        await sendMessage(chatId, 'You have not selected a role or provided a starting price yet.');
      }
    } else {
      // Assuming any other input is the starting price, record it
      if (userData[chatId] && userData[chatId].role) {
        userData[chatId].startingPrice = text;
        await sendMessage(chatId, `Your starting price (${text}) has been recorded.`);
      } else {
        await sendMessage(chatId, 'Please select a role first before providing your starting price.');
      }
    }
  }
  
  
// Function to send role options
async function sendRoleOptions(chatId) {
  const options = {
    keyboard: [['Software Developer', 'Graphic Designer'], ['Web Developer', 'Marketer'], ['Raider', 'Blockchain Engineer'], ['Software Tester'], ['Done']],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  await sendMessage(chatId, 'Select your role:', JSON.stringify(options));
}

// Function to prompt for charge input
async function sendChargePrompt(chatId, role) {
  await sendMessage(chatId, `Enter the amount you would charge for ${role}:`);
}

// Main function to handle updates
async function main() {
  let offset = null;
  while (true) {
    const response = await fetch(BASE_URL + 'getUpdates?offset=' + (offset ? offset : ''));
    const updates = (await response.json()).result;
    for (const update of updates) {
      await handleMessage(update);
      offset = update.update_id + 1;
    }
  }
}

if (require.main === module) {
  main();
}
