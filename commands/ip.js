const axios = require("axios");

module.exports = {
  name: 'ip',
  description: 'Check IP address',
  author: 'Developer',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    if (args.length === 0) {
      sendMessage(senderId, { text: 'Enter your IP address!!!' }, pageAccessToken);
      return;
    }

    try {
      const data = (await axios.get(`http://ipapi.co/${args.join(" ")}/json`)).data;

      if (!data.ip) {
        sendMessage(senderId, { text: 'This IP address could not be found!' }, pageAccessToken);
      } else {
        const message = `=====✅ IP Information ✅=====\n\n🌍 IP Address: ${data.ip}\n🔗 Network: ${data.network}\n🌐 IP Version: ${data.version}\n🏙 City: ${data.city}\n🏞 Region: ${data.region} (Code: ${data.region_code})\n🏛 Country: ${data.country_name} (${data.country})\n🌍 ISO Country Code: ${data.country_code_iso3}\n🏙 Capital: ${data.country_capital}\n🌐 Country TLD: ${data.country_tld}\n🌎 Continent Code: ${data.continent_code}\n🇪🇺 In EU: ${data.in_eu ? "Yes" : "No"}\n📮 Postal Code: ${data.postal}\n📍 Latitude: ${data.latitude}\n📍 Longitude: ${data.longitude}\n⏰ Timezone: ${data.timezone}\n🕒 UTC Offset: ${data.utc_offset}\n☎️ Calling Code: ${data.country_calling_code}\n💵 Currency: ${data.currency} (${data.currency_name})\n🗣 Languages: ${data.languages}\n🗺 Country Area: ${data.country_area} km²\n👥 Population: ${data.country_population}\n📡 ASN: ${data.asn}\n🏢 Organization: ${data.org}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Not found' }, pageAccessToken);
    }
  }
};
