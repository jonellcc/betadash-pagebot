const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config.json");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
const instagramLinkRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
const youtubeLinkRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const spotifyLinkRegex = /^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+$/;
const soundcloudRegex = /^https?:\/\/soundcloud\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/([a-zA-Z0-9-]+))?(?:\?.*)?$/;
const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/[A-Za-z0-9]+/;
const redditVideoRegex = /https:\/\/www\.reddit\.com\/r\/[A-Za-z0-9_]+\/comments\/[A-Za-z0-9]+\/[A-Za-z0-9_]+\/?/;
const snapchatRegex = /https?:\/\/(www\.)?snapchat\.com\/spotlight\/[A-Za-z0-9_-]+/i;

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/commands/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'commands', `${filename}`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }

      const htmlResponse = `
        <html>
        <head>
          <title>Hastebin</title>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.gstatic.com">
          <link href="https://fonts.googleapis.com/css2?family=Material+Icons&family=Fira+Code&family=Roboto:wght@400;500&display=swap" rel="stylesheet">

          <!-- SEO -->
          <link rel="canonical" href="https://hastebin.skyra.pw">
          <meta name="url" content="https://hastebin.skyra.pw">
          <meta name="identifier-URL" content="https://hastebin.skyra.pw">
          <meta name="shortlink" content="https://hastebin.skyra.pw">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="keywords" content="haste, bin, skyra, hastebin, paste, pastebin">
          <meta name="subject" content="Hastebin for developers, by developers.">
          <meta name="robots" content="archive,follow,imageindex,index,odp,snippet,translate">
          <meta name="googlebot" content="index,follow">
          <meta name="author" content="Skyra Project, contact@skyra.pw">
          <meta name="owner" content="Skyra Project, contact@skyra.pw">
          <meta name="designer" content="Skyra Project, contact@skyra.pw">
          <meta name="reply-to" content="contact@skyra.pw">
          <meta name="target" content="all">
          <meta name="audience" content="all">
          <meta name="coverage" content="Worldwide">
          <meta name="distribution" content="Global">
          <meta name="rating" content="safe for kids">
          <meta name="apple-mobile-web-app-capable" content="yes">
          <meta name="apple-mobile-web-app-status-bar-style" content="black">
          <meta name="HandheldFriendly" content="True">
          <meta name="apple-mobile-web-app-title" content="Hastebin">
          <meta name="application-name" content="Hastebin">
          <meta name="msapplication-TileColor" content="#282C34">
          <meta name="msapplication-TileImage" content="https://paste.code-solutions.dev/seo/mstile-144x144.png">
          <meta name="msapplication-config" content="https://paste.code-solutions.dev/seo/browserconfig.xml">
          <meta name="revisit-after" content="7 days">
          <meta property="og:email" content="contact@skyra.pw">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta http-equiv="Expires" content="1y">
          <meta http-equiv="Pragma" content="1y">
          <meta http-equiv="Cache-Control" content="1y">
          <meta http-equiv="Page-Enter" content="RevealTrans(Duration=2.0,Transition=2)">
          <meta http-equiv="Page-Exit" content="RevealTrans(Duration=3.0,Transition=12)">
          <link rel="apple-touch-icon" sizes="180x180" href="https://paste.code-solutions.dev/seo/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="192x192" href="https://paste.code-solutions.dev/seo/android-chrome-192x192.png">
          <link rel="icon" type="image/png" sizes="32x32" href="https://paste.code-solutions.dev/seo/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="https://paste.code-solutions.dev/seo/favicon-16x16.png">
          <link rel="manifest" href="https://paste.code-solutions.dev/seo/site.webmanifest">
          <link rel="shortcut icon" href="https://paste.code-solutions.dev/seo/favicon.ico">
          <link rel="apple-touch-startup-image" href="https://paste.code-solutions.dev/seo/apple-startup.png">
          <meta name="theme-color" content="#282C34">
          <link rel="mask-icon" href="https://paste.code-solutions.dev/seo/safari-pinned-tab.svg" color="#1e88e5">
          <script type="module" crossorigin="" src="https://paste.code-solutions.dev/assets/index.js"></script>

          <style>
            [data-pnotify].material-elem,[data-pnotify].material-elem.pnotify-mode-light {
              --notice-background-color: #fff59d;
              --notice-text-color: #000;
              --info-background-color: #9dfff5;
              --info-text-color: #000;
              --success-background-color: #a7ff9d;
              --success-text-color: #000;
              --error-background-color: #ffc49d;
              --error-text-color: #000;
              --primary-button-text-color: #3f51b5;
              --primary-button-text-focus-color: #303f9f;
              --input-focus-underline-color: #3f51b5;
              border-radius: 0;
              font-size: 14px
            }

            @media (prefers-color-scheme: dark) {
              [data-pnotify].material-elem.pnotify-mode-no-preference {
                --notice-background-color:#ff8f00;
                --notice-text-color: #fff;
                --info-background-color: #006eff;
                --info-text-color: #fff;
                --success-background-color: #00c000;
                --success-text-color: #fff;
                --error-background-color: #f10;
                --error-text-color: #fff;
                --primary-button-text-color: #e1f5fe;
                --primary-button-text-focus-color: #e0f7fa;
                --input-focus-underline-color: #e1f5fe
              }
            }

            [data-pnotify].material-elem.pnotify-mode-dark {
              --notice-background-color: #ff8f00;
              --notice-text-color: #fff;
              --info-background-color: #006eff;
              --info-text-color: #fff;
              --success-background-color: #00c000;
              --success-text-color: #fff;
              --error-background-color: #f10;
              --error-text-color: #fff;
              --primary-button-text-color: #e1f5fe;
              --primary-button-text-focus-color: #e0f7fa;
              --input-focus-underline-color: #e1f5fe
            }

            [data-pnotify] .material-notice {
              --material-background-color: var(--notice-background-color);
              --material-text-color: var(--notice-text-color)
            }

            [data-pnotify] .material-info {
              --material-background-color: var(--info-background-color);
              --material-text-color: var(--info-text-color)
            }

            [data-pnotify] .material-success {
              --material-background-color: var(--success-background-color);
              --material-text-color: var(--success-text-color)
            }

            [data-pnotify] .material-error {
              --material-background-color: var(--error-background-color);
              --material-text-color: var(--error-text-color)
            }

            [data-pnotify].material-elem.pnotify-shadow {
              box-shadow: 0 6px 24px #0003
            }

            [data-pnotify] .material-container {
              padding: 24px;
              background-color: var(--material-background-color);
              border: none;
              color: var(--material-text-color)
            }

            [data-pnotify] .material-title {
              font-family: Roboto,sans-serif;
              font-weight: 500;
              font-size: 20px;
              letter-spacing: .15px;
              margin-bottom: 20px;
              line-height: 24px
            }

            [data-pnotify] .material-title:last-child {
              margin-bottom: 0
            }

            [data-pnotify] .material-text {
              font-family: Roboto,sans-serif;
              font-weight: 400;
              font-size: 16px;
              letter-spacing: .5px;
              line-height: 24px
            }

            [data-pnotify].pnotify-with-icon .material-content {
              margin-left: 32px
            }

            [dir=rtl] [data-pnotify].pnotify-with-icon .material-content {
              margin-right: 32px;
              margin-left: 0
            }

            [data-pnotify] .material-closer,[data-pnotify] .material-icon,[data-pnotify] .material-icon-closer:after,[data-pnotify] .material-icon-sticker:after,[data-pnotify] .material-icon>span:after,[data-pnotify] .material-sticker {
              font-family: Material Icons;
              height: 20px;
              width: 20px;
              font-size: 20px;
              line-height: 24px;
              position: relative
            }

            [data-pnotify] .material-action-bar {
              margin-top: 20px;
              margin-right: -16px;
              margin-bottom: -16px
            }

            [dir=rtl] [data-pnotify] .material-action-bar {
              margin-left: -16px;
              margin-right: 0
            }

            [data-pnotify] .material-icon-notice:after {
              content: "priority_high"
            }

            [data-pnotify] .material-icon-info:after {
              content: "info"
            }

            [data-pnotify] .material-icon-success:after {
              content: "done"
            }

            [data-pnotify] .material-icon-error:after {
              content: "error"
            }

            [data-pnotify] .material-icon-closer:after {
              content: "close"
            }

            [data-pnotify] .material-icon-unstuck:after {
              content: "pause"
            }

            [data-pnotify] .material-icon-stuck:after {
              content: "play_arrow"
            }

            [data-pnotify] .material-input {
              display: block;
              width: 100%;
              margin-bottom: 8px;
              padding: 15px 0 8px;
              background-color: transparent;
              color: inherit;
              border-radius: 0;
              border-top: none;
              border-left: none;
              border-right: none;
              border-bottom-style: solid;
              border-bottom-color: inherit;
              border-bottom-width: 1px
            }

            [data-pnotify] .material-input:focus {
              outline: none;
              border-bottom-color: var(--input-focus-underline-color);
              border-bottom-width: 2px
            }

            [data-pnotify] .material-btn {
              position: relative;
              padding: 0 16px;
              overflow: hidden;
              border-width: 0;
              outline: none;
              border-radius: 2px;
              background-color: transparent;
              color: inherit;
              transition: background-color .3s;
              font-family: Roboto,sans-serif;
              font-weight: 500;
              font-size: 14px;
              letter-spacing: 1.25px;
              text-transform: uppercase;
              height: 36px;
              margin: 6px;
              min-width: 64px
            }

            [data-pnotify] .material-btn.material-btn-primary {
              color: var(--primary-button-text-color)
            }

            [data-pnotify] .material-btn:focus,[data-pnotify] .material-btn:hover {
              background-color: #0000001f;
              color: inherit
            }

            [data-pnotify] .material-btn.material-btn-primary:focus,[data-pnotify] .material-btn.material-btn-primary:hover {
              color: var(--primary-button-text-focus-color)
            }

            [data-pnotify] .material-btn:before {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              display: block;
              width: 0;
              padding-top: 0;
              border-radius: 100%;
              background-color: #9996;
              transform: translate(-50%,-50%)
            }

            [data-pnotify] .material-btn:active:before {
              width: 120%;
              padding-top: 120%;
              transition: width .2s ease-out,padding-top .2s ease-out
            }

            [data-pnotify] .material-countdown {
              background-color: var(--material-background-color)
            }

            [data-pnotify] .material-countdown-bar {
              background-color: var(--material-text-color)
            }

            [data-pnotify] .material-paginate {
              display: inline-flex;
              flex-direction: column
            }

            [data-pnotify] .material-paginate-buttons {
              margin-right: 6px
            }

            [data-pnotify] .material-paginate-btn {
              margin: 0 0 0 6px;
              border: 0;
              padding: 0
            }

            [data-pnotify] .material-paginate-btn,[data-pnotify] .material-paginate-btn:after {
              display: inline-block;
              font-family: Material Icons;
              height: 20px;
              width: 20px;
              font-size: 20px;
              line-height: 24px;
              position: relative
            }

            [data-pnotify] .material-paginate-btn:disabled:after,[data-pnotify] .material-paginate-btn[aria-disabled=true]:after {
              opacity: .5
            }

            [data-pnotify] .material-paginate-previous:after {
              content: "arrow_back"
            }

            [data-pnotify] .material-paginate-next:after {
              content: "arrow_forward"
            }

            [data-pnotify] .material-paginate-count {
              font-family: Roboto,sans-serif;
              font-weight: 400;
              font-size: 14px;
              letter-spacing: .25px
            }

            body>.pnotify.pnotify-positioned {
              position: fixed;
              z-index: 100040
            }

            body>.pnotify.pnotify-modal {
              z-index: 100042
            }

            .pnotify {
              height: auto;
              display: none;
              transition: opacity .1s linear;
              opacity: 0
            }

            .pnotify.pnotify-positioned {
              position: absolute;
              z-index: 1
            }

            .pnotify.pnotify-modal {
              z-index: 3
            }

            .pnotify.pnotify-in {
              display: block;
              opacity: 1
            }

            .pnotify.pnotify-initial {
              display: block
            }

            .pnotify-hidden {
              visibility: hidden
            }

            .pnotify.pnotify-move {
              transition: left .4s ease,top .4s ease,right .4s ease,bottom .4s ease
            }

            .pnotify.pnotify-fade-slow {
              transition: opacity .4s linear;
              opacity: 0
            }

            .pnotify.pnotify-fade-slow.pnotify.pnotify-move {
              transition: opacity .4s linear,left .4s ease,top .4s ease,right .4s ease,bottom .4s ease
            }

            .pnotify.pnotify-fade-normal {
              transition: opacity .25s linear;
              opacity: 0
            }

            .pnotify.pnotify-fade-normal.pnotify.pnotify-move {
              transition: opacity .25s linear,left .4s ease,top .4s ease,right .4s ease,bottom .4s ease
            }

            .pnotify.pnotify-fade-fast {
              transition: opacity .1s linear;
              opacity: 0
            }

            .pnotify.pnotify-fade-fast.pnotify.pnotify-move {
              transition: opacity .1s linear,left .4s ease,top .4s ease,right .4s ease,bottom .4s ease
            }

            .pnotify.pnotify-masking {
              display: block;
              -webkit-mask-image: linear-gradient(180deg,rgba(0,0,0,.8),transparent 30px,transparent);
              mask-image: linear-gradient(180deg,rgba(0,0,0,.8),transparent 30px,transparent)
            }

            .pnotify.pnotify-masking.pnotify-stack-up {
              -webkit-mask-image: linear-gradient(0deg,rgba(0,0,0,.8),transparent 30px,transparent);
              mask-image: linear-gradient(0deg,rgba(0,0,0,.8),transparent 30px,transparent)
            }

            .pnotify.pnotify-masking.pnotify-stack-left {
              -webkit-mask-image: linear-gradient(270deg,rgba(0,0,0,.8),transparent 30px,transparent);
              mask-image: linear-gradient(270deg,rgba(0,0,0,.8),transparent 30px,transparent)
            }

            .pnotify.pnotify-masking.pnotify-stack-right {
              -webkit-mask-image: linear-gradient(90deg,rgba(0,0,0,.8),transparent 30px,transparent);
              mask-image: linear-gradient(90deg,rgba(0,0,0,.8),transparent 30px,transparent)
            }

            .pnotify.pnotify-fade-in,.pnotify.pnotify-masking-in {
              opacity: 1
            }

            .pnotify .pnotify-shadow {
              box-shadow: 0 6px 28px #0000001a
            }

            .pnotify-container {
              position: relative;
              background-position: 0 0;
              padding: .8em;
              height: 100%;
              margin: 0
            }

            .pnotify-container:after {
              content: " ";
              visibility: hidden;
              display: block;
              height: 0;
              clear: both
            }

            .pnotify-closer,.pnotify-sticker {
              float: right;
              margin-left: .5em;
              cursor: pointer
            }

            [dir=rtl] .pnotify-closer,[dir=rtl] .pnotify-sticker {
              float: left;
              margin-right: .5em;
              margin-left: 0
            }

            .pnotify-title {
              display: block;
              white-space: pre-line;
              margin-bottom: .4em;
              margin-top: 0
            }

            .pnotify-text-with-max-height {
              overflow-y: auto;
              overscroll-behavior: contain;
              padding-bottom: .03em
            }

            .pnotify.pnotify-with-icon .pnotify-content {
              margin-left: 24px
            }

            [dir=rtl] .pnotify.pnotify-with-icon .pnotify-content {
              margin-right: 24px;
              margin-left: 0
            }

            .pnotify-pre-line {
              white-space: pre-line
            }

            .pnotify-icon,.pnotify-icon span {
              display: block;
              float: left
            }

            [dir=rtl] .pnotify-icon,[dir=rtl] .pnotify-icon span {
              float: right
            }

            .pnotify-modal-overlay {
              background-color: #0009;
              top: 0;
              left: 0;
              position: absolute;
              height: 100%;
              width: 100%;
              z-index: 2;
              transition: opacity .25s linear;
              opacity: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-end
            }

            .pnotify-modal-overlay-up {
              align-items: flex-start
            }

            .pnotify-modal-overlay-left {
              justify-content: flex-start;
              align-items: center
            }

            .pnotify-modal-overlay-right {
              justify-content: flex-end;
              align-items: center
            }

            .pnotify-modal-overlay.pnotify-modal-overlay-in {
              opacity: 1
            }

            .pnotify-modal-overlay-closes:after {
              content: "×";
              font-family: Arial;
              font-size: 3rem;
              color: #fff;
              text-shadow: 0 0 .4rem #fff
            }

            body>.pnotify-modal-overlay {
              position: fixed;
              z-index: 100041
            }

            pre code.hljs {
              display: block;
              overflow-x: auto;
              padding: 1em
            }

            code.hljs {
              padding: 3px 5px
            }

            .hljs {
              color: #abb2bf;
              background: #282c34
            }

            .hljs-keyword,.hljs-operator,.hljs-pattern-match {
              color: #f92672
            }

            .hljs-pattern-match .hljs-constructor,.hljs-function {
              color: #61aeee
            }

            .hljs-function .hljs-params {
              color: #a6e22e
            }

            .hljs-function .hljs-params .hljs-typing {
              color: #fd971f
            }

            .hljs-module-access .hljs-module {
              color: #7e57c2
            }

            .hljs-constructor {
              color: #e2b93d
            }

            .hljs-constructor .hljs-string {
              color: #9ccc65
            }

            .hljs-comment,.hljs-quote {
              color: #b18eb1;
              font-style: italic
            }

            .hljs-doctag,.hljs-formula {
              color: #c678dd
            }

            .hljs-section,.hljs-name,.hljs-selector-tag,.hljs-deletion,.hljs-subst {
              color: #e06c75
            }

            .hljs-literal {
              color: #56b6c2
            }

            .hljs-string,.hljs-regexp,.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string {
              color: #98c379
            }

            .hljs-built_in,.hljs-title.class_,.hljs-class .hljs-title {
              color: #e6c07b
            }

            .hljs-attr,.hljs-variable,.hljs-template-variable,.hljs-type,.hljs-selector-class,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-number {
              color: #d19a66
            }

            .hljs-symbol,.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-title {
              color: #61aeee
            }

            .hljs-emphasis {
              font-style: italic
            }

            .hljs-strong {
              font-weight: 700
            }

            .hljs-link {
              text-decoration: underline
            }

            :root {
              --fonts: "Fira Code", Consolas, Andale Mono WT, Andale Mono, Lucida Console, Lucida Sans Typewriter, DejaVu Sans Mono, Bitstream Vera Sans Mono, Liberation Mono, Nimbus Mono L, Monaco, Courier New, Courier, monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
              --dark-black: #141512
            }

            body {
              background: #282c34;
              padding: 20px 50px;
              margin: 0
            }

            textarea {
              background: transparent;
              border: 0px;
              color: #fff;
              padding: 0;
              width: 100%;
              height: 100%;
              font-family: var(--fonts);
              outline: none;
              resize: none;
              font-size: 13px;
              margin-top: 0;
              margin-bottom: 0
            }

            #linenos {
              color: #7d7d7d;
              position: absolute;
              top: 20px;
              left: 0;
              width: 30px;
              font-size: 15px;
              font-family: var(--fonts);
              text-align: right;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none
            }

            #box {
              padding: 0;
              margin: 0;
              width: 100%;
              border: 0px;
              outline: none;
              font-size: 13px;
              overflow: inherit
            }

            #box code,pre {
              padding: 0;
              background: transparent!important;
              font-size: 15px;
              font-family: var(--fonts)
            }

            #key {
              position: fixed;
              top: 0;
              right: 0;
              z-index: 1000;
              width: 200px;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none
            }

            #box1 {
              padding: 5px;
              text-align: center;
              background: var(--dark-black)
            }

            #box2 {
              background: var(--dark-black);
              font-size: 0px;
              padding: 0 5px;
              display: flex;
              align-items: center;
              align-content: center;
              justify-content: center
            }

            #box1 a.logo,#box1 a.logo:visited {
              display: inline-block;
              background: url(/logo.png);
              width: 126px;
              height: 42px
            }

            #box1 a.logo:hover {
              background-position: 0 bottom
            }

            #box2 .function {
              background: url(/function-icons.png);
              width: 32px;
              height: 37px;
              display: inline-block;
              position: relative
            }

            #box2 .link embed {
              vertical-align: bottom
            }

            #box2 .function.enabled:hover {
              cursor: hand;
              cursor: pointer
            }

            #box3 {
              background: var(--dark-black);
              font-family: Helvetica,sans-serif;
              font-size: 12px;
              line-height: 14px;
              padding: 10px 15px;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none
            }

            #box3 .label {
              color: #fff;
              font-weight: 700
            }

            #box3 .shortcut {
              color: #c4dce3;
              font-weight: 400
            }

            #box2 .function.save {
              background-position: -5px top
            }

            #box2 .function.enabled.save {
              background-position: -5px center
            }

            #box2 .function.enabled.save:hover {
              background-position: -5px bottom
            }

            #box2 .function.new {
              background-position: -42px top
            }

            #box2 .function.enabled.new {
              background-position: -42px center
            }

            #box2 .function.enabled.new:hover {
              background-position: -42px bottom
            }

            #box2 .function.duplicate {
              background-position: -79px top
            }

            #box2 .function.enabled.duplicate {
              background-position: -79px center
            }

            #box2 .function.enabled.duplicate:hover {
              background-position: -79px bottom
            }

            #box2 .function.raw {
              background-position: -116px top
            }

            #box2 .function.enabled.raw {
              background-position: -116px center
            }

            #box2 .function.enabled.raw:hover {
              background-position: -116px bottom
            }

            #box2 .button-picture {
              border-width: 0;
              font-size: inherit
            }
          </style>
        </head>
<body>
          <div id="linenos">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28<br>29<br>30<br>31<br>32<br>33<br>34<br>35<br>36<br>37<br>38<br>39<br>40<br>41<br>42<br>43<br>44<br>45<br>46<br>47<br>48<br>49<br>50<br>51<br>52<br>53<br>54<br>55<br>56<br>57<br>58<br>59<br>60<br>61<br>62<br>63<br>64<br>65<br>66<br>67<br>68<br>69<br>70<br>71<br>72<br>73<br>74<br>75<br>76<br>77<br>78<br>79<br>80<br>81<br>82<br>83<br>84<br>85<br>86<br>87<br>88<br>89<br>90<br>91<br>92<br>93<br>94<br>95<br>96<br>97<br>98<br>99<br>100<br>101<br>102<br>103<br>104<br>105<br>106<br>107<br>108<br>109<br>110<br>111<br>112<br>113<br>114<br>115<br>116<br>117<br>118<br>119<br>120<br>121<br>122<br>123<br>124<br>125<br>126<br>127<br>128<br>129<br>130<br>131<br>132<br>133<br>134<br>135<br>136<br>137<br>138<br>139<br></div>
          <pre id="box" style="" class="hljs" tabindex="0"><code>${data}</code></pre>
        </body>
        </html>`;
      res.send(htmlResponse);
    });
  });
});

