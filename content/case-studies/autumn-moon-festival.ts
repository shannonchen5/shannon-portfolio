import type { CaseStudy } from "./_schema";

const study: CaseStudy = {
  slug: "autumn-moon-festival",
  title:
    "Raising awareness of seven Autumn Moon traditions through a research-led festival website",
  category: "digital",
  summary:
    "An educational, multicultural website for San Diego's inaugural Autumn Moon Festival",
  role: "User Researcher",
  duration: "Summer 2025, 10 weeks",
  team: "Cross-functional design team with designers and development",
  tools: ["Online surveys", "FigJam", "Dovetail"],
  cover: {
    src: "/media/placeholders/cover-digital-c.svg",
    alt: "San Diego Autumn Moon Festival website case study cover",
    aspectRatio: "16 / 10",
  },
  featured: true,
  stats: [
    { value: "130", label: "Survey respondents" },
    { value: "9", label: "Hour-long interviews" },
    { value: "7", label: "Cultures researched & showcased" },
    { value: "+1.125", label: "Avg. familiarity gain after testing" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "richText",
          content:
            "The San Diego Autumn Moon Festival wanted its inaugural event to do more than fill a calendar. The organizers wanted an educational, multicultural experience showing how different communities around the world celebrate the harvest moon. As the User Researcher for the San Diego Autumn Moon Festival, my job was to make sure every decision on the website came from real user needs, cultural sensitivity, and accurate storytelling.",
        },
      ],
    },
    {
      id: "problem",
      title: "The Problem",
      blocks: [
        {
          type: "richText",
          content:
            "The stakes were high because the festival's goal was education and visibility for communities that are often underrepresented. A generic, decorative site would fail on both counts, and worse, shallow cultural content can alienate the people it claims to celebrate.",
        },
      ],
    },
    {
      id: "discovery",
      title: "Discovery",
      blocks: [
        {
          type: "richText",
          content:
            "I started by creating and sending a survey to 48 San Diego nonprofits aimed at supporting the Asian community, which reached 130 respondents. The results helped us identify different cultural groups, naming conventions, celebration patterns, and sentiment towards the festival. The clearest finding was that familiarity and perceived importance varied widely. Respondents wanted to learn more, but they were not strongly self-motivated, which meant the site had to spark curiosity instead of assuming it.\n\nAdditionally, I conducted nine hour-long interviews with people who celebrate the festival. These conversations surfaced experiences, personal anecdotes, and cultural nuances that surveys alone could not capture. Interviewees described traditions such as moon appreciation, family gatherings, Taiwanese barbeques, Hong Kong's Tai Hang Fire Dragon Dance, emotional childhood memories, colorful performances, and a sense of cultural disconnect after immigrating. Interviewees kept coming back to storytelling, symbolism, and regional specificity.",
        },
        {
          type: "stats",
          items: [
            {
              value: "130",
              label: "Respondents via 48 San Diego Asian-community nonprofits",
            },
            {
              value: "9",
              label: "Hour-long interviews with people who celebrate the festival",
            },
          ],
        },
        {
          type: "richText",
          content:
            "I also ran a competitive analysis of existing festival websites, scoring each on information architecture, educational depth, cultural representation, and visual identity. The pattern was consistent: most sites lacked meaningful educational content and leaned on generic cultural imagery.",
        },
      ],
    },
    {
      id: "defining",
      title: "Defining the Problem",
      blocks: [
        {
          type: "richText",
          content:
            "I coded the survey and interview data in Dovetail, the research repository and AI synthesis tool. I manually tagged the interview data into key themes, then Dovetail's AI agent turned those tagged themes into concise, decision-ready key insights. I turned these insights into pain points and How Might We statements. Two findings shaped the direction. Many people felt disconnected from their culture or unsure how to celebrate in the U.S. Additionally, shallow or generalized content could push users away rather than draw them in.\n\nThat led to the core design challenge: create a culturally respectful, educational experience that highlights both well-known and lesser-known traditions without homogenizing them. I refined the HMW statements into three prompts for the design team:",
        },
        {
          type: "callout",
          content:
            "How might we represent lesser-known cultural traditions with accuracy and respect?\n\nHow might we build trust through transparent, well-researched educational content?\n\nHow might we differentiate our festival website through depth rather than decoration?",
        },
      ],
    },
    {
      id: "design",
      title: "Turning Research into Design Decisions",
      blocks: [
        {
          type: "richText",
          content:
            "During design, I worked closely with the designers to translate findings into structure. I provided cultural breakdowns, sentiment patterns, and festival practices so content could be organized around what users cared about. Interviewees consistently linked the festival to colorful performances, food stalls, and community energy, which informed the visual direction and interaction patterns.\n\nI also helped the team evaluate ideas against shared criteria: educational clarity, cultural sensitivity, and information architecture. That kept us focused on discussion points backed by evidence instead of producing inaccurate artifacts.",
        },
        {
          type: "callout",
          content:
            "[Add your failed-then-fixed moment here: one design or content decision that didn't hold up in review or testing, what the feedback said, and what changed.]",
        },
        {
          type: "richText",
          content:
            "As the team moved into high-fidelity design and development, I stayed involved in validation. I proof-checked copy for authenticity and cross-referenced cultural details against interview insights, so that content was accurate and easy to digest.",
        },
      ],
    },
    {
      id: "solution",
      title: "The Final Design",
      blocks: [
        {
          type: "richText",
          content:
            "The final site educates through depth. It showcases seven distinct cultures, each researched individually, and pairs well-known traditions with lesser-known ones without collapsing them into a single story. The structure and tone are built to draw in people who are curious but not yet motivated to learn on their own.",
        },
        {
          type: "image",
          src: "/media/placeholders/media-wide.svg",
          alt: "[Add Autumn Moon Festival screens and prototype link here]",
          aspectRatio: "16 / 9",
        },
      ],
    },
    {
      id: "results",
      title: "Impact",
      blocks: [
        {
          type: "stats",
          items: [
            {
              value: "+1.125",
              label: "Average familiarity score gain (1–5 scale) after a session",
            },
            {
              value: "7",
              label: "Cultures thoroughly researched and showcased",
            },
          ],
        },
        {
          type: "richText",
          content:
            "I structured user testing around four pillars: aesthetic and emotional response, trust-centered UX, information architecture, and usability. At the start of each session, we asked participants to rate their familiarity with Autumn Moon festivities from 1 to 5, then asked again at the end. On average, scores rose by 1.125 points.\n\nBehind that result were 130 survey respondents who informed design and content choices, and seven cultures thoroughly researched and showcased.\n\nFor an inaugural event, that movement matters. The festival's central goal was awareness, and a single session with the site moved the average participant more than a full point on a five-point scale. That is direct evidence the site does its main job: teaching people about traditions they didn't know, with sincerity and respect.",
        },
      ],
    },
    {
      id: "reflection",
      title: "What's Next",
      blocks: [
        {
          type: "richText",
          content:
            "Looking ahead, I plan on tracking website engagement throughout the coming years of the San Diego Autumn Moon Festival to understand if higher awareness of the event translates into higher event attendance and repeat engagement.",
        },
      ],
    },
  ],
};

export default study;
