const axios = require("axios");

module.exports = {
    name: 'tempmailv2',
    description: 'Generate temporary email and check inbox',
    usage: 'tempmail gen || tempmail inbox <email>',
    author: 'cliff', // nethie api
    async execute(senderId, args, sendMessage, pageAccessToken) {
        const command = args[0];

        try {
            if (command === "gen") {
                const response = await axios.get(`https://nethwieginedev.vercel.app/api/tempmail2-create`);
                const email = response.data.address;

                sendMessage(senderId, { text: `Generated Temporary Email:\n\n${email}` }, pageAccessToken);
            } 
            else if (command === "inbox") {
                const email = args[1];

                if (!email) {
                    sendMessage(senderId, { text: "Please provide a valid email address for retrieving inbox messages." }, pageAccessToken);
                    return;
                }

                const inboxResponse = await axios.get(`https://nethwieginedev.vercel.app/api/tempmail2-get?email=${email}`);
                const inboxMessages = inboxResponse.data.messages;

                if (!inboxMessages || inboxMessages.length === 0) {
                    sendMessage(senderId, { text: `No messages found for ${email}.` }, pageAccessToken);
                    return;
                }

                const messages = inboxMessages.map(msg => 
                    `From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}\nMessage: ${msg.message}\n\n`
                ).join('');

                sendMessage(senderId, { text: `Inbox messages for ${email}:\n\n${messages}` }, pageAccessToken);
            } 
            else {
                // Invalid usage response
                sendMessage(senderId, { text: "Invalid usage. Use `tempmail gen` to generate an email or `tempmail inbox <email>` to check messages for a specific email." }, pageAccessToken);
            }
        } catch (error) {
            sendMessage(senderId, { text: "An error occurred. Please try again later." }, pageAccessToken);
        }
    }
};