const PORT = process.env.PORT || 8080;

/** const VERIFY_TOKEN = config.VERIFY_TOKEN;
const admin = config.ADMINS;
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN; **/ const commandList = [];
const descriptions = [];
const commands = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
});

/** 

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page' && Array.isArray(body.entry)) {
    body.entry.forEach(entry => {
      if (!Array.isArray(entry.messaging)) return;

      entry.messaging.forEach(event => {
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.sender.id) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
       } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        } else if (event, PAGE_ACCESS_TOKEN) {
          handlePayload(event, PAGE_ACCESS_TOKEN);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
}); **/


const PAGE_ACCESS_TOKEN = config.main.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = config.main.VERIFY_TOKEN;
const ADMINS = config.main.ADMINS;

let sessions = config.sessions || [];

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});


app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page' && Array.isArray(body.entry)) {
    body.entry.forEach(entry => {
      if (!Array.isArray(entry.messaging)) return;

      // Hanapin lahat ng sessions na may parehong pageid
      const sessionTokens = sessions
        .filter(s => s.pageid === entry.id)
        .map(s => s.PAGE_ACCESS_TOKEN);

      // Isama ang main PAGE_ACCESS_TOKEN para gumana rin ito
      if (!sessionTokens.includes(PAGE_ACCESS_TOKEN)) {
        sessionTokens.push(PAGE_ACCESS_TOKEN);
      }

      entry.messaging.forEach(event => {
        sessionTokens.forEach(token => {
          if (event.message) {
            handleMessage(event, token);
          } else if (event.postback) {
            handlePostback(event, token);
          } else if (event.sender.id) {
            handleMessage(event, token);
          }
        });
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});



app.get('/create', async (req, res) => {
  try {
  const { pageAccessToken, adminid } = req.query;

  if (!pageAccessToken || !adminid) {
    return res.status(400).json({ error: `Missing parameters is required 'pageAccessToken','adminid`, Usage: "/create?pageAccessToken=EAAUGH....&adminid=1080...." });
  }

      if (!pageAccessToken.startsWith("EAA")) {
      return res.status(400).json({ error: 'Invalid page access token format' });
    }

    const response = await axios.get(`https://graph.facebook.com/me?access_token=${pageAccessToken}`);
    const { name, id } = response.data;
    const existingSession = sessions.find(session => session.pageid === id);
    if (existingSession) {
      return res.status(409).json({ error: 'Session already exists for this pageid' });
    }

      const newSession = {
        name: name,
        PAGE_ACCESS_TOKEN: pageAccessToken,
        pageid: id,
        adminid: adminid
      };

      sessions.push(newSession);
      saveConfig();
      res.status(200).json({ message: 'Session added successfully', session: newSession });
    } catch (error) {
      res.status(500).json({ error: 'Invalid page access token or unable to fetch page details' });
   }
  });

app.get('/delete', (req, res) => {
  const { username, password, pageid } = req.query;

  if (username !== 'yazky' || password !== 'autopagebotvz') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  if (!pageid) {
    return res.status(400).json({ error: 'Missing required parameter: pageid' });
  }

  const initialLength = sessions.length;
  sessions = sessions.filter(session => session.pageid !== pageid);

  if (sessions.length === initialLength) {
    return res.status(404).json({ error: 'Page ID not found' });
  }

  saveConfig();
  res.status(200).json({ message: 'Session deleted successfully', pageid });
});


  function saveConfig() {
  const updatedConfig = { main: { PAGE_ACCESS_TOKEN, VERIFY_TOKEN, ADMINS }, sessions };
  fs.writeFileSync('./config.json', JSON.stringify(updatedConfig, null, 2));
  }

app.get('/sessions', (req, res) => {
  const maskedMain = {
    Name: config.main.Name,
    PAGE_ACCESS_TOKEN: config.main.PAGE_ACCESS_TOKEN
      ? config.main.PAGE_ACCESS_TOKEN.substring(0, 4) + "****************************************************************************************************************************************************************"
      : "****************************************************************************************************************************************************************",
    /** VERIFY_TOKEN: config.main.VERIFY_TOKEN, **/
    Pageid: config.main.PAGEID,
    ADMINS: config.main.ADMINS
  };

  const maskedSessions = sessions.map(session => ({
    Name: session.name,
    PAGE_ACCESS_TOKEN: session.PAGE_ACCESS_TOKEN
      ? session.PAGE_ACCESS_TOKEN.substring(0, 4) + "****************************************************************************************************************************************************************"
      : "****************************************************************************************************************************************************************",
    Pageid: session.pageid,
    Adminid: session.adminid
  }));

  res.status(200).json({
    main: maskedMain,
    session: maskedSessions
  });
});


async function handlePayload(event, pageAccessToken) {
  const payload = event.postback.payload;
  const senderId = event.sender.id;
  if (payload === 'GET_STARTED_PAYLOAD') {
    await sendMessage(senderId, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: "Hello, I'm 𝗕𝗲𝗹𝘂𝗴𝗮! I'm your friendly AI assistant, here to help with any questions, tasks, or just about anything else you need. I'm constantly learning and improving, so please bear with me if ever I make any mistakes. I'm excited to work with you and make your day a little brighter. What's on your mind today?\n\nUse the 'Help' button to show a list of commands. 𝗕𝗲𝗹𝘂𝗴𝗮 is for educational and fun purposes, so now you can explore all the commands. Like/Follow for more.",
          buttons: [
            {
              type: 'web_url',
              url: "https://www.facebook.com/61567757543707",
              title: "𝖫𝗂𝗄𝖾/𝖥𝗈𝗅𝗅𝗈𝗐"
            },
            {
              type: 'postback',
              title: "Help",
              payload: "HELP_PAYLOAD"
            }
          ]
        }
      },
      quick_replies: [
        {
          content_type: "text",
          title: "Help",
          payload: "HELP"
        },
        {
          content_type: "text",
          title: "Privacy Policy",
          payload: "PRIVACY_POLICY"
        }
      ]
    }, pageAccessToken);
  }
}

