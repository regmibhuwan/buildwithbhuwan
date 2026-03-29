const SITE_DATA = {
  version: '2025-03-27',

  projects: [
    {
      id: 'evp-connect',
      name: 'EVP Connect',
      tagline: 'Transforming How Teams Operate, Connect, and Communicate',
      description: [
        'I work on the production floor at a poultry processing company in Nova Scotia. Every day, I saw the same friction: shift schedules buried in email chains, announcements that never reached the night crew, new employees with no idea who to call for help after 4 PM when office staff had already left for the day.',
        'Nobody asked me to fix this. I went home after my shifts, opened my laptop, and built an entire platform from scratch. No funding, no resources from the company. Just time I invested on my own because I wanted to make my coworkers\u0027 daily work life easier.'
      ],
      features: [
        { title: 'Digital Shift Sign Ups', desc: 'One click overtime and volunteer shift registration with auto generated reports, saving managers hours every week' },
        { title: 'Production Schedules', desc: 'Accessible from any phone, anytime, anywhere. Replacing paper schedules that were easy to miss' },
        { title: 'Smart Announcements', desc: 'Company wide notifications that auto expire when no longer relevant. 25+ announcements managed and delivered' },
        { title: 'Staff Directory', desc: 'Quick access to office contacts. Critical for night shift workers who start at 4:30 PM after office staff have left' },
        { title: 'News Feed', desc: 'Central place for company updates and team connections, keeping all shifts informed and connected' },
        { title: 'Online Forms', desc: 'Digital forms replacing paper processes, reducing errors and making submissions accessible from anywhere' }
      ],
      screenshots: ['images/evp-dashboard.png', 'images/evp-schedules.png'],
      outcome: 'Fully built, tested, and live. Presented to the CFO and Senior Director of People Services. Currently under internal security and budget review for company wide rollout.',
      tags: ['React', 'TypeScript', 'Supabase', 'Node.js', 'Fullstack'],
      url: '',
      icon: '🏢',
      featured: true,
      badge: 'Under Security & Budget Review',
      linkText: ''
    },
    {
      id: 'vendor-analysis',
      name: 'Vendor Performance Analysis',
      tagline: '$2.71M in Actionable Savings Identified',
      description: [
        'Analyzed millions of retail transactions to uncover smarter purchasing and vendor optimization strategies. Built a SQL ETL pipeline, ran Python exploratory data analysis with hypothesis testing, and designed interactive Power BI dashboards. Found $2.71M in unsold inventory and identified bulk purchasing strategies that cut cost per unit by up to 72%.'
      ],
      tags: ['SQL', 'Python', 'Power BI', 'ETL', 'Statistical Analysis'],
      url: 'https://www.linkedin.com/in/regmibhuwan/',
      icon: '📊',
      featured: false,
      linkText: 'View on LinkedIn'
    },
    {
      id: 'gymsage',
      name: 'GymSage',
      tagline: 'Fullstack AI Fitness Platform',
      description: [
        'Voice log your sets with Whisper AI, get GPT-4 Vision body composition analysis, track muscle group photo timelines, and chat with an AI coach that remembers your full fitness history. Built solo from scratch as a PWA.'
      ],
      tags: ['GPT-4 Vision', 'Whisper AI', 'React', 'TypeScript', 'Supabase'],
      url: 'https://gymsage.vercel.app/',
      icon: '🏋️',
      featured: false,
      linkText: 'Live App'
    },
    {
      id: 'mamaai',
      name: 'MamaAI',
      tagline: 'Real Time AI Cooking Companion',
      description: [
        'Scan your ingredients or type what you have and get instant recipe suggestions. Or just start cooking and let MamaAI watch and guide you in real time through Freestyle Mode.'
      ],
      tags: ['Computer Vision', 'Real Time AI', 'Recipe Engine', 'React'],
      url: 'https://mama-ai-mu.vercel.app/',
      icon: '👩‍🍳',
      featured: false,
      linkText: 'Live App'
    },
    {
      id: 'gutlens',
      name: 'GutLens',
      tagline: 'AI FODMAP Food Scanner for IBS',
      description: [
        'Born from a hospital visit and an IBS diagnosis. Point your camera at any food or scan a barcode to instantly know if it is safe for your IBS type, what a safe portion looks like, and how to lower flare risk. Built on Monash University FODMAP research. No accounts, no data collection.'
      ],
      tags: ['FODMAP', 'Barcode Scan', 'Monash Research', 'Privacy First'],
      url: 'https://gutlens.vercel.app/',
      icon: '🔬',
      featured: false,
      linkText: 'Live App'
    }
  ],

  certifications: [
    {
      id: 'cert-ml-spec',
      name: 'Machine Learning Specialization',
      issuer: 'Coursera',
      date: 'August 2024'
    },
    {
      id: 'cert-gen-ai',
      name: 'Generative AI for Everyone',
      issuer: 'Coursera',
      date: 'September 2024'
    },
    {
      id: 'cert-unsupervised',
      name: 'Unsupervised Learning, Recommender Systems & Reinforcement Learning',
      issuer: 'Coursera',
      date: 'August 2024'
    },
    {
      id: 'cert-math-ml',
      name: 'Mathematics for Machine Learning: Linear Algebra',
      issuer: 'Coursera',
      date: 'August 2024'
    },
    {
      id: 'cert-advanced',
      name: 'Advanced Learning Algorithms',
      issuer: 'Coursera',
      date: 'June 2024'
    },
    {
      id: 'cert-supervised',
      name: 'Supervised Machine Learning: Regression & Classification',
      issuer: 'Coursera',
      date: 'May 2024'
    },
    {
      id: 'cert-python-ml',
      name: 'Python for Machine Learning & Data Science Masterclass',
      issuer: 'Udemy',
      date: 'June 2024'
    }
  ],

  credentials: {}
};
