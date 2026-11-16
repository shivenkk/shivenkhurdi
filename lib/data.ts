
export const profile = {
  name: "Shiven Khurdi",
  firstName: "Shiven",
  lastName: "Khurdi",
  role: "AI Engineer",
  location: "Boston, MA",
  locationNote: "Open to relocate",
  status: "Founding AI Engineer Intern @ Interlock Systems · Harvard Innovation Labs",
  // One readable sentence for the hero.
  intro:
    "I build AI systems end to end and measure what they actually do, not what they’re supposed to.",
  introMeta: "Founding AI Engineer Intern at Interlock Systems (Harvard Innovation Labs) · M.S. AI at Northeastern · Boston, MA",
  // One line, shown while the site boots.
  bootLine: "Build the whole system. Measure what it actually does.",
  tagline:
    "I build AI systems from pretraining to production, from a language model trained from scratch to agents running inside a customer’s ERP, and I measure what they actually do rather than what they’re supposed to.",
  vision: {
    lines: ["How do you know", "a result is real?"],
    answer: ["Build it end to end.", "Then measure it honestly."],
    english: "Most of my work circles that one question.",
  },
  about: [
    "I’m a Master’s student in Artificial Intelligence at Northeastern University, and most of my work circles one question: how do you know a result is real. That applies whether the thing being measured is a model I trained or an agent about to write to someone’s database.",
    "I’ve built each layer at least once: a 394M-parameter language model pretrained from scratch (corpus, tokenizer, architecture, training loop), fine-tuning and quantization, retrieval, agents with tool use, constraint solvers, and the FastAPI, Docker, AWS, and Next.js work needed to put any of it in front of users.",
    "That 394M model, sqlpup, now has an official entry on the BIRD leaderboard, and AgentRelBench, my work on agent reliability, was accepted as a poster at a NeurIPS 2026 workshop. In both, the headline finding went against what I was hoping for. Right now I’m the Founding AI Engineer Intern at Interlock Systems (Harvard Innovation Labs), building agent automation and verification over customers’ production ERP systems. Before Boston, I earned my CS degree at BITS Pilani’s Dubai campus.",
  ],
};

export const socials = {
  email: "shiven.khurdi@gmail.com",
  phone: "+1 617 259 6437",
  phoneHref: "tel:+16172596437",
  linkedin: "https://www.linkedin.com/in/shivenkhurdi/",
  github: "https://github.com/shivenkk",
  resume: "/resume",
  resumeFile: "/Shiven_CV.pdf",
};

export type PosterArt =
  | "waveform"
  | "bars"
  | "scatter"
  | "rings"
  | "matrix"
  | "contour"
  | "flow"
  | "lattice";

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  date: string;
  category: string;
  tags: string[];
  affiliation?: string;
  blurb: string;
  description: string;
  highlights: string[];
  stack: string[];
  metric: { value: string; label: string };
  links: { code?: string; live?: string; paper?: string; openreview?: string; leaderboard?: string };
  art: PosterArt;
  hue: number;
};

