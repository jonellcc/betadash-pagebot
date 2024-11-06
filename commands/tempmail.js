const { TempMail } = require("1secmail-api");

function generateRandomId() {
    var length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomId = '';

    for (var i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomId;
}

module.exports = {
  name: 'tempmail',
  description: 'Generate temporary email (auto get inbox)',
  author: 'Deku',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const reply = (msg) => sendMessage(senderId, { text: msg }, pageAccessToken);

    try {
        const mail = new TempMail(generateRandomId());

        mail.autoFetch();

        if (mail) reply("Your temporary email: " + mail.address + "\n\nNote: the tempmail code is automatically  if you use the email to create an account in Facebook");

        const fetch = () => {
            mail.getMail().then((mails) => {
                if (!mails[0]) {
                    return;
                } else {
                    let b = mails[0];
                    var msg = `You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
                    reply(msg + `\n\nOnce the email and message are received, they will be automatically deleted.`);
                    return mail.deleteMail();
                }
            });
        };

        fetch();
        setInterval(fetch, 3 * 1000);

    } catch (err) {
        console.log();
        return reply(err.message);
    }
  }
};