async function initializeMessengerProfile() {
  const url = `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    get_started: { payload: "GET_STARTED_PAYLOAD" },
    greeting: [
      {
        locale: "default",
        text: "Hello, {{user_first_name}}! I'm 𝗕𝗲𝗹𝘂𝗴𝗮! Your friendly AI assistant, here to help with questions, tasks, and more."
      }
    ]
  };

  await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function processEvent(event) {
  if (event.postback && event.postback.payload) {
    await handlePayload(event.postback.payload);
  }
}

initializeMessengerProfile();


/** function handleLongTask(senderId) {
    typingIndicator(senderId, true);

    const maxTimeout = 30000;
    let isResponseSent = false;

    simulateApiCall()
        .then(response => {
            if (!isResponseSent) {
                isResponseSent = true;
                clearTimeout(timeout);
                typingIndicator(senderId, false);
            }
        })
        .catch(error => {
            if (!isResponseSent) {
                isResponseSent = true;
                clearTimeout(timeout);
                typingIndicator(senderId, false);
            }
        });

    const timeout = setTimeout(() => {
        if (!isResponseSent) {
            isResponseSent = true;
            typingIndicator(senderId, false);
        sendMessage(senderId, { text: 'The request took too long to process and has been timed out.'}, pageAccessToken);
        }
    }, maxTimeout);
}

function simulateApiCall() {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 35000);
        setTimeout(() => {
            if (delay < 30000) {
                resolve('Simulated API data');
            } else {
                reject('Simulated timeout error');
            }
        }, delay);
    });
} **/

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
}

async function sendMessage(senderId, message, pageAccessToken) {
    if (!message || (!message.text && !message.attachment)) {
        console.error();
        return;
    }    
    
    try {
        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'mark_seen'
        }, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'typing_on'
        }, {
            params: { access_token: pageAccessToken }
        });

        const messagePayload = {
            recipient: { id: senderId },
            messaging_type: "RESPONSE",
            message: {},
        };

        if (message.text) {
            messagePayload.message.text = message.text;
        }

        if (message.attachment) {
            messagePayload.message.attachment = message.attachment;
        }

        if (message.quick_replies) {
            messagePayload.message.quick_replies = message.quick_replies;
        }

        await axios.post('https://graph.facebook.com/v22.0/me/messages', messagePayload, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'typing_off'
        }, {
            params: { access_token: pageAccessToken }
        });
    } catch (error) {
        console.error();
    }
}



const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/; 
  return regex.test(url);
};

async function getImage(mid) {
  if (!mid) return;

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v22.0/${mid}/attachments`, {
      params: { access_token: `${PAGE_ACCESS_TOKEN}` }
    });

    if (data && data.data.length > 0) {
      const attachments = data.data.map((attachment) => {
  if (attachment.image_data && isValidUrl(attachment.image_data.url)) return attachment.image_data.url;
  if (attachment.video_data && isValidUrl(attachment.video_data.url)) return attachment.video_data.url;
  if (attachment.animated_image_data && isValidUrl(attachment.animated_image_data.url)) return attachment.animated_image_data.url;
  if (attachment.file_url && isValidUrl(attachment.file_url)) return attachment.file_url;
  return null;
});
      return attachments.filter(Boolean);
    }
  } catch (error) {    
  }
}

