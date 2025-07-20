const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'privacy',
  description: 'Rules for using the page bot',
  usage: 'privacy',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${pageAccessToken}`);
      const name = response.data.name;
      const pageid = response.data.id;
const profileUrl = `https://graph.facebook.com/${pageid}/picture?height=720&width=720`;

      const termsAndConditions = `𝗧𝗘𝗥𝗠𝗦 𝗢𝗙 𝗦𝗘𝗥𝗩𝗜𝗖𝗘 & 𝗣𝗥𝗜𝗩𝗔𝗖𝗬 𝗣𝗢𝗟𝗜𝗖𝗬

By using this bot, you agree to:
1. 𝗜𝗻𝘁𝗲𝗿𝗮𝗰𝘁𝗶𝗼𝗻: Automated responses may log interactions to improve service.
2. 𝗗𝗮𝘁𝗮: We collect data to enhance functionality without sharing it.
3. 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆: Your data is protected.
4. 𝗖𝗼𝗺𝗽𝗹𝗶𝗮𝗻𝗰𝗲: Follow Facebook's terms or risk access restrictions.
5. 𝗨𝗽𝗱𝗮𝘁𝗲𝘀: Terms may change, and continued use implies acceptance.

Failure to comply may result in access restrictions.`;

      const kupal = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: termsAndConditions,
            buttons: [
              {
                type: "web_url",
                url: `https://betadash-pagebot-production.up.railway.app/privacy?pageid=${pageid}`,
                title: "PRIVACY POLICY"
              }
            ]
          }
        }
      };
      sendMessage(senderId, kupal, pageAccessToken);

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Privacy Policy for ${name}Bot effective October 26, 2024. Learn about how ${name}Bot handles your data, including data processing, third-party services, and user rights.">
    <meta name="keywords" content="${name}Bot, privacy policy, data privacy, user rights, third-party services, data protection">
    <meta name="author" content="Chatbot Community Team">
    <meta name="robots" content="index, follow">
    <title>Privacy Policy - ${name}Bot</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/dist/sweetalert2.min.css"> 
      <style>
    body { font-family: 'Outfit', sans-serif; }
    .fade-in { animation: fadeIn 1s cubic-bezier(0.4,0,0.2,1) both; }
    @keyframes fadeIn { 0% { opacity: 0; transform: translateY(48px);} 100% { opacity: 1; transform: none;}}
    .sidebar-open { transform: translateX(0);}
    .sidebar-closed { transform: translateX(-100%);}
    .sidebar-transition { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);}
    .backdrop { background: rgba(30,41,59,0.43);}
    .animate-spin-slow { animation: spin 7s linear infinite;}
    @keyframes spin {100% { transform: rotate(360deg);}}
    ::selection { background: #64748b; color: #f1f5f9;}
    html { scroll-behavior: smooth;}
    ::-webkit-scrollbar { width: 8px; background: #23272e;}
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 6px;}
    .modal-animate-in { animation: modalIn 0.22s cubic-bezier(0.4,0,0.2,1) both; }
    .modal-animate-out { animation: modalOut 0.18s cubic-bezier(0.4,0,0.2,1) both; }
    @keyframes modalIn { 0% { opacity:0; transform: translate(-50%, -60%) scale(0.98);} 100% { opacity:1; transform: translate(-50%, -50%); } }
    @keyframes modalOut { 0% { opacity:1; transform: translate(-50%, -50%);} 100% { opacity:0; transform: translate(-50%, -60%) scale(0.98);} }

    .btn-animated {
        transition: transform 0.13s cubic-bezier(0.4,0,0.2,1), background 0.13s, box-shadow 0.13s;
    }
    .btn-animated:active {
        transform: scale(0.97);
    }
    .btn-animated:hover {
        box-shadow: 0 2px 16px 0 #2563eb33;
        background: #2563eb;
    }
    .spinner {
        border: 4px solid #64748b;
        border-top: 4px solid #60a5fa;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        animation: spin 1s linear infinite;
        margin: auto;
    }
    .swal2-popup {
        font-family: 'Outfit', sans-serif !important;
    }
    .tutorial-content a {
        display: inline-block;
        word-break: break-all;
        overflow-wrap: anywhere;
        vertical-align: baseline;
        padding-bottom: 2px;
    }
    .tutorial-content code {
        background: #222b3a;
        color: #7dd3fc;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 90%;
        font-family: 'Outfit', monospace;
    }
    .tutorial-content ul {
        margin-bottom: 1.3em;
    }
    .tutorial-content li {
        margin-bottom: 0.4em;
    }
    @media (min-width: 768px) {
        #sidebar { width: 16rem; }
    }
    @keyframes animatedBgGradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    .animated-gradient-text {
        background: linear-gradient(90deg, #38bdf8, #6366f1, #0ea5e9, #f472b6, #38bdf8);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        animation: animatedBgGradient 2.6s ease-in-out infinite, slidefade 1s cubic-bezier(0.4,0,0.2,1) both;
        display: inline-block;
    }
    @keyframes slidefade {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
            filter: blur(2px);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }
</style>
<head>
          <div class="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950/90 shadow-2xl rounded-3xl p-4 sm:p-10 border border-blue-900">
            <div class="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
              <div class="absolute top-10 left-[-50px] w-40 h-40 bg-blue-800 opacity-40 rounded-full blur-2xl animate-pulse"></div>
              <div class="absolute bottom-[10%] right-[-40px] w-28 h-28 bg-cyan-900 opacity-30 rounded-full blur-2xl animate-pulse"></div>
              <div class="absolute top-[82%] left-[70%] w-16 h-16 bg-blue-900 opacity-20 rounded-full blur animate-pulse"></div>
            </div>
            <div class="flex flex-col items-center sm:flex-row sm:items-center gap-4 mb-7">
              <img src="https://graph.facebook.com/${pageid}/picture?height=720&width=720" alt="Page" class="w-14 h-14 mb-3 rounded-full shadow" />
              <div class="text-center sm:text-left">
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-100 tracking-tight leading-tight fade-in animated-gradient-text"
                    style="animation-delay:0.15s">Privacy Policy</h1>
                <div class="text-xs sm:text-sm text-slate-300 font-medium mt-1 fade-in"
                     style="animation-delay:0.22s">
                  Effective Date: <span class="font-semibold">October 26, 2024</span>
                </div>
              </div>
            </div>
            <div class="mb-7 text-base text-slate-200 fade-in" style="animation-delay:0.3s">
              <strong>Please review this privacy policy thoroughly.</strong>
              Your privacy is very important to us, and we are dedicated to safeguarding the information you share when using Kaiz-AutoPagebot. This policy outlines how we manage your data.
            </div>
            <div class="space-y-8">
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">1</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Introduction</h2>
                </div>
                <p class="ml-1 text-slate-300">At ${name}-AutoPagebot, we respect your privacy and handle your personal information responsibly. This Privacy Policy explains how we collect, use, and protect your data. By using ${name} AI, you agree to the terms set forth in this policy.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">2</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">No Data Logging or Storage</h2>
                </div>
                <p class="ml-1 text-slate-300">We do not collect, log, or store any messages or personal data. All interactions with ${name}-AutoPagebot are processed in real-time and discarded immediately after processing. No history of messages or user profiles is retained.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">3</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Third-Party Services</h2>
                </div>
                <p class="ml-1 text-slate-300">${name}-AutoPagebot uses trusted third-party services for specific functions such as text processing and image generation. These third-party providers include:</p>
                <ul class="list-disc pl-8 mb-2 text-slate-300">
                  <li>
                    <strong>OpenAI</strong> for text processing and image generation
                    (<a href="https://openai.com/policies/privacy-policy" target="_blank"
                      class="text-blue-400 underline hover:text-blue-300 transition-colors duration-150">Privacy Policy</a>).
                  </li>
                </ul>
                <p class="ml-1 text-slate-300">These services process your data temporarily to complete your requests and do not store any information beyond what is necessary for task completion.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">4</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Data Usage</h2>
                </div>
                <p class="ml-1 text-slate-300">Your data is solely used to process requests sent to ${name}-AutoPagebot. We do not utilize your data for marketing, analytics, or any purposes beyond the immediate task.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">5</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Security Measures</h2>
                </div>
                <p class="ml-1 text-slate-300">Although ${name}-AutoPagebot does not retain any data, we ensure that the third-party services we utilize implement stringent security measures, including encryption, to protect your data during transmission.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">6</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">User Rights</h2>
                </div>
                <p class="ml-1 text-slate-300">Since we do not store personal data, traditional data rights such as access or deletion requests do not apply. However, if you have concerns regarding data processing, feel free to contact us for further details on third-party services used.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">7</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Children's Privacy</h2>
                </div>
                <p class="ml-1 text-slate-300">${name}-AutoPagebot is not intended for children under 13, and we do not knowingly collect personal information from children. If you believe your child has used Kaiz AI and shared information, please reach out, and we will ensure their data is protected.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">8</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Data Retention</h2>
                </div>
                <p class="ml-1 text-slate-300">${name}-AutoPagebot does not store any data. All interactions are processed and discarded immediately, with no logs, histories, or user profiles retained.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">9</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Cookies and Tracking</h2>
                </div>
                <p class="ml-1 text-slate-300">${name}-AutoPagebot does not use cookies or tracking mechanisms. We do not track user behavior or usage patterns. However, third-party services like OpenAI may have their own cookie policies, which you should review on their websites.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">10</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Changes to This Privacy Policy</h2>
                </div>
                <p class="ml-1 text-slate-300">This Privacy Policy may be updated periodically to reflect changes in our practices or for legal or regulatory reasons. Significant changes will be communicated accordingly, and the "Effective Date" at the top of this page will be updated.</p>
              </section>
              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 bg-blue-900 text-blue-100 rounded-full font-bold flex items-center justify-center text-base">11</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-blue-100">Contact Information</h2>
                </div>
                <p class="ml-1 text-slate-300">If you have questions, concerns, or feedback regarding this privacy policy or ${name}-AutoPagebot's data practices, please contact us.</p>
              </section>
            </div>
          </div>
</body>
<html>`;

const filePath = path.join(`${__dirname}/../privacy/${pageid}.html`);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, html);
    } catch (error) {
      console.error('Error executing privacy command:', error);
    }
  }
};
