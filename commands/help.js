const fs = require('fs');
const path = require('path');

const randomQuotes = [
  "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
    "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
    "The world's oldest known recipe is for beer.",
    "Bananas are berries, but strawberries are not.",
    "Cows have best friends and can become stressed when they are separated.",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
    "The average person walks the equivalent of three times around the world in a lifetime.",
    "Polar bears are left-handed.",
    "The unicorn is Scotland's national animal.",
    "A group of flamingos is called a 'flamboyance'.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "The smell of freshly-cut grass is actually a plant distress call.",
    "A day on Venus is longer than its year.",
    "Honeybees can recognize human faces.",
    "Wombat poop is cube-shaped.",
    "The first oranges weren't orange.",
    "The longest time between two twins being born is 87 days.",
    "A bolt of lightning is six times hotter than the sun.",
    "A baby puffin is called a puffling.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
    "There's a species of jellyfish that is biologically immortal.",
    "The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
    "The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
    "A hummingbird weighs less than a penny.",
    "Koalas have fingerprints that are nearly identical to humans'.",
    "There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
    "A group of owls is called a parliament.",
    "The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
    "The Hawaiian alphabet has only 13 letters.",
    "The average person spends six months of their life waiting for red lights to turn green.",
    "A newborn kangaroo is about 1 inch long.",
    "The oldest known living tree is over 5,000 years old.",
    "Coca-Cola would be green if coloring wasn't added to it.",
    "A day on Mars is about 24.6 hours long.",
    "The Great Wall of China is not visible from space without aid.",
    "A group of crows is called a murder.",
    "There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
    "The world's largest desert is Antarctica, not the Sahara.",
    "A blue whale's heart is so big that a human could swim through its arteries.",
    "The longest word in the English language without a vowel is 'rhythms'.",
    "Polar bears' fur is not white; it's actually transparent.",
    "The electric chair was invented by a dentist.",
    "An ostrich's eye is bigger than its brain.",
    "Wombat poop is cube-shaped.",
"Even a small amount of alcohol poured on a scorpion will drive it crazy and sting itself to death.",
" The crocodile can't stick its tongue out.","The oldest known animal in the world is a 405-year-old male, discovered in 2007.","Sharks, like other fish, have their reproductive organs located in the ribcage.","The eyes of the octopus have no blind spots. On average, the brain of an octopus has 300 million neurons. When under extreme stress, some octopuses even eat their trunks.","An elephant's brain weighs about 6,000g, while a cat's brain weighs only approximately 30g.","Cats and dogs have the ability to hear ultrasound.","Sheep can survive up to 2 weeks in a state of being buried in snow.","The smartest pig in the world is owned by a math teacher in Madison, Wisconsin (USA). It has the ability to memorize worksheets multiplying to 12.","Statistics show that each rattlesnake's mating lasts up to ... more than 22 hours", "Studies have found that flies are deaf.","In a lack of water, kangaroos can endure longer than camels.","","Dogs have 4 toes on their hind legs and 5 toes on each of their front paws.","The average flight speed of honey bees is 24km/h. They never sleep.","Cockroaches can live up to 9 days after having their heads cut off.","If you leave a goldfish in the dark for a long time, it will eventually turn white.","The flying record for a chicken is 13 seconds.","The mosquito that causes the most deaths to humans worldwide is the mosquito.","TThe quack of a duck doesn't resonate, and no one knows why.","Sea pond has no brain. They are also among the few animals that can turn their stomachs inside out.","Termites are active 24 hours a day and they do not sleep. Studies have also found that termites gnaw wood twice as fast when listening to heavy rock music.","Baby giraffes usually fall from a height of 1.8 meters when they are born.", "A tiger not only has a striped coat, but their skin is also streaked with stripes.."," Vultures fly without flapping their wings.","Turkeys can reproduce without mating.","Penguins are the only birds that can swim, but not fly. Nor have any penguins been found in the Arctic."," The venom of the king cobra is so toxic that just one gram can kill 150 people.","The venom of a small scorpion is much more dangerous than the venom of a large scorpion.","The length of an oyster's penis can be so 'monstrous' that it is 20 times its body size!","Rat's heart beats 650 times per minute.","The flea can jump 350 times its body length. If it also possessed that ability, a human would be able to jump the length of a football field once.","The faster the kangaroo jumps, the less energy it consumes.","Elephants are among the few mammals that can't jump! It was also discovered that elephants still stand after death.","Spiders have transparent blood."," Snails breathe with their feet.","Some lions mate more than 50 times a day.","Chuột reproduce so quickly that in just 18 months, from just 2 mice, the mother can give birth to 1 million heirs.","Hedgehog floats on water.","Alex is the world's first African gray parrot to question its own existence: What color am I?.","The reason why flamingos are pink-red in color is because they can absorb pigments from the shells of shrimp and shrimp that they eat every day."," Owls and pigeons can memorize human faces", "Cows are more dangerous than sharks","The single pair of wings on the back and the rear stabilizer help the flies to fly continuously, but their lifespan is not more than 14 days.","With a pair of endlessly long legs that can be up to 1.5 m high and weigh 20-25 kg, the ostrich can run faster than a horse. In addition, male ostriches can roar like a lion.","Kangaroos use their tails for balance, so if you lift a Kangaroo's tail off the ground, it won't be able to jump and stand.","Tigers not only have stripes on their backs but also printed on their skin. Each individual tiger is born with its own unique stripe.","If you are being attacked by a crocodile, do not try to get rid of their sharp teeth by pushing them away. Just poke the crocodile in the eye, that's their weakness.","Fleas can jump up to 200 times their height. This is equivalent to a man jumping on the Empire State Building in New York.","A cat has up to 32 muscles in the ear. That makes them have superior hearing ability","Koalas have a taste that does not change throughout life, they eat almost nothing but .. leaves of the eucalyptus tree.","The beaver's teeth do not stop growing throughout its life. If you do not want the teeth to be too long and difficult to control, the beaver must eat hard foods to wear them down.","Animals living in coastal cliffs or estuaries have extremely weird abilities. Oysters can change sex to match the mating method.","Butterflies have eyes with thousands of lenses similar to those on cameras, but they can only see red, green, and yellow..","Don't try this at home, the truth is that if a snail loses an eye, it can recover.","Giraffes do not have vocal cords like other animals of the same family, their tongues are blue-black.","Dog nose prints are like human fingerprints and can be used to identify different dogs."
];

 const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