async function getAttachments(mid) {
    if (!mid) return;

    try {
      const { data } = await axios.get(`https://graph.facebook.com/v22.0/${mid}/attachments`, {
        params: { access_token: `${PAGE_ACCESS_TOKEN}` }
     });

      if (data && data.data.length > 0) {
        const attachment = data.data[0];

        if (attachment.image_data) return attachment.image_data.url;
        if (attachment.video_data) return attachment.video_data.url;
        if (attachment.animated_image_data) return attachment.animated_image_data.url;
   if (attachment.file_url) return attachment.file_url;    
      }
    } catch (error) {
    }
  }

  function formatFont(text) {
      const fontMapping = {
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛",
        I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣",
        Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫",
        Y: "𝗬", Z: "𝗭", a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳",
        g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻",
        o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃",
        w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
      };

      return text
        .split("")
        .map((char) => fontMapping[char] || char)
        .join("");
    }


const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
        const targetText = boldText || h2Text || h3Text;
        return [...targetText].map(char => fontMapping[char] || char).join('');
    });
}

const font = (text) => [...text].map(c => fontMapping[c] || c).join('');  

async function getMessage(mid) {
  return await new Promise(async (resolve, reject) => {
    if (!mid) resolve(null);
    await axios.get(`https://graph.facebook.com/v22.0/${mid}?fields=message&access_token=${PAGE_ACCESS_TOKEN}`).then(data => {
      resolve(data.data.message);
    }).catch(err => {
      reject(err);
    });
  });
}