export const projects: Project[] = [
  {
    id: "sqlpup",
    index: "01",
    title: "sqlpup",
    subtitle: "394M Text-to-SQL Model Built From Scratch",
    year: "2026",
    date: "2026 08.11",
    category: "LLM · Pretraining · Research",
    tags: ["LLM", "Pretraining", "Research"],
    blurb: "A language model built end to end for under $1,000.",
    description:
      "A 394M-parameter text-to-SQL decoder where every stage is built for this one task: a 9.67B-token corpus, a byte-level BPE tokenizer, a Llama-style GQA architecture, a preemption-safe 4-GPU training loop, a sandboxed execution-accuracy harness, and fine-tuning with SFT and GRPO over an execution reward. No pretrained weights anywhere in the stack.",
    highlights: [
      "Official BIRD leaderboard entry, scored by the BIRD team on the hidden test set: 33.15% execution accuracy with 7-sample voting, 27.33% single pass (dev: 23.51% and 19.23%)",
      "Fine-tuned identically, Qwen2.5-0.5B (matched non-embedding size, ~1,861× more pretraining data) beats sqlpup by 5.87 points on BIRD dev at greedy decoding; even with compaction and 7-sample voting, sqlpup’s SFT model only reached about Qwen’s plain greedy accuracy (22.84% vs 23.27%)",
      "Corpus, 32,768-entry tokenizer, and training loop all built from scratch, with exact-resume checkpointing that survives spot preemption",
      "Open source, shipped to PyPI and Hugging Face with 543 tests and CI",
    ],
    stack: ["PyTorch", "DDP", "GRPO", "Hugging Face", "AWS", "PyPI"],
    metric: { value: "33.15%", label: "BIRD test execution accuracy" },
    links: {
      code: "https://github.com/shivenkk/sqlpup",
      leaderboard: "https://bird-bench.github.io",
    },
    art: "waveform",
    hue: 258,
  },
  {
    id: "agentrelbench",
    index: "02",
    title: "AgentRelBench",
    subtitle: "Reliability Instrument for Action-Taking LLM Agents",
    year: "2026",
    date: "2026 08.15",
    category: "Agents · Evaluation · Research",
    tags: ["Agents", "Evaluation", "Research"],
    blurb: "Does an agent cause damage repeatably? Measured across 2,128 runs.",
    description:
      "An instrument that prices agent damage from database state diffs, deterministically and with no LLM judge anywhere in the measurement path, then measures whether that damage repeats across runs. Built over EnterpriseOps-Gym (ServiceNow AI Research and Mila).",
    highlights: [
      "Paper accepted as a poster at the NeurIPS 2026 workshop “Who Verifies the Agents? Toward Reliable Agent Development” (Sydney, December 2026)",
      "Pre-registered campaign of 2,128 runs across 20 tasks and nine models in six model families; no task caused damage on every run",
      "On the development pool, a single clean run missed a damage-producing (model, task) pair 80% of the time; one model family made a gated, irreversible change while claiming it had refused",
      "Demote criteria written before data collection fired against the intended headline, and that demotion is reported in the paper",
      "176 tests and one-command reproduction; preprint at arXiv:2608.15286, and the estimator core ships separately as evalpower, a zero-dependency library",
    ],
    stack: ["Python", "Clopper-Pearson", "Docker", "Pre-registration", "CI"],
    metric: { value: "2,128", label: "pre-registered agent runs" },
    links: {
      code: "https://github.com/shivenkk/agentrelbench",
      paper: "https://arxiv.org/abs/2608.15286",
      openreview: "https://openreview.net/forum?id=eQH5SQYour",
    },
    art: "matrix",
    hue: 350,
  },
  {
    id: "modelrouter",
    index: "03",
    title: "ModelRouter",
    subtitle: "Multi-Model Inference Cost Optimizer",
    year: "2026",
    date: "2026 04.02",
    category: "LLM Systems",
    tags: ["LLM", "Systems", "AWS"],
    blurb: "Routes each query to the cheapest model that can still answer it.",
    description:
      "A routing layer that scores each query’s difficulty with a fine-tuned DistilBERT and sends it to the cheapest of Llama 8B, Llama 70B (Groq), or Claude Sonnet 4 (Bedrock) that can handle it.",
    highlights: [
      "Fine-tuned DistilBERT difficulty classifier: 96% accuracy at 30ms inference",
      "Multi-factor routing engine scoring models on quality, cost, latency & success rate",
      "58.6% measured cost savings vs an all-Tier-3 baseline across 24 live routed queries, zero errors",
      "FastAPI on AWS (EC2, ECR, S3, Bedrock) + Docker, React dashboard, LLM-as-judge eval, GitHub Actions CI/CD",
    ],
    stack: ["DistilBERT", "FastAPI", "AWS Bedrock", "Groq", "Docker", "CI/CD"],
    metric: { value: "58.6%", label: "inference cost saved" },
    links: { code: "https://github.com/shivenkk/modelrouter" },
    art: "flow",
    hue: 188,
  },
  {
    id: "reproagent",
    index: "04",
    title: "ReproAgent",
    subtitle: "ML Paper Reproducibility Analysis",
    year: "2026",
    date: "2026 03.11",
    category: "Multi-Agent AI",
    tags: ["Agents", "LLM", "Full-Stack"],
    blurb: "A multi-agent system that turns arXiv papers into runnable code.",
    description:
      "A multi-agent AI system that parses arXiv papers, extracts training methodology with per-field confidence scoring, and generates self-contained PyTorch scripts using Llama 3.3 70B via Groq.",
    highlights: [
      "Keyword-density chunking to prioritize experiment-heavy sections within token budgets",
      "0.91 average extraction confidence across parsed papers",
      "Reproducibility scores of 94.3 (ResNet) and 89.1 (Attention Is All You Need)",
      "Shipped full-stack with FastAPI + Next.js",
    ],
    stack: ["Multi-Agent", "Llama 3.3 70B", "Groq", "FastAPI", "Next.js"],
    metric: { value: "0.91", label: "extraction confidence" },
    links: { code: "https://github.com/shivenkk/repro-agent" },
    art: "lattice",
    hue: 36,
  },
  {
    id: "calibratedreturns",
    index: "05",
    title: "CalibratedReturns",
    subtitle: "Stock Predictions with Coverage Guarantees",
    year: "2026",
    date: "2026 02.19",
    category: "ML · Quant Finance",
    tags: ["ML", "Statistics", "Full-Stack"],
    blurb: "Return forecasts with a coverage guarantee.",
    description:
      "A conformal-prediction model that outputs 5-day return intervals with a coverage guarantee, trained on 20+ engineered features and checked against 3,755 backtested predictions.",
    highlights: [
      "Quantile regression over 20+ engineered features",
      "92.3% empirical coverage across 3,755 backtested predictions",
      "Full-stack app (FastAPI + React) deployed on Render and Vercel",
      "Live stock-ticker analysis with calibrated uncertainty",
    ],
    stack: ["Conformal Prediction", "Quantile Regression", "FastAPI", "React"],
    metric: { value: "92.3%", label: "empirical coverage" },
    links: { code: "https://github.com/shivenkk/calibrated-returns" },
    art: "bars",
    hue: 140,
  },
  {
    id: "volleyball",
    index: "06",
    title: "Group Activity Recognition",
    subtitle: "Volleyball Video Analysis & Rally Prediction",
    year: "2025",
    date: "2025 04.22",
    category: "Computer Vision · DL",
    tags: ["Computer Vision", "Deep Learning"],
    affiliation: "Northeastern University",
    blurb: "Hierarchical multi-task deep learning on raw sports video.",
    description:
      "A hierarchical multi-task deep-learning system for volleyball video that jointly predicts individual actions, group activities, and rally outcomes by combining AlexNet features, BiLSTM temporal modeling, self-attention, and a Spatio-Temporal GCN.",
    highlights: [
      "Jointly predicts 9 player actions, 8 group activities, and rally outcomes across 1,337 clips",
      "73.90% rally accuracy, +24.4 pts over the heuristic baseline (49.51% to 73.90%)",
      "Weighted multi-task loss (Focal + Margin Ranking + MSE) with class re-weighting",
      "Mixed-precision PyTorch training on a 56K-instance imbalanced dataset",
    ],
    stack: ["PyTorch", "BiLSTM", "Self-Attention", "ST-GCN", "Computer Vision"],
    metric: { value: "73.9%", label: "rally prediction accuracy" },
    links: { code: "https://github.com/ethanwong05/FAI_VolleyballAnalyzer" },
    art: "scatter",
    hue: 12,
  },
];

