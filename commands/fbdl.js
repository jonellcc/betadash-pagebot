module.exports = {
  name: 'fbdl',
  description: 'Fbdownloader',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Enter a valid Facebook link reels' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: 'Downloading please wait...' }, pageAccessToken);
     const apiUrl = `https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(query)}`;

      if (apiUrl) {
  sendMessage(senderId, {
     attachment: {
          type: 'video',
          payload: {
            url: apiUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "File url is large video i can't download it"}, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
