// Local storage utility functions for managing challenges, mini games, and rewards

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Exercise' | 'Fun' | 'Adventure';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'Family Rewards' | 'Individual Rewards' | 'Special Rewards';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  available: boolean;
}

// Mini Games default data
const DEFAULT_MINI_GAMES: MiniGame[] = [
  { id: '1', title: 'Jumping Jacks Challenge', description: 'Do 20 jumping jacks as fast as you can', points: 5, category: 'Exercise' },
  { id: '2', title: 'Animal Walk Race', description: 'Crab walk, bear crawl, or frog jump across the room', points: 5, category: 'Fun' },
  { id: '3', title: 'Dance Party', description: 'Dance to 2 songs non-stop', points: 10, category: 'Adventure' },
  { id: '4', title: 'Balloon Keep-Up', description: 'Keep a balloon in the air for 2 minutes', points: 5, category: 'Fun' },
  { id: '5', title: 'Sock Toss', description: 'Toss rolled-up socks into a basket (10 tries)', points: 5, category: 'Fun' },
  { id: '6', title: 'Freeze Dance', description: 'Dance until the music stops, freeze when paused', points: 5, category: 'Fun' },
  { id: '7', title: 'Shadow Tag', description: 'Tag game where you step on shadows', points: 5, category: 'Fun' },
  { id: '8', title: 'Simon Says Fitness', description: 'Classic Simon Says with squats, hops, spins', points: 10, category: 'Adventure' },
  { id: '9', title: 'Jump Rope Minute', description: 'Jump rope for 1 full minute', points: 10, category: 'Exercise' },
  { id: '10', title: 'Plank Hold', description: 'Hold a plank position for 30 seconds', points: 10, category: 'Exercise' },
  { id: '11', title: 'Hula Hoop Spins', description: 'Do 25 spins without dropping the hoop', points: 5, category: 'Fun' },
  { id: '12', title: 'Obstacle Dash', description: 'Build a small indoor/outdoor obstacle course', points: 10, category: 'Adventure' },
  { id: '13', title: 'Push-Up Contest', description: 'Do as many push-ups as possible in 1 minute', points: 10, category: 'Exercise' },
  { id: '14', title: 'Sit-Up Challenge', description: 'Do 25 sit-ups', points: 10, category: 'Exercise' },
  { id: '15', title: 'Yoga Animal Poses', description: 'Hold 5 animal yoga poses (cat, dog, frog, etc.)', points: 5, category: 'Exercise' },
  { id: '16', title: 'Balance Beam', description: 'Walk heel-to-toe on a line or rope', points: 5, category: 'Exercise' },
  { id: '17', title: 'Pillow Hop', description: 'Jump across pillows without touching the floor', points: 5, category: 'Fun' },
  { id: '18', title: 'Sock Slide Race', description: 'Slide across the floor in socks (3 rounds)', points: 5, category: 'Fun' },
  { id: '19', title: 'Balloon Between Knees', description: 'Race holding balloon between knees', points: 5, category: 'Fun' },
  { id: '20', title: 'Star Jump Burst', description: '10 explosive star jumps', points: 5, category: 'Exercise' },
  { id: '21', title: 'Family Relay', description: 'Each family member does a short activity in sequence', points: 10, category: 'Adventure' },
  { id: '22', title: 'Wheelbarrow Walk', description: 'Partner carries legs while walking on hands', points: 10, category: 'Adventure' },
  { id: '23', title: 'Tug-of-War', description: 'Quick family tug match with rope or towel', points: 10, category: 'Adventure' },
  { id: '24', title: 'Speed Skipping', description: 'Skip rope or in place for 2 minutes', points: 10, category: 'Exercise' },
  { id: '25', title: 'Wall Sit Challenge', description: 'Hold wall sit for 30 seconds', points: 5, category: 'Exercise' },
  { id: '26', title: 'Superhero Run', description: 'Pretend to be superheroes running in place for 1 min', points: 5, category: 'Fun' },
  { id: '27', title: 'Stretch Circuit', description: 'Complete a 5-pose stretch routine', points: 5, category: 'Exercise' },
  { id: '28', title: 'Catch and Clap', description: 'Toss ball up, clap hands, and catch (10 times)', points: 5, category: 'Fun' },
  { id: '29', title: 'Balance on One Foot', description: 'Hold balance 20 seconds per side', points: 5, category: 'Exercise' },
  { id: '30', title: 'Paper Airplane Flight', description: 'Throw paper planes, longest 5 flights count', points: 5, category: 'Fun' },
  { id: '31', title: 'Jump Over Line', description: 'Jump back and forth over a rope for 1 min', points: 5, category: 'Exercise' },
  { id: '32', title: 'Leapfrog', description: 'Leap over partner 10 times each', points: 10, category: 'Adventure' },
  { id: '33', title: 'Sit-to-Stand Sprint', description: 'Stand/sit from chair 20 times', points: 5, category: 'Exercise' },
  { id: '34', title: 'Fitness Dice', description: 'Roll dice for exercises (jumping jacks, squats, etc.)', points: 10, category: 'Adventure' },
  { id: '35', title: 'Skipping Circle', description: 'Skip in a circle around the yard 3 times', points: 10, category: 'Exercise' },
  { id: '36', title: 'Step Count Sprint', description: 'Hit 200 steps as fast as possible', points: 5, category: 'Exercise' },
  { id: '37', title: 'Kick the Cone', description: 'Kick ball to knock over targets', points: 5, category: 'Fun' },
  { id: '38', title: 'Run & Touch', description: 'Run to touch 5 designated spots', points: 5, category: 'Exercise' },
  { id: '39', title: 'Crawl Tunnel', description: 'Crawl under chairs or table', points: 5, category: 'Fun' },
  { id: '40', title: 'Balance Book Walk', description: 'Walk across room balancing book on head', points: 5, category: 'Fun' },
  { id: '41', title: 'Mini Scavenger Hunt', description: 'Find 5 items while jogging around', points: 5, category: 'Adventure' },
  { id: '42', title: 'Jump Challenge', description: 'Jump up to touch a high spot 15 times', points: 5, category: 'Exercise' },
  { id: '43', title: 'Quick Hop Race', description: 'Hop on one leg across room and back', points: 5, category: 'Exercise' },
  { id: '44', title: 'Sit-Up Toss', description: 'Pass a ball while doing 10 sit-ups', points: 15, category: 'Adventure' },
  { id: '45', title: 'Bear Crawl Sprint', description: 'Bear crawl across room and back', points: 5, category: 'Exercise' },
  { id: '46', title: 'High Knee March', description: 'March in place 1 min with knees high', points: 5, category: 'Exercise' },
  { id: '47', title: 'Race the Timer', description: 'Run 10 laps around the yard', points: 10, category: 'Exercise' },
  { id: '48', title: 'Family Tug Circle', description: 'Everyone pulls rope in circle, last standing wins', points: 25, category: 'Adventure' },
  { id: '49', title: 'Endurance Challenge', description: 'Run in place for 5 minutes straight', points: 15, category: 'Exercise' },
  { id: '50', title: 'Super Obstacle Course', description: 'Large obstacle course (indoor/outdoor, 10 min)', points: 25, category: 'Adventure' }
];