export const archivedProjects: Project[] = [
  {
    id: "nyc-taxi",
    index: "06",
    title: "NYC Taxi Demand",
    subtitle: "City-Scale Spatiotemporal Forecasting",
    year: "2025",
    date: "2025 11.30",
    category: "ML · Forecasting",
    tags: ["ML", "Forecasting"],
    affiliation: "Northeastern University",
    blurb: "Well-engineered features beating deep nets at city scale.",
    description:
      "An end-to-end ML pipeline forecasting hourly taxi demand across 258 NYC zones from 2.9M trip records, showing that well-engineered features can outweigh model complexity for structured spatiotemporal data.",
    highlights: [
      "Engineered 21 temporal features over 2.9M records across 258 NYC zones",
      "Benchmarked 5 architectures (incl. DNN, LSTM) to find the optimal model",
      "0.958 R² with XGBoost, outperforming DNN/LSTM baselines by 10.8%",
    ],
    stack: ["XGBoost", "Python", "Pandas", "Feature Engineering", "Time Series"],
    metric: { value: "0.958", label: "R² with XGBoost" },
    links: { code: "https://github.com/shivenkk/nyc-taxi-demand-prediction" },
    art: "contour",
    hue: 48,
  },
  {
    id: "qlora",
    index: "08",
    title: "QLoRA Fine-Tuning",
    subtitle: "Efficient Llama-2 Tuning Under Constraints",
    year: "2024",
    date: "2024 05.10",
    category: "LLM · Research",
    tags: ["LLM", "Research", "Fine-Tuning"],
    affiliation: "Undergraduate research · BITS Pilani Dubai",
    blurb: "Fine-tuning a 7B model on a single T4.",
    description:
      "Efficient fine-tuning of Llama-2 under tight resource constraints using QLoRA + PEFT, with 4-bit quantization to shrink memory while preserving conversational quality, benchmarked against full fine-tuning and deployed to Hugging Face.",
    highlights: [
      "Fine-tuned Llama-2 with QLoRA + PEFT on the Guanaco dataset",
      "4-bit quantization, trained on a single T4 GPU",
      "BLEU 0.5-0.7 on conversational tasks; benchmarked vs full fine-tuning",
      "Deployed the chatbot model to the Hugging Face Hub",
    ],
    stack: ["Llama-2", "QLoRA", "PEFT", "4-bit Quantization", "Hugging Face"],
    metric: { value: "4-bit", label: "Llama-2 7B on one T4" },
    links: { code: "https://github.com/shivenkk/Llama2-7b-guanaco" },
    art: "rings",
    hue: 280,
  },
];

