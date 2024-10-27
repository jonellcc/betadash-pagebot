module.exports = {
  name: 'flux',
  description: 'Generate images via prompt',
  usage: 'flux <prompt>',
  author: 'Cliff', // api by neth
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
       sendMessage(senderId, { text: "֎ | Generating Please Wait...."}, pageAccessToken);
      const apiUrl = `https://echavie3.nethprojects.workers.dev/flux?q=${encodeURIComponent(prompt)}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};