// Challenges default data
const DEFAULT_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Family Balance', description: 'Hold tree pose together for 20 seconds', points: 5, difficulty: 'Easy' },
  { id: '2', title: 'Bedtime Stretch', description: 'Do a 5-minute stretch before bed, 5 nights in a row', points: 5, difficulty: 'Easy' },
  { id: '3', title: 'Plank Party', description: 'Each family member holds a plank for 30 seconds', points: 5, difficulty: 'Easy' },
  { id: '4', title: 'Dance Marathon', description: 'Have a 15-minute dance party together', points: 10, difficulty: 'Easy' },
  { id: '5', title: 'Game Night Active', description: 'Play an active game (balloon keep-up, freeze dance, etc.)', points: 5, difficulty: 'Easy' },
  { id: '6', title: 'Active Chores', description: 'Turn chores into an active challenge (10 mins of cleaning race)', points: 10, difficulty: 'Easy' },
  { id: '7', title: 'Walk & Talk', description: 'Go on a 20-minute family walk', points: 10, difficulty: 'Easy' },
  { id: '8', title: 'Jump Squad', description: 'Each family member completes 50 jumping jacks in a day', points: 10, difficulty: 'Easy' },
  { id: '9', title: 'Family Yoga Flow', description: 'Do a 10-minute yoga session as a family', points: 5, difficulty: 'Easy' },
  { id: '10', title: 'Screen-Free Hour', description: 'One full family hour with no devices, just play', points: 10, difficulty: 'Easy' },
  { id: '11', title: 'Step It Up', description: 'As a family, complete 25,000 steps in one day', points: 15, difficulty: 'Medium' },
  { id: '12', title: 'Relay Masters', description: 'Run 3 family relay races in one session', points: 15, difficulty: 'Medium' },
  { id: '13', title: 'Family Sports Time', description: 'Play 30 minutes of basketball, soccer, or catch', points: 15, difficulty: 'Medium' },
  { id: '14', title: 'Weekend Warrior', description: 'Do 3 different mini-games on a weekend day', points: 15, difficulty: 'Medium' },
  { id: '15', title: 'Obstacle Champs', description: 'Build and complete an obstacle course 3 times in one week', points: 15, difficulty: 'Medium' },
  { id: '16', title: 'Treasure Hunt', description: 'Do a 20-minute scavenger hunt outdoors', points: 15, difficulty: 'Medium' },
  { id: '17', title: 'Jump Rope Squad', description: 'Together complete 500 jump ropes', points: 15, difficulty: 'Medium' },
  { id: '18', title: 'Mini Scavenger Hunt', description: 'Find 5 items while jogging around', points: 15, difficulty: 'Medium' },
  { id: '19', title: 'Weekend Explorer', description: 'Visit a local park or trail and walk 2 miles', points: 15, difficulty: 'Medium' },
  { id: '20', title: 'Daily Dance Streak', description: 'Do a dance challenge 5 days in a row', points: 15, difficulty: 'Medium' },
  { id: '21', title: 'Step Streak', description: 'Hit step goals (7,500+ each) three days in a row', points: 15, difficulty: 'Medium' },
  { id: '22', title: 'Adventure Saturday', description: 'Pick one \'adventure\' mini-game to play outdoors', points: 15, difficulty: 'Medium' },
  { id: '23', title: 'High Energy Hour', description: 'Log 60 minutes of total family activity in one day', points: 25, difficulty: 'Hard' },
  { id: '24', title: 'Backyard Olympics', description: 'Create 5 mini competitions and crown winners', points: 25, difficulty: 'Hard' },
  { id: '25', title: 'Fitness Bingo', description: 'Complete a 3×3 bingo card of mini-games in one week', points: 25, difficulty: 'Hard' },
  { id: '26', title: 'Weekend Hike', description: 'Go on a hike of at least 1 mile', points: 25, difficulty: 'Hard' },
  { id: '27', title: '7-Day Streak', description: 'Log an activity together for 7 straight days', points: 25, difficulty: 'Hard' },
  { id: '28', title: 'Family Fitness Test', description: 'Time yourself: push-ups, sit-ups, jumping jacks. Repeat weekly.', points: 25, difficulty: 'Hard' },
  { id: '29', title: 'Super Family Challenge', description: 'Reach 50,000 steps as a family in one week', points: 25, difficulty: 'Hard' },
  { id: '30', title: 'Weekend Adventure Pack', description: 'Complete 3 Adventure activities in one weekend', points: 25, difficulty: 'Hard' }
];