export type Experience = {
  id: string;
  role: string;
  company: string;
  short: string;
  logo: string;
  plate?: "light" | "dark";
  context?: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  stats: string[];
  points: string[];
  hue: number;
};

export const experience: Experience[] = [
  {
    id: "interlock",
    role: "Founding AI Engineer Intern",
    company: "Interlock Systems Inc.",
    short: "Interlock",
    logo: "/logos/interlock.png",
    plate: "dark",
    context: "Harvard Innovation Labs",
    location: "Boston, MA",
    period: "Jun 2026 - Present",
    current: true,
    summary:
      "Agents and constraint solvers over customers’ production ERP systems, with every write reversible and every result measured.",
    stats: ["97.5% routing accuracy", "400 tests", "on-prem, no data leaves"],
    points: [
      "Shipped an on-prem application over a manufacturing customer’s production ERP. Their project managers now use it daily to reschedule deliveries and revise work orders, replacing hours of manual ERP screen work, with every write reversible through a logged undo verified against the live database.",
      "Designed its natural-language search so the model routes a request but never computes the answer, which means a wrong number cannot ship silently: 97.5% routing accuracy, certified on the production box, model running locally with no customer data leaving the building.",
      "Built a turnaround-planning optimizer for a Fortune-500 manufacturer: CP-SAT scope and schedule solvers over customer planning workbooks, plus an LLM copilot that turns plain English into a typed constraint, re-solves, and returns a measured before/after receipt for human approval. 400 tests.",
      "Built the agent capabilities and integrations for a multi-agent platform that extracts data from engineering documentation (drawings, CAD, BOMs) and executes actions in customer ERP/MRP systems, plus the evaluation harnesses that measure it across extraction, reasoning, and tool-use tasks.",
    ],
    hue: 258,
  },
  {
    id: "odex",
    role: "Web Development Intern",
    company: "ODeX Global",
    short: "ODeX",
    logo: "/logos/odex-cut.png",
    location: "Dubai, UAE",
    period: "Aug 2024 - Jan 2025",
    summary:
      "Six months inside a logistics platform’s React front end, from bug backlog to a full operations dashboard.",
    stats: ["500+ bugs resolved", "100+ form components", "ops dashboard"],
    points: [
      "Resolved 500+ frontend bugs across the logistics platform over six months, improving UI consistency and reducing the QA backlog.",
      "Built 100+ dynamic form components and an operations dashboard from scratch in React.js for the operations team.",
    ],
    hue: 200,
  },
  {
    id: "bits",
    role: "Undergraduate Research Assistant",
    company: "BITS Pilani, Dubai Campus",
    short: "Undergrad Research",
    logo: "/logos/bits-cut.png",
    location: "Dubai, UAE",
    period: "Feb 2024 - May 2024",
    summary:
      "Two research tracks: efficient LLM fine-tuning under resource limits, and medical computer vision on MRI.",
    stats: ["Llama-2 7B on one T4", "BLEU 0.5-0.7", "98% MRI accuracy"],
    points: [
      "Researched efficient LLM fine-tuning under resource constraints (QLoRA, PEFT); fine-tuned Llama-2 7B with 4-bit quantization on a single T4 GPU (BLEU 0.5-0.7), benchmarked it against full fine-tuning, and deployed the model to Hugging Face.",
      "Ran a second research track in medical computer vision under a separate faculty advisor: brain-tumor detection and localization from MRI with ResNet + ResUNet, reaching 98% accuracy, and authored a technical report.",
    ],
    hue: 30,
  },
  {
    id: "tendercare",
    role: "Engineer Intern",
    company: "Tendercare FZE",
    short: "Tendercare",
    logo: "/logos/tendercare-cut.png",
    location: "Dubai, UAE",
    period: "Jun 2023 - Aug 2023",
    summary:
      "A first full-time internship, split between web development and video production.",
    stats: ["web development", "video production"],
    points: [
      "Web development and video production for the company’s website and marketing.",
    ],
    hue: 150,
  },
];

