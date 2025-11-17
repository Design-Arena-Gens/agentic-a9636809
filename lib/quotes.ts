export type QuoteSeed = {
  id: string;
  text: string;
  source: string;
  context: string;
};

export const KRISHNA_HASHTAGS = [
  "#LordKrishna",
  "#BhagavadGita",
  "#krishna",
  "#harekrishna",
  "#radhakrishna",
  "#radhekrishna",
  "#jaishreekrishna",
  "#krishnalove",
  "#krishnaconsciousness",
  "#krishnamotivation",
  "#krishnainspiration",
  "#gita",
];

export const QUOTE_LIBRARY: QuoteSeed[] = [
  {
    id: "gita-2-47",
    text: "You have the right to work, but never to the fruit of work.",
    source: "Bhagavad Gita 2.47",
    context:
      "Krishna reminds Arjuna to focus on righteous action without attachment to results.",
  },
  {
    id: "gita-18-66",
    text: "Abandon all varieties of dharma and simply surrender unto Me.",
    source: "Bhagavad Gita 18.66",
    context:
      "A call to surrender ego and fears, trusting the divine plan completely.",
  },
  {
    id: "gita-6-5",
    text: "Lift yourself by yourself; do not let yourself down.",
    source: "Bhagavad Gita 6.5",
    context:
      "An invitation to become your own ally by mastering the mind with discipline.",
  },
  {
    id: "gita-4-7",
    text: "Whenever righteousness declines and unrighteousness rises, I manifest Myself.",
    source: "Bhagavad Gita 4.7",
    context:
      "A reminder that divine guidance appears whenever darkness seems overwhelming.",
  },
  {
    id: "gita-10-8",
    text: "I am the source of all spiritual and material worlds.",
    source: "Bhagavad Gita 10.8",
    context:
      "Motivates devotees to draw strength from the inexhaustible source of creation.",
  },
  {
    id: "gita-12-15",
    text: "By whom the world is not agitated and who cannot be agitated by the world, he is dear to Me.",
    source: "Bhagavad Gita 12.15",
    context:
      "Krishna praises steady-minded devotees who stay calm amidst chaos and serve with compassion.",
  },
  {
    id: "gita-3-19",
    text: "Perform your duty equipoised, abandoning all attachment to success or failure.",
    source: "Bhagavad Gita 3.19",
    context:
      "Motivates warriors and seekers alike to act with excellence and grace.",
  },
  {
    id: "gita-2-22",
    text: "As a person sheds worn-out garments and wears new ones, the soul discards worn-out bodies and enters new ones.",
    source: "Bhagavad Gita 2.22",
    context:
      "Inspires fearlessness by highlighting the eternal nature of the soul.",
  },
  {
    id: "gita-5-10",
    text: "One who performs duty without attachment and surrenders the results unto the Supreme is unaffected by sinful action.",
    source: "Bhagavad Gita 5.10",
    context:
      "A motivating reminder that surrender purifies the heart and refines karma.",
  },
  {
    id: "gita-18-58",
    text: "If you become conscious of Me, you will pass over all obstacles of conditioned life.",
    source: "Bhagavad Gita 18.58",
    context:
      "Encourages daily remembrance of Krishna to navigate life's tests.",
  },
  {
    id: "mahabharata-udbhava",
    text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
    source: "Bhagavad Gita 6.19",
    context:
      "Calls seekers to cultivate stillness and clarity every single day.",
  },
  {
    id: "gita-4-13",
    text: "I created the four social divisions according to qualities and work.",
    source: "Bhagavad Gita 4.13",
    context:
      "Reminds us to honor our unique gifts and serve society with devotion.",
  },
  {
    id: "gita-11-55",
    text: "He who does all work for Me, depends on Me, is devoted to Me, is free from attachment and enmity towards all beings, comes to Me.",
    source: "Bhagavad Gita 11.55",
    context:
      "Motivates living with bhakti and universal compassion for every soul.",
  },
];

export function getRandomQuoteSeed(): QuoteSeed {
  return QUOTE_LIBRARY[Math.floor(Math.random() * QUOTE_LIBRARY.length)];
}
