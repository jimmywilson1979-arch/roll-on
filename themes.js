// =====================================================================
// Roll On · Fortunes — themes, cards and quest tasks.
// A theme only changes names, words, tokens and the look.
// The board layout, prices and rules are the same for every theme.
// Board order: 0 Start, 1-8 bottom, 9 Jail, 10-17 left, 18 Free,
// 19-26 top, 27 Go to jail, 28-35 right.
// Property names below are listed in board order (22 of them).
// =====================================================================
(function (root) {
  const THEMES = {
    kingdom: {
      key: "kingdom", label: "🏰 Fantasy Kingdom", title: "Fortunes", sub: "of the Kingdom",
      money: n => "🪙" + n, moneyWord: "gold coins",
      props: ["Mudwallow Lane", "Toadstool Row",
        "Miller's Bridge", "Willow Green", "Fisher's Wharf",
        "Candlewick Street", "Bakers' Row", "Tinker's Yard",
        "Lantern Hill", "Blacksmith's Forge", "Market Cross",
        "Knight's Way", "Archery Field", "Tournament Ground",
        "Wizard's Tower", "Golden Meadow", "Dragon's Rest",
        "Elven Glade", "Crystal Falls", "Moonlit Gardens",
        "Crown Keep", "Palace of Kings"],
      stations: ["North Gate Stables", "River Ferry", "Griffin Roost", "Southern Port"],
      station: "stable or port",
      start: "Castle Gate", jail: "the Dungeon", jailName: "Dungeon", free: "Village Fair", gojail: "Off to the Dungeon!",
      chance: { name: "Crystal Ball", icon: "🔮" }, quest: { name: "Quest", icon: "📜" },
      house: { n: "cottage", i: "🏠" }, hotel: { n: "castle", i: "🏰" },
      tokens: ["🐉", "🦄", "🧙", "👑", "🛡️", "🏹", "🧚", "🐴"],
      icons: { start: "🏰", jail: "⛓️", free: "🎪", gojail: "🗝️", station: "🐎" },
    },
    city: {
      key: "city", label: "🏙️ City Streets", title: "Fortunes", sub: "of the City",
      money: n => "£" + n, moneyWord: "pounds",
      props: ["Cobble Lane", "Mill Street",
        "Station Road", "Park View", "Church Street",
        "Riverside Walk", "Elm Avenue", "Canal Wharf",
        "High Street", "Market Place", "Theatre Row",
        "Harbour View", "Castle Hill", "Orchard Rise",
        "Regent Square", "Lakeside Drive", "Grand Parade",
        "Hilltop Heights", "Royal Crescent", "Kings Terrace",
        "Millionaire's Row", "Skyline Tower"],
      stations: ["Central Station", "Bus Depot", "Ferry Port", "City Airport"],
      station: "station",
      start: "Start", jail: "Jail", jailName: "Jail", free: "Park Bench", gojail: "Go to Jail!",
      chance: { name: "Lucky Dip", icon: "🍀" }, quest: { name: "Challenge", icon: "⭐" },
      house: { n: "house", i: "🏠" }, hotel: { n: "hotel", i: "🏨" },
      tokens: ["🚗", "🎩", "🐕", "⛵", "👟", "🚂", "🛵", "🐈"],
      icons: { start: "🏁", jail: "🚔", free: "🌳", gojail: "👮", station: "🚉" },
    },
    space: {
      key: "space", label: "🚀 Space Colony", title: "Fortunes", sub: "of the Galaxy",
      money: n => "◈" + n, moneyWord: "space credits",
      props: ["Dust Belt", "Crater Row",
        "Ice Moon", "Comet Lane", "Nebula Drift",
        "Red Dunes", "Ring Station", "Asteroid Mine",
        "Solar Farm", "Rocket Yard", "Star Market",
        "Mars Base", "Lava Fields", "Plasma Plaza",
        "Sunspot Ridge", "Golden Galaxy", "Cosmic Gardens",
        "Alien Forest", "Crystal Caves", "Aurora Bay",
        "Starlight City", "Galaxy Palace"],
      stations: ["Launch Pad", "Warp Gate", "Moon Shuttle", "Hyperlane"],
      station: "spaceport",
      start: "Launch", jail: "the Black Hole", jailName: "Black Hole", free: "Space Café", gojail: "Sucked into the Black Hole!",
      chance: { name: "Cosmic Chance", icon: "🌠" }, quest: { name: "Mission", icon: "🛰️" },
      house: { n: "dome", i: "🛖" }, hotel: { n: "starbase", i: "🛸" },
      tokens: ["🚀", "🛸", "👽", "🤖", "🌙", "☄️", "🪐", "👾"],
      icons: { start: "🚀", jail: "🕳️", free: "☕", gojail: "🌀", station: "🛰️" },
    },
    northpole: {
      key: "northpole", label: "🎄 North Pole", title: "Fortunes", sub: "of the North Pole",
      money: n => "🪙" + n, moneyWord: "chocolate coins",
      props: ["Snowdrift Lane", "Icicle Row",
        "Frosty Pond", "Penguin Parade", "Snowball Alley",
        "Candy Cane Lane", "Gingerbread Row", "Sugarplum Street",
        "Cocoa Corner", "Toy Workshop", "Wrapping Room",
        "Sleigh Bell Square", "Holly Hill", "Tinsel Town",
        "Star Peak", "Golden Bauble", "Mistletoe Mews",
        "Pine Forest", "Evergreen Glade", "Christmas Tree Farm",
        "Mrs Claus's Kitchen", "Santa's Grotto"],
      stations: ["Reindeer Express", "Sleigh Port", "Snow Train", "Chimney Chute"],
      station: "sleigh stop",
      start: "Christmas Eve", jail: "the Naughty Corner", jailName: "Naughty Corner", free: "Fireside Rest", gojail: "Off to the Naughty Corner!",
      chance: { name: "Cracker", icon: "🎉" }, quest: { name: "Elf Task", icon: "🧝" },
      house: { n: "elf hut", i: "🏠" }, hotel: { n: "grotto", i: "🎄" },
      tokens: ["🎅", "⛄", "🦌", "🧝", "🐧", "🎁", "🍪", "🔔"],
      icons: { start: "🎄", jail: "😈", free: "🔥", gojail: "🙈", station: "🦌" },
    },
  };

  // Lucky cards. kind: goto | back | jail | escape | money | each | repairs | near | task
  const CHANCE = [
    { k: "goto", to: 0, txt: "Advance to {start} and collect {m200}." },
    { k: "goto", to: 35, txt: "Take a trip to {sq35}. Collect {m200} if you pass {start}." },
    { k: "goto", to: 21, txt: "Head to {sq21}. Collect {m200} if you pass {start}." },
    { k: "goto", to: 10, txt: "Go to {sq10}. Collect {m200} if you pass {start}." },
    { k: "goto", to: 28, txt: "Off you go to {sq28}. Collect {m200} if you pass {start}." },
    { k: "near", txt: "Travel to the nearest {station}. If someone owns it, pay them double rent." },
    { k: "near", txt: "Hitch a ride to the nearest {station}. If someone owns it, pay them double rent." },
    { k: "back", n: 3, txt: "Oops, wrong way! Go back 3 spaces." },
    { k: "jail", txt: "Caught! Go straight to {jail}. Don't pass {start}." },
    { k: "escape", txt: "Get out of {jail} free. Keep this card until you need it." },
    { k: "money", amt: 50, txt: "Lucky find! Collect {m50}." },
    { k: "money", amt: 150, txt: "Your investment paid off. Collect {m150}." },
    { k: "money", amt: -15, txt: "Fined for being far too noisy. Pay {m15}." },
    { k: "repairs", h: 25, c: 100, txt: "Time for repairs! Pay {m25} for each {house} and {m100} for each {hotel}." },
    { k: "each", amt: -50, txt: "You've been made ruler for the day. Pay every player {m50}." },
    { k: "money", amt: 100, txt: "A bonus from the treasury. Collect {m100}." },
  ];
  const QUEST = [
    { k: "task" }, { k: "task" }, { k: "task" }, { k: "task" }, { k: "task" },
    { k: "task" }, { k: "task" }, { k: "task" }, { k: "task" },
    { k: "each", amt: 10, txt: "It's your birthday! Every player gives you {m10}." },
    { k: "money", amt: 100, txt: "You won first prize at the fair. Collect {m100}." },
    { k: "money", amt: -50, txt: "Your boots fell apart. Pay {m50} for a new pair." },
    { k: "money", amt: -100, txt: "Everyone chips in for a new bridge. Pay {m100}." },
    { k: "money", amt: 25, txt: "You helped a neighbour. Collect {m25}." },
    { k: "escape", txt: "Get out of {jail} free. Keep this card until you need it." },
    { k: "goto", to: 0, txt: "Advance to {start} and collect {m200}." },
  ];

  // Quest tasks. secret = only the player's phone shows it, everyone guesses out loud.
  // perform = shown on the TV, everyone else votes on their phone.
  const S = (cat, list, kid) => list.map(w => ({ t: "secret", cat, what: w, kid }));
  const PF = (list, kid) => list.map(x => ({ t: "perform", txt: x, kid }));
  const TASKS = [
    ...S("Do an impression of", ["a pirate", "a robot", "a newsreader", "a football commentator", "a grumpy cat", "a T-rex", "a baby who wants milk", "a sat-nav", "a wizard casting a spell", "a dragon", "a chicken laying an egg", "a ghost", "an opera singer", "a monkey", "a sheepdog rounding up sheep", "a knight on a horse"], false),
    ...S("Mime (no talking!)", ["brushing your teeth", "changing a tyre", "baking a cake", "walking a dog that won't behave", "building a snowman", "fishing", "getting a haircut", "ironing a shirt", "washing a car", "climbing a mountain", "juggling", "putting up a tent", "wrapping a present", "catching a fly", "riding a rollercoaster", "milking a cow"], false),
    ...PF(["Say 'red lorry, yellow lorry' five times, fast", "Say 'she sells sea shells on the sea shore' three times, fast", "Do your best evil laugh", "Tell a joke. Is it funny?", "Keep a straight face for 15 seconds while everyone tries to make you laugh", "Name 5 fruits in 10 seconds", "Sing 'Happy Birthday' like an opera singer", "Do 10 star jumps", "Give a 15-second speech as the new ruler of the land", "Stand on one leg with your eyes closed for 10 seconds", "Say the alphabet backwards from J to A", "Make up a rhyme about the player on your left", "Do your best royal wave and bow", "Talk like a pirate for 15 seconds", "Name 5 things that are yellow in 10 seconds", "Do a 10-second dance with no music"], false),
    ...S("Make the noise of (no words!)", ["a cat", "a dog", "a cow", "a lion", "a duck", "a snake", "a monkey", "a sheep", "a horse", "an owl", "a pig", "an elephant"], true),
    ...S("Pretend to be (no talking!)", ["brushing your teeth", "swimming", "eating spaghetti", "riding a bike", "going to sleep", "a bird flying", "building a sandcastle", "a frog jumping"], true),
    ...PF(["Make the silliest face you can", "Sing 'Twinkle Twinkle Little Star'", "Hop on one leg 10 times", "Roar like a dragon", "Name 3 animals that live in the sea", "Count to 10 and back down again", "Do a funny dance", "Touch your toes 5 times", "Name 3 colours of the rainbow", "Flap like a chicken and cluck"], true),
  ];

  root.THEMES = THEMES; root.CHANCE = CHANCE; root.QUEST = QUEST; root.TASKS = TASKS;
})(typeof window !== "undefined" ? window : globalThis);