export type Education = {
  school: string;
  logo: string;
  degree: string;
  detail: string;
  location: string;
  period: string;
  gpa: string;
  coursework: string[];
};

export const education: Education[] = [
  {
    school: "Northeastern University",
    logo: "/logos/northeastern.jpg",
    degree: "M.S. Artificial Intelligence",
    detail: "Graduate study",
    location: "Boston, MA",
    period: "Jan 2025 - Apr 2027",
    gpa: "GPA 3.9",
    coursework: [
      "Foundations of AI",
      "Machine Learning",
      "Computer Vision & Pattern Recognition",
      "Algorithms",
      "Program Design Paradigm",
      "Cybersecurity",
      "AI Capstone",
    ],
  },
  {
    school: "BITS Pilani, Dubai Campus",
    logo: "/logos/bits-cut.png",
    degree: "B.E. Computer Science",
    detail: "Undergraduate",
    location: "Dubai, UAE",
    period: "Jan 2021 - Jan 2025",
    gpa: "GPA 8.22",
    coursework: [
      "Deep Learning",
      "Data Mining",
      "Natural Language Processing",
      "Optimization",
      "Artificial Intelligence",
      "Foundations of Data Science",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "SQL", "Java", "C++", "JavaScript", "Bash / Shell"],
  },
  {
    group: "ML & Deep Learning",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "XGBoost",
      "Hugging Face Transformers",
      "Pretraining from Scratch",
      "Distributed Training (DDP)",
      "GRPO / RLHF",
      "Tokenizers",
      "LLM Fine-tuning",
      "RAG",
      "NLP",
      "Generative AI",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "LLM Evaluation",
      "Reinforcement Learning",
    ],
  },
  {
    group: "Tools & Cloud",
    items: [
      "Docker",
      "AWS (EC2, ECR, S3, Bedrock)",
      "FastAPI",
      "Git",
      "Linux",
      "MLflow",
      "Weights & Biases",
      "OR-Tools CP-SAT",
      "Ollama",
      "GitHub Actions CI/CD",
    ],
  },
  {
    group: "Libraries & Data",
    items: [
      "NumPy",
      "Pandas",
      "Matplotlib",
      "OpenCV",
      "LangChain",
      "FAISS",
      "PostgreSQL",
      "SQLAlchemy",
      "MongoDB",
      "React.js",
      "Next.js",
    ],
  },
];

// Short feed shown in the hero HUD and on /about.
export const updates: { date: string; title: string; href?: string }[] = [
  {
    date: "2026 SEP",
    title: "AgentRelBench paper accepted as a poster at a NeurIPS 2026 workshop",
    href: "https://openreview.net/forum?id=eQH5SQYour",
  },
  {
    date: "2026 AUG",
    title: "AgentRelBench preprint is up on arXiv (2608.15286)",
    href: "https://arxiv.org/abs/2608.15286",
  },
  {
    date: "2026 AUG",
    title: "sqlpup released on PyPI and Hugging Face; 33.15% on the official BIRD leaderboard (hidden test set)",
    href: "https://github.com/shivenkk/sqlpup",
  },
  {
    date: "2026 JUN",
    title: "Joined Interlock Systems (Harvard Innovation Labs) as Founding AI Engineer Intern",
  },
];

export const affiliations: { name: string; logo: string; note: string; plate?: "light" | "dark" }[] = [
  { name: "Interlock Systems", logo: "/logos/interlock.png", note: "Founding AI Engineer Intern", plate: "dark" },
  { name: "Northeastern University", logo: "/logos/northeastern.jpg", note: "M.S. AI" },
  { name: "BITS Pilani, Dubai", logo: "/logos/bits-cut.png", note: "B.E. CS" },
  { name: "ODeX Global", logo: "/logos/odex-cut.png", note: "Web Dev Intern" },
  { name: "Tendercare FZE", logo: "/logos/tendercare-cut.png", note: "Engineer Intern" },
];

export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export const homeSections = [
  { id: "hero", label: "HOME" },
  { id: "work", label: "WORK" },
  { id: "vision", label: "APPROACH" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "education", label: "EDUCATION" },
  { id: "outro", label: "CONTACT" },
] as const;

export type SectionId = (typeof homeSections)[number]["id"];