async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.message || !event.sender.id)  {
    return;
  }
  
const image = event.message.attachments &&
  (event.message.attachments[0]?.type === 'image');
const video = event.message.attachments &&
           (event.message.attachments[0]?.type === 'video');
const gif = event.message.attachments &&
           (event.message.attachments[0]?.type === 'gif');

const events = event;
   const senderId = event.sender.id;
  const messageText = event.message.text;
const haha = "More shoti";
const messageId = event.message.mid;
const If = "aidetect";
const j = "humanize";
const x = "👍";

if (event.policy_enforcement) {
        const reason = event.policy_enforcement.reason || "Unknown reason";
        const action = event.policy_enforcement.action || "Unknown action";

        if (admin.length > 0) {
            const nya = `🚨 𝖯𝗈𝗅𝗂𝖼𝗒 𝖤𝗇𝖿𝗈𝗋𝖼𝖾𝗆𝖾𝗇𝗍 𝖠𝗅𝖾𝗋𝗍 🚨\n\nAction: ${action}\nReason: ${reason}\n\nPlease check the bot settings!`;
            await sendMessage(senderId, { text: nya }, pageAccessToken);
        }
    }

 if (event.reaction) {
        let pageId = event.recipient.id;
        let err = event.reaction.reaction;
        let ere = event.reaction.emoji;
        let arc = event.reaction.action;
        let erm = event.reaction.mid;
        let mj = '';
        mj = await getMessage(erm);
        const reactionMessage = `User ${senderId} reacted with ${ere} (${err}) to message:\n\n${mj || "Attachment"}.`;
        await sendMessage(senderId, { text: reactionMessage }, pageAccessToken);
    }

if (event.response_feedback) {
        const feedback = event.response_feedback.feedback;
        const messageID = event.response_feedback.mid;
        const id = event.sender.id;

        let con = "Unknown message";
        if (messageID) {
            con = await getMessage(messageID).catch(() => "Failed to fetch message");
        }

        const messageTex = feedback === 'Good response'
            ? `User ${id} gave positive feedback for message\n\n"${con || "attachment"}"`
            : `User ${id} gave negative feedback for message\n\n"${con || "attachment"}"`;

        await sendMessage(senderId, { text: messageTex }, pageAccessToken);
        await sendMessage(senderId, { text: "𝖳𝗁𝖺𝗇𝗄𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄! 😊" }, pageAccessToken);
    }

let content = "";

if (event.message && event.message.reply_to) {
content = await getMessage(event.message.reply_to.mid);
}
const combinedContent = content ? `${messageText} ${content}` : messageText;

let imageUrl = '';

