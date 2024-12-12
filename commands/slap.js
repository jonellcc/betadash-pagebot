

module.exports = {
  name: "slap",
  description: "Generate a canvas slap fighting",
  usage: "slapv2 one two",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use slapv2 <uid1> <uid2>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/slapv2?one=${one}&two=${two}`;

      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: apiUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: "Error can`t generate canvas" }, pageAccessToken);
    }
  }
};
