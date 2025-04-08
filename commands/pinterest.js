const axios = require("axios");

module.exports = {
  name: 'pinterest',
  description: 'Fetch images from Pinterest',
  author: 'coffee',
  usage: 'pinterest <search term> | <number of images>',
  async execute(senderId, args, pageAccessToken, sendMessage, fetch) {
    if (!args || args.length < 1) {
      return await sendMessage(senderId, {
        text: '📷 | Please use this format:\npinterest search_name | number of images'
      }, pageAccessToken);
    }

    const input = args.join(" ");
    const [searchTerm, numImagesRaw] = input.split(" | ");
    let numImages = Math.max(1, parseInt(numImagesRaw) || 1);

    if (numImages > 13) {
      return await sendMessage(senderId, {
        text: 'The number of images cannot exceed 13. Only 13 image limit will be generated.'
      }, pageAccessToken);
    }

    const apiUrl = `https://betadash-uploader.vercel.app/pinterest?search=${encodeURIComponent(searchTerm)}&count=${numImages}`;

    try {
      const response = await axios.get(apiUrl);
      const images = response.data.data.slice(0, numImages);

      if (!images || images.length === 0) {
        return await sendMessage(senderId, {
          text: 'No images found for your search.'
        }, pageAccessToken);
      }

      if (images.length > 5) {
        const elements = images.slice(0, 13).map((url, i) => ({
          title: `Result ${i + 1}`,
          image_url: url,
          subtitle: searchTerm,
          buttons: [{
            type: "web_url",
            url: url,
            title: "View Image"
          }]
        }));

        return await sendMessage(senderId, {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements
            }
          }
        }, pageAccessToken);
      }

      for (const url of images) {
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      await sendMessage(senderId, {
        text: error.message || 'An error occurred while fetching images.'
      }, pageAccessToken);
    }
  },
};