if (event.message && event.message.attachments) {
    imageUrl = event.message.attachments[0].payload.url || null;
  }

  if (event.message && event.message.reply_to && event.message.reply_to.mid) {
    try {
      imageUrl = await getAttachments(event.message.reply_to.mid);
    } catch (error) {
      imageUrl = ''; 
    }
  }

let yawa1 = '';
let yawa2 = '';

if (event.message && event.message.attachments) {
  if (event.message.attachments[0]) {
    yawa1 = event.message.attachments[0].payload.url;
  }
  if (event.message.attachments[1]) {
    yawa2 = event.message.attachments[1].payload.url;
  }
}

if (event.message && event.message.reply_to && event.message.reply_to.mid) {
  try {
    const attachmentUrls = await getImage(event.message.reply_to.mid);
    if (attachmentUrls.length > 0) yawa1 = attachmentUrls[0];
    if (attachmentUrls.length > 1) yawa2 = attachmentUrls[1];
  } catch (error) {
  }
}

  const args = messageText ? messageText.split(' ') : [];

const bannedKeywords = [
  'pussy', 'dick', 'nude', 'xnxx', 'pornhub', 'hot', 'clothes', 'sugar', 'fucked', 'step',
  'shit', 'bitch', 'hentai', 'sex', 'boobs', 'cute girl undressed', 'undressed', 
  'naked', 'underwear', 'sexy', 'panty', 'fuckers', 'fck', 'fucking', 'vagina', 'intercourse', 
  'penis', 'gae', 'panties', 'fellatio', 'blow job', 'blow', 'skin', 'segs', 'porn', 'loli', 'kantutan','lulu', 'kayat', 'bilat',
  'ahegao', 'dildo', 'vibrator', 'asses', 'butt', 'asshole', 'cleavage', 'arse', 'dic', 'puss'
];

function escapeRegex(keyword) {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const containsBannedKeyword = bannedKeywords.some(keyword => {
  const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
  return pattern.test(commands + args);
});

if (containsBannedKeyword) {
  await sendMessage(
    senderId,
    { text: '🚫 𝖸𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖡𝖺𝖽𝗐𝗈𝗋𝖽𝗌 𝗂𝗍 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝗌 𝗂𝗇𝖺𝗉𝗉𝗋𝗈𝗉𝗋𝗂𝖺𝗍𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗉𝗋𝗈𝗆𝗉𝗍',
    quick_replies: [
    {
      content_type: "text",
      title: "Feedback",
      payload: "FEEDBACK"
    },
    {
      content_type: "text",
      title: "Privacy Policy",
      payload: "PRIVACY_POLICY"
    }
   ]
  },
   pageAccessToken
  );
  return;
}

if (messageText && messageText.startsWith("imgur")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply to an image to upload in imgur" }, pageAccessToken);
      return;
    }     
        const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const h = {
            text: `Here is the Imgur link for the image you provided:\n\n${imgurLink}`
        };
        sendMessage(senderId, h, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.startsWith("removebg")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Remove background image" }, pageAccessToken);
      return;
    }     
        const bg = `https://ccprojectapis.ddns.net/api/removebg?url=${encodeURIComponent(imageUrl)}`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.startsWith("recognize")) {
    try {
   if (!imageUrl) {
      sendMessage(senderId, { text: "Reply to a short audio or video" }, pageAccessToken);
      return;
    }     

   const res = await axios.get(`https://yt-video-production.up.railway.app/recognize?fileUrl=${encodeURIComponent(imageUrl)}`
    );

    const metadata = res.data.track.sections.find(section => section.type === "SONG").metadata;
    const album = metadata.find(item => item.title === "Album")?.text || "Unknown Album";
    const label = metadata.find(item => item.title === "Label")?.text || "Unknown Label";
    const released = metadata.find(item => item.title === "Released")?.text || "Unknown Year"; 
    const text = res.data.track.share.subject;
    const images = res.data.track.sections[0].metapages.map((page) => page.image);
    const audioUrl = res.data.track.hub.actions[1].uri;
    const info = `𝗧𝗶𝘁𝗹𝗲: ${res.data.track.title}\n𝗔𝗿𝘁𝗶𝘀𝘁: ${res.data.track.subtitle}\n𝗔𝗹𝗯𝘂𝗺: ${album}\n𝗟𝗮𝗯𝗲𝗹: ${label}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱: ${released}`;
    sendMessage(senderId, {text: info}, pageAccessToken);
    await sendMessage(senderId, { attachment: { type: 'audio', payload: { url: audioUrl } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.startsWith("faceswap")) {
  try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply with two image to combine face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl1 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(yawa1)}`;
    const imgurResponse1 = await axios.get(imgurApiUrl1, { headers });
    const imgurLink1 = imgurResponse1.data.uploaded.image;

    const imgurApiUrl2 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(yawa2)}`;
    const imgurResponse2 = await axios.get(imgurApiUrl2, { headers });
    const imgurLink2 = imgurResponse2.data.uploaded.image;

    const bg = `https://kaiz-apis.gleeze.com/api/faceswap?swapUrl=${encodeURIComponent(imgurLink1)}&baseUrl=${encodeURIComponent(imgurLink2)}`;
    await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg } } }, pageAccessToken);
  } catch (error) {
    sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.includes("Get started")) {
  try {
    const kumag = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "𝖧𝖾𝗅𝗅𝗈, 𝖨'𝗆 𝖡𝖤𝖫𝖴𝖦𝖠! 𝖸𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽𝗅𝗒 𝖠𝖨 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍, 𝗁𝖾𝗋𝖾 𝗍𝗈 𝗁𝖾𝗅𝗉 𝗐𝗂𝗍𝗁 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌, 𝗍𝖺𝗌𝗄𝗌, 𝖺𝗇𝖽 𝗆𝗈𝗋𝖾. 𝖨'𝗆 𝖼𝗈𝗇𝗌𝗍𝖺𝗇𝗍𝗅𝗒 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀 𝖺𝗇𝖽 𝗂𝗆𝗉𝗋𝗈𝗏𝗂𝗇𝗀, 𝗌𝗈 𝗉𝗅𝖾𝖺𝗌𝖾 𝖻𝖾𝖺𝗋 𝗐𝗂𝗍𝗁 𝗆𝖾 𝗂𝖿 𝖾𝗏𝖾𝗋 𝖨 𝗆𝖺𝗄𝖾 𝖺𝗇𝗒 𝗆𝗂𝗌𝗍𝖺𝗄𝖾𝗌. 𝖨'𝗆 𝖾𝗑𝖼𝗂𝗍𝖾𝖽 𝗍𝗈 𝗐𝗈𝗋𝗄 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎 𝖺𝗇𝖽 𝗆𝖺𝗄𝖾 𝗒𝗈𝗎𝗋 𝖽𝖺𝗒 𝖺 𝗅𝗂𝗍𝗍𝗅𝖾 𝖻𝗋𝗂𝗀𝗁𝗍𝖾𝗋.\n\n𝖳𝗒𝗉𝖾 '𝗁𝖾𝗅𝗉' 𝖻𝖾𝗅𝗈𝗐 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌",
      buttons: [
        {
          type: "web_url",
          url: "https://www.facebook.com/profile.php?id=61567757543707",
          title: "𝖫𝖨𝖪𝖤/𝖥𝖮𝖫𝖫𝖮𝖶"
        }
      ]
    }
  },
  quick_replies: [
    {
      content_type: "text",
      title: "Help",
      payload: "HELP"
    },
    {
      content_type: "text",
      title: "Privacy Policy",
      payload: "PRIVACY_POLICY"
    },
     {
      content_type: "text",
      title: "Feedback",
      payload: "FEEDBACK"
    }
  ]
};
  await sendMessage(senderId, kumag, pageAccessToken);
 } catch (error) {
  sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.startsWith("remini")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Enhancing image" }, pageAccessToken);
      return;
    }     
        const rem = `https://xnilnew404.onrender.com/xnil/remini?imageUrl=${encodeURIComponent(imageUrl)}&method=enhance`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: rem } } }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.startsWith("upscale")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Enhancing image" }, pageAccessToken);
      return;
    }     
        const upsc = `https://yt-video-production.up.railway.app/upscale?imageUrl=${encodeURIComponent(imageUrl)}`;