function formatFont(text) {
  const fontMapping = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺",
    n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split('').map(char => fontMapping[char] || char).join('');
}

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

module.exports = {
  name: 'help',
  description: 'Show available commands or details of a specific command',
  author: 'Cliff',
  execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, message, event, getAttachments) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    const totalCommands = commandFiles.length;
    const commandsPerPage = 20;

    if (args.length > 0 && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const name = command.name ? `➟ Name: ${command.name}\n` : "";
        const author = command.author ? `➟ Author: ${command.author}\n` : "";
        const description = command.description ? `➟ description: ${command.description}\n` : "";
        const commandDetails = `${name}${author}${description}`;

        return sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `❌ Command not found: ${formatFont(commandName)}` }, pageAccessToken);
      }
    }

    const pageNumber = args[0] && !isNaN(args[0]) ? parseInt(args[0]) : 1;
    const paginatedCommands = paginate(commandFiles, commandsPerPage, pageNumber);

    if (paginatedCommands.length === 0) {
      return sendMessage(senderId, { text: `❌ No commands found for page ${pageNumber}` }, pageAccessToken);
    }

    const commandsList = paginatedCommands.map(file => {
      const command = require(path.join(commandsDir, file));
      return `│ ✧ ${command.name}`;
    });

    const helpMessage = `🛠️ ${formatFont("Available Commands")}\n\n╭─❍「 ${formatFont("NO PREFIX")} 」\n${commandsList.join('\n')}\n╰───────────◊\n\n» 𝗣𝗮𝗴𝗲: <${pageNumber}/${Math.ceil(totalCommands / commandsPerPage)}>\n» 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: [ ${totalCommands} ]\n» 𝗥𝗔𝗡𝗗𝗢𝗠 𝗙𝗔𝗖𝗧: ${randomQuote}`;

    sendMessage(senderId, {text: helpMessage}, pageAccessToken);
  }
};