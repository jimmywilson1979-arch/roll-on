# Roll On · Board Games

Family board games on the TV. Each phone is that player's dice, wallet and cards. It uses the same set-up as Buzz In: the TV screen opens the lobby, and phones scan the QR code to join.

**Play:** https://jimmywilson1979-arch.github.io/roll-on/

## Fortunes (the property game)

### Setting up
1. On the laptop or Chromebook, open the link and choose **This is the TV screen**. Cast the tab to the TV or plug in with HDMI, the same as Buzz In.
2. Players scan the QR code or enter the 4-letter code. Tick **A child is playing** for kids.
3. The first player to join is the **host**. The host picks the settings on their phone or on the TV, then presses **Start**.

### Settings (chosen before the game)
- **Theme:** 🏰 Fantasy Kingdom, 🏙️ City Streets, 🚀 Space Colony or 🎄 North Pole. The rules are the same in every theme. Only the names, money, pieces and look change.
- **How the game ends:**
  - ⏱️ Time limit (1 hour, 1½ hours or 2 hours of play). When time is up, the current round is finished and the richest player wins. Paused time doesn't count.
  - 🔁 Set rounds (15, 20 or 30). The richest player wins.
  - 🎯 First to a fortune (4,000, 6,000 or 8,000). The first player to reach it wins.
  - 👑 Last one standing. This is classic rules, and the game can run long.
- **Quest tasks:** turn them on or off.
- **Helper mode:** Kids, Everyone or Off.

### Rules
- Everyone starts with 1,500. On your turn, **shake your phone** or tap **Roll**.
- **Unowned place:** buy it at its price, or press **Auction**. Everyone then bids secretly on their phone (25 seconds). The highest bid wins. Bids stay hidden until the TV shows them all.
- **Someone else's place:** pay them rent.
  - Owning the whole colour set doubles the base rent.
  - Once you own a set, build up to 4 houses on each place, then a top building (castle, hotel, starbase or grotto). Build evenly across the set.
  - Stations pay 25, 50, 100 or 200 rent, depending on how many the owner has.
- **Start:** pass it to collect 200.
- **Doubles:** roll again. Three doubles in a row sends you to jail.
- **Jail** (Dungeon, Jail, Black Hole or Naughty Corner): to get out, roll a double, pay 50, or use a get-out-free card. After three tries without a double, you pay 50 and move.
- **Chance cards** (Crystal Ball, Lucky Dip, Cosmic Chance or Cracker) bring luck: moves, bonuses, fines and repairs.
- **Quest cards** (Quest, Challenge, Mission or Elf Task) are mostly **tasks** that win 50, 100 or 150:
  - 🤫 **Secret tasks** (impressions and mimes) only show on your phone. Everyone shouts out guesses, and you tap ✅ when someone gets it.
  - 🎤 **Show tasks** (tongue twisters, singing, jokes, star jumps) show on the TV. Everyone else votes 👍 or 👎.
  - Kids always get kids' tasks: animal noises, simple mimes and silly faces.
- **Trading:** use the Trade tab at any time. Pick a player, choose places and money each way, and send. They accept or decline on their phone. You can't trade places in a set that has buildings, so sell the buildings first.
- **My lands:** build, sell buildings (you get half back), mortgage places (half their price, but no rent) and pay off mortgages (the amount plus 10%).
- **Can't pay?** Raise the money by mortgaging, selling or trading. **Sort it for me** does this automatically. If even that isn't enough, you're out, and everything you own goes to whoever you owe.
- **Your fortune** is your money + the price of your places (half if mortgaged) + the cost of your buildings.

### Helper mode
For children (or everyone, if chosen), the helper:
- suggests whether to buy ("It finishes your set!", "Buy it to stop Tom getting the full set!")
- suggests a sensible auction bid, with a one-tap button
- shows when you can build
- gives a jail tip
- offers a **Sort it for me** button when money is owed.

### Host controls
On the TV, or under ⚙️ on the host's phone:
- **Pause**
- **Move it along:** rolls, auctions or ends the turn for a player who has wandered off.
- **Finish game:** counts up fortunes now.

### Saving
The TV saves the game as it goes. If the TV page closes, open the site on the same laptop and press **Carry on the saved game**. Phones reconnect by themselves. A player on a new phone can join with the **same name** to take back their place.

### Testing on one computer
Open `?tv=TEST&local=1` in one tab. Then open `?join=TEST&local=1&slot=1`, `&slot=2` and so on in other tabs. Each slot is a different player.

## Files
- `index.html`: TV and phone screens, plus the live connection (Supabase Realtime broadcast, nothing stored).
- `engine.js`: all the rules. It has no screen code, so it can be tested on its own.
- `themes.js`: themes, cards and quest tasks. Add a theme here.

## Coming next
- 🔍 Mystery: secret clues on every phone.
- 🗺️ Adventure: a team game where everyone plays together.
