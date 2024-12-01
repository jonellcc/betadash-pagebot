const axios = require('axios');

module.exports = {
  name: 'horny',
  description: 'Random video',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const links = [
      "https://i.imgur.com/uA4sNw7.mp4",
      "https://i.imgur.com/0azRXWN.mp4",
      "https://i.imgur.com/2YO1UIV.mp4",
      "https://i.imgur.com/ht6pqg3.mp4",
      "https://i.imgur.com/2EDrkgt.mp4",
      "https://i.imgur.com/pFB6VnE.mp4",
      "https://i.imgur.com/jruTcFx.mp4",
      "https://i.imgur.com/vDHfKxh.mp4",
      "https://i.imgur.com/bwihQeY.mp4",
      "https://i.imgur.com/JMuALc1.mp4",
      "https://i.imgur.com/8lIZa5G.mp4",
      "https://i.imgur.com/LR9ooyJ.mp4",
      "https://i.imgur.com/Viv4X8C.mp4",
      "https://i.imgur.com/cspl74z.mp4",
      "https://i.imgur.com/SzPPdqW.mp4",
      "https://i.imgur.com/QZRP8Sn.mp4",
      "https://i.imgur.com/pCbdZYY.mp4",
      "https://i.imgur.com/j6CrJxW.mp4",
      "https://i.imgur.com/uthREbe.mp4",
      "https://i.imgur.com/v4mLGte.mp4",
      "https://i.imgur.com/DJylTiy.mp4",
      "https://i.imgur.com/ee8fHna.mp4",
      "https://i.imgur.com/VffzOwS.mp4",
      "https://i.imgur.com/ci5nztg.mp4",
      "https://i.imgur.com/qHPeKDV.mp4",
      "https://i.imgur.com/Rkl5UmH.mp4",
      "https://i.imgur.com/IGXINCB.mp4",
      "https://i.imgur.com/qxPR4i6.mp4",
      "https://i.imgur.com/9LDVC57.mp4",
      "https://i.imgur.com/r7IxgiR.mp4",
      "https://i.imgur.com/J1jWubu.mp4",
      "https://i.imgur.com/JnmXyO3.mp4",
      "https://i.imgur.com/Qudb0Vl.mp4",
      "https://i.imgur.com/N3wIadu.mp4",
      "https://i.imgur.com/X7lugs3.mp4",
      "https://i.imgur.com/6b61HGs.mp4",
      "https://i.imgur.com/EPzjIbt.mp4",
      "https://i.imgur.com/WWGiRvB.mp4",
      "https://i.imgur.com/20QmmsT.mp4",
      "https://i.imgur.com/nN28Eea.mp4",
      "https://i.imgur.com/fknQ3Ut.mp4",
      "https://i.imgur.com/yXZJ4A9.mp4",
      "https://i.imgur.com/GnF9Fdw.mp4",
      "https://i.imgur.com/B86BX8.mp4",
      "https://i.imgur.com/kZCBjkz.mp4",
      "https://i.imgur.com/id5Rv7O.mp4",
      "https://i.imgur.com/aWIyVpN.mp4",
      "https://i.imgur.com/aFIwl8X.mp4",
      "https://i.imgur.com/SJ60dUB.mp4",
      "https://i.imgur.com/ySu69zS.mp4",
      "https://i.imgur.com/mAmwCe6.mp4",
      "https://i.imgur.com/Sbztqx2.mp4",
      "https://i.imgur.com/s2d0BIK.mp4",
      "https://i.imgur.com/rWRfAAZ.mp4",
      "https://i.imgur.com/dYLBspd.mp4",
      "https://i.imgur.com/HCv8Pfs.mp4",
      "https://i.imgur.com/jdVLoxo.mp4",
      "https://i.imgur.com/hX3Znez.mp4",
      "https://i.imgur.com/cispiyh.mp4",
      "https://i.imgur.com/ApOSepp.mp4",
      "https://i.imgur.com/lFoNnZZ.mp4",
      "https://i.imgur.com/qDsEv1Q.mp4",
      "https://i.imgur.com/NjWUgW8.mp4",
      "https://i.imgur.com/ViP4uvu.mp4",
      "https://i.imgur.com/bim2U8C.mp4",
      "https://i.imgur.com/YzlGSlm.mp4",
      "https://i.imgur.com/HZpxU7h.mp4",
      "https://i.imgur.com/exTO3J4.mp4",
      "https://i.imgur.com/Xf6HVcA.mp4",
      "https://i.imgur.com/9iOci5S.mp4",
      "https://i.imgur.com/6w5tnvs.mp4",
      "https://i.imgur.com/1L0DMtl.mp4",
      "https://i.imgur.com/7wcQ8eW.mp4",
      "https://i.imgur.com/3MBTpM8.mp4",
      "https://i.imgur.com/8h1Vgum.mp4",
      "https://i.imgur.com/CTcsUZk.mp4",
      "https://i.imgur.com/e505Ko2.mp4",
      "https://i.imgur.com/3umJ6NL.mp4"
    ];

    try {
      const randomIndex = Math.floor(Math.random() * links.length);
      const videoUrl = links[randomIndex];

      sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true
          }
        },
        quick_replies: [
          {
            content_type: "text",
            title: "shoti",
            payload: "SHOTI"
          },
          {
            content_type: "text",
            title: "Help",
            payload: "HELP"
          },
          {
            content_type: "text",
            title: "Privacy Policy",
            payload: "PRIVACY POLICY"
          },
          {
            content_type: "text",
            title: "Feedback",
            payload: "FEEDBACK"
          }
        ]
      }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