const en = await axios.get(upsc);
     const ups = en.data.imageUrl;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: ups } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.startsWith("imgbb")) {
    try { 
       if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the imgbb url" }, pageAccessToken);
      return;
    }
       const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const rec = `https://betadash-api-swordslush.vercel.app/imgbb?url=${encodeURIComponent(imgurLink)}`;
     const ap = await axios.get(rec);
     const yawa = ap.data.imageUrl;
await sendMessage(senderId, { text: yawa}, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.startsWith("tinyurl")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the shorten url" }, pageAccessToken);
      return;
    }     
      const apiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.url;
await sendMessage(senderId, { text: dh }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.startsWith("ocr")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the text" }, pageAccessToken);
      return;
    }     
      const _odjs = `https://betadash-api-swordslush.vercel.app/ocr?url=${encodeURIComponent(imageUrl)}`;
const _pdh = await axios.get(_odjs);
const _0ch = _pdh.data.text;
await sendMessage(senderId, { text: _0ch }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


 if (messageText && messageText.startsWith("zombie")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to to generate canvas zombie face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
const yawa = `https://yt-video-production.up.railway.app/zombie?url=${imgurLink}`;
     await sendMessage(senderId, { 
attachment: { 
    type: 'image', 
    payload: { 
        url: yawa,
        is_reusable: true
      } 
     } 
    }, pageAccessToken);
    } catch (error) {
   }
    return;
  }

/** if (messageText && messageText.includes("gdrive")) {
    try {
        const rec = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`;
     const ap = await axios.get(rec);
     const ugh = ap.data;
      await sendMessage(senderId, { text: ugh }, pageAccessToken);
    } catch (error) {
     }
    return;
  } **/

if (messageText && messageText.startsWith("aidetect")) {
    try {
        if (!content) {
            sendMessage(senderId, { text: "Please reply by message" }, pageAccessToken);
            return;
        }

        let result = await axios.get(`https://betadash-api-swordslush.vercel.app/aidetect?text=${encodeURIComponent(content)}`);
        const { success, data } = result.data;

        if (!success) {
            sendMessage(senderId, { text: "Failed to process the request. Please try again later." }, pageAccessToken);
            return;
        }

        const {
            isHuman,
            additional_feedback,
            textWords,
            aiWords,
            fakePercentage,
            originalParagraph,
            feedback,
            detected_language
        } = data;

        const humanPercentage = (isHuman).toFixed(2);
        const aiPercentage = (100 - isHuman).toFixed(2);

        const certaintyMessage = feedback 
            ? `${feedback} (${humanPercentage}% human, ${aiPercentage}% AI)`
            : `The text is ${humanPercentage}% likely to be written by a human and ${aiPercentage}% likely to be written by an AI.`;

        const response = `${formatFont("Detection Result")}:
- ${formatFont("Detected Language")}: ${detected_language || "N/A"}
- ${formatFont("Human Probability")}: ${humanPercentage}%
- ${formatFont("AI Probability")}: ${aiPercentage}%
- ${formatFont("Text Words")}: ${textWords || 0}
- ${formatFont("AI Words")}: ${aiWords || 0}

${certaintyMessage}

${additional_feedback || ""}`;

        sendMessage(senderId, { text: response }, pageAccessToken);
    } catch (error) {
        sendMessage(senderId, {text: error.message }, pageAccessToken);
    }
    return;
}


if (messageText && messageText.startsWith("humanize")) {
    try {
        if (!content) {
            sendMessage(senderId, { text: "Please reply by a message first" }, pageAccessToken);
            return;
        }

        const result = await axios.get(`https://betadash-api-swordslush.vercel.app/humanize?text=${encodeURIComponent(content)}`)
            .then((res) => res.data)
            .catch((err) => {
                return null;
            });      

        const kupal = `${formatFont("HUMANIZED TEXT")}:\n━━━━━━━━━━━━━━\n${result.message}\n`;

        sendMessage(senderId, { text: kupal }, pageAccessToken);
    } catch (error) {
        sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
}

  const commandName = args.shift()?.toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      if (typeof args === 'object') {
            await command.execute(senderId, args, pageAccessToken, sendMessage, font);
        } else {
            await command.execute({ senderId, args, pageAccessToken, sendMessage, admin, events, splitMessageIntoChunks, font });
        }
    } catch (error) {
      const kupall = {
     text: "❌ 𝖳𝗁𝖾𝗋𝖾 𝗐𝖺𝗌 𝖺𝗇 𝖾𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖺𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽\n\n𝖳𝗒𝗉𝖾 '𝖧𝖾𝗅𝗉' 𝗍𝗈 𝗌𝖾𝖾 𝗆𝗈𝗋𝖾 𝗎𝗌𝖾𝖿𝗎𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌" || error.message || error.response?.data,
    quick_replies: [
         {
          content_type: "text",
         title: "Help",
         payload: "HELP"
        },
        {
          content_type: "text",
         title: "Feedback",
         payload: "FEEDBACK"
        }       
      ]
   };
    sendMessage(senderId, kupall, pageAccessToken);
    }
  } else if (!regEx_tiktok.test(messageText) && !facebookLinkRegex.test(messageText) && !instagramLinkRegex.test(messageText) && !youtubeLinkRegex.test(messageText) && !spotifyLinkRegex.test(messageText) && !soundcloudRegex.test(messageText) && !capcutLinkRegex.test(messageText)
&& !redditVideoRegex.test(messageText)
&& !snapchatRegex.test(messageText) && haha !== messageText && If !== messageText && j !== messageText && x !== messageText) {
   try {
  let text;
    if (imageUrl) {
const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}&&imageUrl=${imgurLink}`;
const s = [ "✦", "✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
        const response = await axios.get(apiUrl, { headers });
       const cg = convertToBold(response.data.response);
        text = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━━\n${cg}\n━━━━━━━━━━━━━━`;
      } else {
     const s = ["✦", "✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
        const api = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}`;
     const response = await axios.get(api);
      const anss = convertToBold(response.data.response);
        text = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━\n${anss}\n━━━━━━━━━━━━━`;
}


/** let text;
  if (imageUrl) {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}&file_url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  } else {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  } **/


  const maxMessageLength = 2000;
  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
} catch (error) {
  }
} else if (instagramLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Instagram, please wait...' }, pageAccessToken);
      const apiUrl = `https://yt-video-production.up.railway.app/insta?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.result[0].url;

const headResponse = await axios.head(videoUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Instagram video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: videoUrl,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }   
    } catch (error) {
    }
  } else if (facebookLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Facebook, please wait...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(messageText)}`;

const headResponse = await axios.head(apiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Facebook video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: apiUrl,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: apiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (regEx_tiktok.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Tiktok, please wait...' },  pageAccessToken);
      const response = await axios.post(`https://www.tikwm.com/api/`, { url: messageText }, { headers });
      const data = response.data.data;
      const shotiUrl = data.play;
      const avatar = data.author.avatar;
      const username = data.author.nickname;
      const unique_id = data.author.unique_id;

const headResponse = await axios.head(shotiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Tiktok video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: shotiUrl,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: shotiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (youtubeLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Youtube, please wait...' }, pageAccessToken);
      const yts = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(messageText)}`;
     const yu = await axios.get(yts, { headers });
      const vid = yu.data.video;
   const duration = `${yu.data.duration.seconds}\t${yu.data.duration.label}`;
      const thumbnail = yu.data.thumbnail;
      const title = yu.data.title;

 const kupal = `🎥 Now playing\n\n𝗧𝗶𝘁𝗹𝗲: ${title}`;
      sendMessage(senderId, { text: kupal }, pageAccessToken); 

/** sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: duration,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      ); **/

 const headResponse = await axios.head(vid, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The YouTube video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: vid,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: vid,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (spotifyLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Spotify, please wait...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/spotifydl?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const { track_name, cover_image, artist, album_artist, album, release_date } = response.data.metadata;

const audio = response.data.download.file_url;

  sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: track_name,
                  image_url: cover_image,
                  subtitle: `${album_artist} ${release_date}`,
                  default_action: {
                    type: "web_url",
                    url: cover_image,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      ); 


      if (audio) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: audio,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
} else if (soundcloudRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading SoundCloud, please wait...' }, pageAccessToken);
      const sc = `https://betadash-search-download.vercel.app/soundcloud?url=${encodeURIComponent(messageText)}`;

const response = await axios.get(sc, { headers });

const { download, thumbnail, quality, duration, title } = response.data;


      sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Quality: ${quality} - Duration: ${duration}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      );

      const headResponse = await axios.head(download, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The audio file exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: download,
                  title: 'Download URL'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: download,
              is_reusable: true
            }
          }
        }, pageAccessToken);
        }
      } catch (error) {
    }
} else if (capcutLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Capcut, please wait...' }, pageAccessToken);
      const capct = `https://kaiz-apis.gleeze.com/api/capcutdl?url=${encodeURIComponent(messageText)}`;
     const response = await axios.get(capct, { headers });
      const {title, url, thumbnail, size, quality} = response.data;

const headResponse = await axios.head(url, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

const kupal = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
sendMessage(senderId, { text: kupal }, pageAccessToken); 

    if (fileSize > 25 * 1024 * 1024) {
          sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Quality: ${quality} Size: ${size}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                 },
                 buttons: [
                {
                  type: "web_url",
                  url: url,
                  title: "Download Video"
                },
                {
                  type: "web_url",
                  url: thumbnail,
                  title: "Author Profile"
                }
              ]
            }
          ]
        }
      }
    }, pageAccessToken );
    } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: url,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (redditVideoRegex.test(messageText)) {
  try {
    sendMessage(senderId, { text: 'Downloading Reddit video, please wait...' }, pageAccessToken);

    const apiURL = `https://betadash-api-swordslush.vercel.app/reddit?url=${encodeURIComponent(messageText)}`;
    const response = await axios.get(apiURL, { headers });
    const { title, videoFormats, audioFormats, thumbnailUrl } = response.data;

    const headerMessage = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
    sendMessage(senderId, { text: headerMessage }, pageAccessToken);
    sendMessage(senderId, {
      attachment: {
        type: "image",
        payload: {
          url: thumbnailUrl,
          is_reusable: true
        }
      }
    }, pageAccessToken);

    const videoButtons = videoFormats.map((format) => ({
      type: "web_url",
      url: format.url,
      title: `Download Video (${format.quality})`
    }));

    if (audioFormats && audioFormats.length > 0) {
      const audioButton = {
        type: "web_url",
        url: audioFormats[0].url,
        title: `Download Audio (${audioFormats[0].label})`
      };
      videoButtons.push(audioButton);
    }

    const largestVideo = videoFormats[videoFormats.length - 1];
    const headResponse = await axios.head(largestVideo.url, { headers });
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    if (fileSize > 25 * 1024 * 1024) {
      sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: thumbnailUrl,
                subtitle: "Select a format to download:",
                buttons: videoButtons
              }
            ]
          }
        }
      }, pageAccessToken);
    } else {
      sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: videoFormats[0].url,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    }
  } catch (error) {
    sendMessage(senderId, { text: "An error occurred while processing the video. Please try again later." }, pageAccessToken);
  }
} else if (snapchatRegex.test(messageText)) {
  try {
    sendMessage(senderId, { text: 'Downloading Snapchat video, please wait...' }, pageAccessToken);

    const apiURL = `https://betadash-api-swordslush.vercel.app/snapchat?url=${encodeURIComponent(messageText)}`;
    const response = await axios.get(apiURL, { headers });
    const { title, author, mediaUrl, mediaPreviewUrl, thumbnailUrl } = response.data;

    const headerMessage = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
    sendMessage(senderId, { text: headerMessage }, pageAccessToken);

    const headResponse = await axios.head(mediaUrl, { headers });
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    if (fileSize > 25 * 1024 * 1024) {
      sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: thumbnailUrl,
                subtitle: `Author: ${author}`,
                buttons: [
                  {
                    type: "web_url",
                    url: mediaUrl,
                    title: "Download Video"
                  },
                  {
                    type: "web_url",
                    url: mediaPreviewUrl,
                    title: "Preview Video"
                  }
                ]
              }
            ]
          }
        }
      }, pageAccessToken);
    } else {
      sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: mediaUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    }
  } catch (error) {
    sendMessage(senderId, { text: "An error occurred while processing the video. Please try again later." }, pageAccessToken);
  }
}