// Rewards default data
const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'Family Movie Night', description: 'Pick a family movie and watch together with snacks', cost: 180, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '2', title: 'Ice Cream Outing', description: 'Family trip for ice cream cones', cost: 200, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '3', title: 'Pizza Night', description: 'Order or make pizza as a family', cost: 240, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '4', title: 'Family Game Night', description: 'Play a board game or video game together', cost: 180, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '5', title: 'Choose Dinner', description: 'Winner chooses the dinner menu for the night', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '6', title: 'Picnic in the Park', description: 'Family picnic outdoors', cost: 280, category: 'Family Rewards', rarity: 'rare', available: true },
  { id: '7', title: 'Bake Cookies Together', description: 'Family baking session', cost: 200, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '8', title: 'Family Walk Adventure', description: 'Choose the route for the next family walk', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '9', title: 'Campfire Night', description: 'Roast marshmallows and tell stories', cost: 320, category: 'Family Rewards', rarity: 'rare', available: true },
  { id: '10', title: 'Weekend Breakfast Treat', description: 'Pancakes or waffles for breakfast', cost: 240, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '11', title: 'Extra Bedtime Story', description: 'Add one more story before bed', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '12', title: 'Pick Next Challenge', description: 'Choose the next family challenge', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '13', title: 'Ice Cream Sundae Bar', description: 'Build-your-own sundaes at home', cost: 320, category: 'Family Rewards', rarity: 'rare', available: true },
  { id: '14', title: 'Family Karaoke Night', description: 'Karoake Jam Sesh', cost: 280, category: 'Family Rewards', rarity: 'rare', available: true },
  { id: '15', title: 'Backyard Campout', description: 'Sleep in tents or blankets outside', cost: 480, category: 'Family Rewards', rarity: 'epic', available: true },
  { id: '16', title: 'DIY Craft Night', description: 'Do a creative craft together', cost: 240, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '17', title: 'Choose Family Outing', description: 'Decide the next family day trip', cost: 600, category: 'Individual Rewards', rarity: 'epic', available: true },
  { id: '18', title: 'Puzzle Night', description: 'Complete a big puzzle together', cost: 200, category: 'Family Rewards', rarity: 'common', available: true },
  { id: '19', title: 'Family Sports Game', description: 'Play soccer, basketball, or kickball together', cost: 280, category: 'Family Rewards', rarity: 'rare', available: true },
  { id: '20', title: 'Mini Road Trip', description: 'Take a half-day road trip nearby', cost: 720, category: 'Family Rewards', rarity: 'epic', available: true },
  { id: '21', title: 'Extra Screen Time', description: 'Earn an additional 30 minutes of screen time', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '22', title: 'Stay Up 15 Minutes Later', description: 'Bedtime delayed by 15 minutes', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '23', title: 'Skip a Chore', description: 'Redeem to skip one household chore', cost: 150, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '24', title: 'Pick Music Playlist', description: 'Control the music for the next activity', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '25', title: 'Choose Seat at Dinner', description: 'Pick any chair at the table', cost: 60, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '26', title: 'Wear Pajamas All Day', description: 'Special PJ day pass', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '27', title: 'Pick the Dessert', description: 'Choose tonight\'s dessert', cost: 150, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '28', title: 'Game Controller First', description: 'Be first player in video games', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '29', title: 'Invite a Friend Over', description: 'Have a friend visit after school', cost: 100, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '30', title: 'Breakfast in Bed', description: 'Get breakfast served in bed', cost: 150, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '31', title: 'Pick Car Seat Spot', description: 'Choose where to sit in the car', cost: 60, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '32', title: 'Extra Reading Time', description: 'Add 15 minutes of reading before bed', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '33', title: 'Choose Outfit Day', description: 'Pick your own clothes, no questions asked', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '34', title: 'Pick Snack at Store', description: 'Choose a special snack on next shopping trip', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '35', title: 'Free Choice Activity', description: 'One hour of free-choice activity', cost: 150, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '36', title: 'Extra Video Game Time', description: '30 more minutes of gaming', cost: 180, category: 'Individual Rewards', rarity: 'rare', available: true },
  { id: '37', title: 'Be the Boss for a Day', description: 'Decide activities and meals for a day', cost: 125, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '38', title: 'Choose Car Ride Music', description: 'Control music in the car', cost: 90, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '39', title: 'Pick Bedtime Movie', description: 'Choose the bedtime show or movie', cost: 120, category: 'Individual Rewards', rarity: 'common', available: true },
  { id: '40', title: 'Sleepover with Friend', description: 'Host a sleepover at home', cost: 750, category: 'Individual Rewards', rarity: 'epic', available: true },
  { id: '41', title: 'Day at the Zoo', description: 'Visit a zoo or wildlife park', cost: 960, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '42', title: 'Theme Park Day', description: 'Family trip to a local amusement park', cost: 1440, category: 'Special Rewards', rarity: 'legendary', available: true },
  { id: '43', title: 'Bowling Night', description: 'Go bowling as a family', cost: 600, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '44', title: 'Laser Tag or Arcade', description: 'Family trip to arcade or laser tag', cost: 840, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '45', title: 'Water Park Adventure', description: 'Visit a local water park', cost: 1080, category: 'Special Rewards', rarity: 'legendary', available: true },
  { id: '46', title: 'Mini Golf Outing', description: 'Play mini golf together', cost: 600, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '47', title: 'Beach or Lake Day', description: 'Family trip to the water for the day', cost: 960, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '48', title: 'Professional Sports Game', description: 'Attend a live sports game together', cost: 2000, category: 'Special Rewards', rarity: 'legendary', available: true },
  { id: '49', title: 'New Family Board Game', description: 'Buy a new board game for everyone', cost: 720, category: 'Special Rewards', rarity: 'epic', available: true },
  { id: '50', title: 'Weekend Getaway', description: 'Overnight trip as a family', cost: 2160, category: 'Special Rewards', rarity: 'legendary', available: true }
];

