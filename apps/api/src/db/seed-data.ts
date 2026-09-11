import type { FaqCategory } from "@meridian/shared";

export type SeedFaq = {
  category: FaqCategory;
  question: string;
  answer: string;
  tags: string[];
};

export const SEED_FAQS: SeedFaq[] = [
  {
    category: "general",
    question: "What is The Meridian Casino & Resort?",
    answer:
      "The Meridian Casino & Resort is a luxury destination on the Las Vegas Strip in Nevada, offering 24-hour gaming, refined dining, suites, and a full spa and entertainment campus.",
    tags: ["property", "location", "strip", "overview"],
  },
  {
    category: "general",
    question: "Where is The Meridian located?",
    answer: "We are on the Las Vegas Strip in Nevada.",
    tags: ["location", "strip", "nevada", "address"],
  },
  {
    category: "general",
    question: "What are the casino hours?",
    answer: "The casino is open 24 hours a day, 7 days a week.",
    tags: ["casino", "hours", "open", "24/7"],
  },
  {
    category: "general",
    question: "What time is hotel check-in?",
    answer: "Hotel check-in is at 4:00 PM. Early check-in is subject to availability.",
    tags: ["check-in", "arrival", "hotel", "4pm"],
  },
  {
    category: "general",
    question: "What time is hotel check-out?",
    answer: "Hotel check-out is at 11:00 AM. Late checkout is available for suite guests.",
    tags: ["check-out", "departure", "hotel", "11am"],
  },
  {
    category: "general",
    question: "How much is valet parking?",
    answer:
      "Valet parking is complimentary for hotel guests and $25 for visitors. Self parking is free for all guests.",
    tags: ["valet", "parking", "car", "self parking"],
  },
  {
    category: "general",
    question: "Is self parking free?",
    answer: "Yes. Self parking is free for all guests.",
    tags: ["parking", "self parking", "garage"],
  },
  {
    category: "general",
    question: "What is the dress code?",
    answer:
      "Smart casual is expected throughout the property. Formal attire is required at Aurelia and at Eclipse Lounge after 8 PM.",
    tags: ["dress", "attire", "formal", "smart casual"],
  },
  {
    category: "general",
    question: "What is the age requirement?",
    answer:
      "Guests must be 21 or older for the casino floor and bars. All ages are welcome in the hotel and family restaurants.",
    tags: ["age", "21", "minors", "family"],
  },
  {
    category: "general",
    question: "Do you have Wi-Fi?",
    answer:
      "Complimentary Wi-Fi is available throughout the property. Premium high-speed internet is available in suites.",
    tags: ["wifi", "internet", "wireless"],
  },
  {
    category: "gaming",
    question: "Is the poker room open right now?",
    answer:
      "Yes, our poker room is open 24 hours a day, 7 days a week. We offer Texas Hold'em, Omaha, and Seven Card Stud. Daily tournaments start at 11 AM and 7 PM with a $200 buy-in.",
    tags: ["poker", "hours", "open", "tournament", "holdem"],
  },
  {
    category: "gaming",
    question: "What games are offered in the poker room?",
    answer:
      "The poker room offers Texas Hold'em — both No Limit and Limit — plus Omaha and Seven Card Stud. Tournaments run daily at 11 AM and 7 PM with a $200 buy-in.",
    tags: ["poker", "holdem", "omaha", "stud", "tournament"],
  },
  {
    category: "gaming",
    question: "Tell me about the slot machines.",
    answer:
      "We have over 2,000 slot machines ranging from one cent to $1,000 per spin, including video slots, classic reels, and progressive jackpots. The largest jackpot is currently $4.2 million.",
    tags: ["slots", "jackpot", "machines"],
  },
  {
    category: "gaming",
    question: "How many blackjack tables do you have?",
    answer:
      "There are 40 blackjack tables with minimums from $25 to $10,000. Single deck, 6-deck, and Spanish 21 are available.",
    tags: ["blackjack", "21", "tables"],
  },
  {
    category: "gaming",
    question: "Do you have roulette?",
    answer:
      "Yes. We have 12 roulette tables including American, European, and French roulette, with minimums from $15.",
    tags: ["roulette", "tables"],
  },
  {
    category: "gaming",
    question: "Do you offer baccarat?",
    answer:
      "Yes. There are 8 baccarat tables in the main casino and 4 more in the private high-limit salon. Minimums start at $50, and high-limit play starts at $5,000.",
    tags: ["baccarat", "high limit"],
  },
  {
    category: "gaming",
    question: "Is there craps?",
    answer:
      "We have 6 craps tables with minimums from $15. Lessons are available daily at 10 AM.",
    tags: ["craps", "lessons"],
  },
  {
    category: "gaming",
    question: "Where can I bet on sports?",
    answer:
      "Our sports book is an 80-seat theater with a 40-foot screen and full bar service. Mobile betting is available throughout the property on the Meridian app.",
    tags: ["sports", "betting", "book"],
  },
  {
    category: "gaming",
    question: "What is the High Limit Salon?",
    answer:
      "The High Limit Salon is a private gaming area with dedicated hosts, private restrooms, complimentary dining, and personal butler service. Access is by invitation or a $50,000 credit line.",
    tags: ["high limit", "vip", "salon"],
  },
  {
    category: "gaming",
    question: "How does the players club work?",
    answer:
      "Meridian Rewards lets you earn points on all play. Tiers are Gold, Platinum, Diamond, and invite-only Black.",
    tags: ["players club", "rewards", "points", "tiers"],
  },
  {
    category: "accommodations",
    question: "What room types do you have?",
    answer:
      "We offer Deluxe Rooms from $299, Premier Rooms from $449, Luxury Suites from $799, Penthouse Suites from $2,500, and the Chairman's Villa by inquiry. Accessible rooms are available in every category.",
    tags: ["rooms", "suites", "rates"],
  },
  {
    category: "accommodations",
    question: "Tell me about the Deluxe Room.",
    answer: "Deluxe Rooms are 450 square feet with a king or two queens, a city or pool view, from $299 a night.",
    tags: ["deluxe", "room"],
  },
  {
    category: "accommodations",
    question: "Tell me about the Premier Room.",
    answer: "Premier Rooms are 550 square feet with a king bed, sitting area, and Strip view, from $449 a night.",
    tags: ["premier", "room", "strip view"],
  },
  {
    category: "accommodations",
    question: "Tell me about the Luxury Suite.",
    answer:
      "Luxury Suites are 900 square feet with a separate living room and a marble bathroom with soaking tub, from $799 a night.",
    tags: ["luxury", "suite"],
  },
  {
    category: "accommodations",
    question: "Tell me about the Penthouse Suite.",
    answer:
      "Penthouse Suites are 1,800 square feet with two bedrooms, a dining room, butler's pantry, and private terrace, from $2,500 a night.",
    tags: ["penthouse", "suite"],
  },
  {
    category: "accommodations",
    question: "Tell me about the Chairman's Villa.",
    answer:
      "The Chairman's Villa is 4,500 square feet with three bedrooms, a private pool, optional personal chef, and 24-hour butler service. Availability is by inquiry only.",
    tags: ["villa", "chairman", "butler"],
  },
  {
    category: "accommodations",
    question: "Do you have accessible rooms?",
    answer:
      "Yes. Accessible rooms are available in all categories, with roll-in showers, lowered amenities, and visual alerts. Please request at booking.",
    tags: ["accessible", "ada", "disability"],
  },
  {
    category: "dining",
    question: "What is your best restaurant?",
    answer:
      "Our signature restaurant is Aurelia, featuring modern French cuisine by Chef Marcus Webb — it holds two Michelin stars. Dinner is served from 6 to 10 PM, reservations are required, and formal attire is expected. For something more casual, Silk Road offers Pan-Asian cuisine and The Steakhouse is classic American dining.",
    tags: ["aurelia", "best", "signature", "michelin", "recommend"],
  },
  {
    category: "dining",
    question: "Tell me about Aurelia.",
    answer:
      "Aurelia is fine dining with modern French cuisine by Chef Marcus Webb, who holds two Michelin stars. The tasting menu is $285 per person, with à la carte also available. Dinner only, 6 PM to 10 PM. Reservations and formal attire are required.",
    tags: ["aurelia", "french", "michelin", "formal"],
  },
  {
    category: "dining",
    question: "Tell me about Silk Road.",
    answer:
      "Silk Road is Pan-Asian, with a sushi bar, robata grill, and dim sum. Open 11 AM to 11 PM daily. Reservations are recommended for dinner. Smart casual, typically $40 to $80 per person.",
    tags: ["silk road", "asian", "sushi"],
  },
  {
    category: "dining",
    question: "Tell me about The Steakhouse.",
    answer:
      "The Steakhouse is a classic American steakhouse serving dry-aged beef and fresh seafood from 5 PM to 11 PM. Reservations are recommended. Smart casual, typically $70 to $150 per person.",
    tags: ["steakhouse", "steak", "american"],
  },
  {
    category: "dining",
    question: "Tell me about Café Meridian.",
    answer:
      "Café Meridian is casual all-day dining. Breakfast buffet is 7 to 11 AM for $45, with lunch and dinner until midnight. No reservations needed.",
    tags: ["cafe", "breakfast", "casual"],
  },
  {
    category: "dining",
    question: "Is the Pool Bar & Grill open to everyone?",
    answer:
      "Pool Bar & Grill is poolside casual — burgers, salads, and cocktails — from 10 AM to 6 PM seasonally, and it is for hotel guests only.",
    tags: ["pool bar", "grill", "hotel guests"],
  },
  {
    category: "dining",
    question: "Which restaurants require reservations?",
    answer:
      "Aurelia requires reservations. Silk Road and The Steakhouse recommend them for dinner. Café Meridian does not take reservations.",
    tags: ["reservations", "dining"],
  },
  {
    category: "bars",
    question: "Tell me about Eclipse Lounge.",
    answer:
      "Eclipse Lounge is our rooftop bar with Strip views, craft cocktails, and a champagne menu. Open 5 PM to 2 AM. Formal attire is required after 8 PM. Private terrace reservations are available for special occasions.",
    tags: ["eclipse", "rooftop", "cocktails", "formal"],
  },
  {
    category: "bars",
    question: "Tell me about The Vault.",
    answer:
      "The Vault is a whiskey and cigar lounge with more than 400 whiskey selections and a humidor of premium cigars. Open 4 PM to 2 AM, 21 and over.",
    tags: ["vault", "whiskey", "cigar"],
  },
  {
    category: "bars",
    question: "Are drinks complimentary on the casino floor?",
    answer:
      "There are six bars throughout the casino. Complimentary drinks are offered for active players, and full service is available for all guests.",
    tags: ["casino bars", "complimentary", "drinks"],
  },
  {
    category: "amenities",
    question: "Tell me about Meridian Spa.",
    answer:
      "Meridian Spa is a full-service spa and salon offering massage, facials, and body treatments, including couples suites. Open 8 AM to 8 PM. Booking 24 hours in advance is recommended.",
    tags: ["spa", "massage", "salon"],
  },
  {
    category: "amenities",
    question: "Is there a fitness center?",
    answer:
      "Yes. The fitness center is open 24 hours for hotel guests, with Peloton bikes, free weights, a yoga studio, and personal training.",
    tags: ["fitness", "gym", "peloton"],
  },
  {
    category: "amenities",
    question: "Tell me about the pool complex.",
    answer:
      "We have three pools, including an adults-only infinity pool. Cabanas start at $300 a day and include a $100 food credit. Pools are open 8 AM to 8 PM.",
    tags: ["pool", "cabanas", "infinity"],
  },
  {
    category: "amenities",
    question: "What is showing at Meridian Theater?",
    answer:
      "Meridian Theater is a 1,200-seat venue with residencies by internationally acclaimed artists. Tickets start at $95, and VIP packages are available. Please check the current schedule on our website.",
    tags: ["theater", "show", "tickets"],
  },
  {
    category: "amenities",
    question: "Tell me about NOVA nightclub.",
    answer:
      "NOVA is our premier nightclub, open Friday and Saturday from 10:30 PM to 4 AM. Cover is $50 general, tables from $2,000. Hotel guests can request the guest list.",
    tags: ["nova", "nightclub", "nightlife"],
  },
  {
    category: "events",
    question: "Can you help me plan a proposal or celebration?",
    answer:
      "How exciting. Celebration packages start at $500 and include a room upgrade, champagne, custom cake, and dinner credit, with 72 hours' notice. For something more elaborate, Eclipse Lounge offers private terrace reservations with Strip views. I recommend speaking with our concierge desk to plan the perfect moment.",
    tags: ["propose", "proposal", "anniversary", "celebration", "romantic"],
  },
  {
    category: "events",
    question: "Do you host weddings?",
    answer:
      "Yes. Venues range from an intimate chapel to a grand ballroom, with packages from $5,000 to $150,000. A wedding coordinator is included in every package.",
    tags: ["wedding", "chapel", "ballroom"],
  },
  {
    category: "events",
    question: "Can I book a private or corporate event?",
    answer:
      "Meeting rooms and ballrooms range from 500 to 15,000 square feet, with full catering, AV services, and corporate rates.",
    tags: ["private events", "meetings", "corporate"],
  },
  {
    category: "events",
    question: "Do you have birthday or anniversary packages?",
    answer:
      "Yes. Celebration packages include a room upgrade, champagne, custom cake, and dinner credit from $500 additional. We need 72 hours' advance notice.",
    tags: ["birthday", "anniversary", "package"],
  },
  {
    category: "events",
    question: "Do you offer bachelor or bachelorette packages?",
    answer:
      "VIP packages include a suite, nightclub table, pool cabana, and spa credits, starting at $3,000. Please book at least one week in advance.",
    tags: ["bachelor", "bachelorette", "vip"],
  },
  {
    category: "partners",
    question: "Are there any good restaurants nearby you'd recommend?",
    answer:
      "Absolutely. Carbone is an excellent Italian fine dining restaurant about five minutes away, and Meridian guests receive 15% off food plus priority reservations — just show your room key. We also have three restaurants on property if you would prefer to stay in.",
    tags: ["carbone", "nearby", "partner", "italian", "discount", "room key"],
  },
  {
    category: "partners",
    question: "What partner discounts can I get with my room key?",
    answer:
      "With your room key: 15% off at Carbone with priority reservations, $10 off Omega Mart, 20% off Vegas Nights Aviation helicopter Strip tours with complimentary champagne, a free extra hour at Top Golf with a two-hour booking, 10% off Spa Aquae at JW Marriott when Meridian Spa is fully booked, and a VIP SlotZilla pass at Fremont Street Experience.",
    tags: ["partners", "discounts", "room key", "perks"],
  },
  {
    category: "partners",
    question: "Is there a discount for Omega Mart?",
    answer: "Yes. Meridian guests receive $10 off Omega Mart admission. Please show your room key.",
    tags: ["omega mart", "art", "discount"],
  },
  {
    category: "partners",
    question: "Do you offer helicopter tours?",
    answer:
      "Vegas Nights Aviation offers Strip tours with 20% off for Meridian guests and complimentary champagne. Show your room key.",
    tags: ["helicopter", "tours", "aviation"],
  },
  {
    category: "partners",
    question: "Is there a Top Golf discount?",
    answer: "Yes. Book two hours at Top Golf Las Vegas and receive a free extra hour. Show your room key.",
    tags: ["top golf", "discount"],
  },
  {
    category: "partners",
    question: "What if Meridian Spa is fully booked?",
    answer:
      "When Meridian Spa is fully booked, guests receive 10% off treatments at Spa Aquae at JW Marriott with a room key.",
    tags: ["spa aquae", "marriott", "spa"],
  },
  {
    category: "partners",
    question: "Any perks at Fremont Street Experience?",
    answer: "Yes. Meridian guests receive a VIP SlotZilla pass and skip-the-line access. Show your room key.",
    tags: ["fremont", "slotzilla", "downtown"],
  },
];