if (messageText && messageText.includes("More shoti")) {
  const shotiCommand = commands.get('shoti');
  if (shotiCommand) {
    await shotiCommand.execute(senderId, [], pageAccessToken, sendMessage, pageAccessToken);
  }
  return;
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

 function loadCommands() {
  const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    const description = command.description || 'No description provided.';
    commandList.push(command.name);
    descriptions.push(description);
console.log(`Command loaded: ${command.name}`); 
  });
} 

async function updateMessengerCommands() {
  const commandsPayload = commandList.map((name, index) => ({
    name,
    description: descriptions[index]
  }));

  try {
    const dataCmd = await axios.get(`https://graph.facebook.com/v22.0/me/messenger_profile`, {
      params: { fields: 'commands', access_token: PAGE_ACCESS_TOKEN }
    });

    if (dataCmd.data.data[0]?.commands.length === commandsPayload.length) {
      console.log('Commands not changed');
      return;
    }

    const response = await axios.post(
  `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
  { 
    commands: [
      { 
        locale: 'default', 
        commands: commandsPayload 
      }
    ] 
  },
  { 
    headers: {
      'Content-Type': 'application/json' 
    }
  }
);

console.log(response.data.result === 'success' ? 'Commands loaded!' : 'Failed to load commands'); 
  } catch (error) {
  }
}


loadCommands();
updateMessengerCommands();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