// Storage functions for Mini Games
export const getMiniGames = (): MiniGame[] => {
  const stored = localStorage.getItem('fitfam-mini-games');
  if (!stored) {
    setMiniGames(DEFAULT_MINI_GAMES);
    return DEFAULT_MINI_GAMES;
  }
  return JSON.parse(stored);
};

export const setMiniGames = (games: MiniGame[]): void => {
  localStorage.setItem('fitfam-mini-games', JSON.stringify(games));
};

export const addMiniGame = (game: Omit<MiniGame, 'id'>): void => {
  const games = getMiniGames();
  const newGame = { ...game, id: Date.now().toString() };
  setMiniGames([...games, newGame]);
};

// Storage functions for Challenges
export const getChallenges = (): Challenge[] => {
  const stored = localStorage.getItem('fitfam-challenges');
  if (!stored) {
    setChallenges(DEFAULT_CHALLENGES);
    return DEFAULT_CHALLENGES;
  }
  return JSON.parse(stored);
};

export const setChallenges = (challenges: Challenge[]): void => {
  localStorage.setItem('fitfam-challenges', JSON.stringify(challenges));
};

export const addChallenge = (challenge: Omit<Challenge, 'id'>): void => {
  const challenges = getChallenges();
  const newChallenge = { ...challenge, id: Date.now().toString() };
  setChallenges([...challenges, newChallenge]);
};

// Storage functions for Rewards
export const getRewards = (): Reward[] => {
  const stored = localStorage.getItem('fitfam-rewards');
  if (!stored) {
    setRewards(DEFAULT_REWARDS);
    return DEFAULT_REWARDS;
  }
  return JSON.parse(stored);
};

export const setRewards = (rewards: Reward[]): void => {
  localStorage.setItem('fitfam-rewards', JSON.stringify(rewards));
};

export const addReward = (reward: Omit<Reward, 'id'>): void => {
  const rewards = getRewards();
  const newReward = { ...reward, id: Date.now().toString() };
  setRewards([...rewards, newReward]);
};

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem('fitfam-mini-games')) {
    setMiniGames(DEFAULT_MINI_GAMES);
  }
  if (!localStorage.getItem('fitfam-challenges')) {
    setChallenges(DEFAULT_CHALLENGES);
  }
  if (!localStorage.getItem('fitfam-rewards')) {
    setRewards(DEFAULT_REWARDS);
  }
};