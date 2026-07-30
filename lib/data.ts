// ============================================================
//  CONTENT: single source of truth for the site.
//  Update copy, links, and metrics here.
// ============================================================

export const profile = {
  name: "Shiven Khurdi",
  firstName: "Shiven",
  lastName: "Khurdi",
  role: "AI Engineer",
  location: "Boston, MA",
  locationNote: "Open to relocate",
  status: "AI Engineer @ Interlock Systems · Harvard Innovation Labs",
  tagline:
    "I design and ship AI systems across LLMs, multi-agent platforms, and computer-vision pipelines, built to hold up in production.",
  about: [
    "I’m a Master’s student in Artificial Intelligence at Northeastern University, focused on building LLM and multi-agent systems that are reliable, cost-aware, and grounded in real evaluation, not just demos.",
    "My work spans the modern AI stack: fine-tuning and quantization (QLoRA, PEFT), retrieval and RAG, agentic tool-use, conformal prediction, and computer vision, paired with the engineering to ship it, from FastAPI services and Dockerized AWS deployments to React and Next.js dashboards.",
    "Right now I’m an AI Engineer at Interlock Systems (Harvard Innovation Labs), building computer-vision verification and multi-agent automation for engineering workflows. Before Boston, I earned my CS degree at BITS Pilani’s Dubai campus.",
  ],
};

export const socials = {
  email: "shiven.khurdi@gmail.com",
  phone: "+1 617 259 6437",
  phoneHref: "tel:+16172596437",
  linkedin: "https://www.linkedin.com/in/shivenkhurdi/",
  github: "https://github.com/shivenkk",
  // Résumé links point at a real page, not the raw PDF: browsers with their
  // built-in PDF viewer disabled or blocked render a blank tab for a direct
  // .pdf URL. /resume embeds the file and always offers open/download.
  resume: "/resume",
  resumeFile: "/Shiven_CV.pdf",
};

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  affiliation?: string;
  blurb: string;
  description: string;
  highlights: string[];
  stack: string[];
  metric: { value: string; label: string };
  links: { code?: string; live?: string };
};

export const projects: Project[] = [
  {
    id: "modelrouter",
    index: "01",
    title: "ModelRouter",
    subtitle: "Multi-Model Inference Cost Optimizer",
    year: "2026",
    category: "LLM Systems",
    blurb: "Routes each query to the cheapest model that can still answer it.",
    description:
      "An intelligent LLM routing system that classifies query difficulty with a fine-tuned DistilBERT and dispatches across Llama 8B / 70B (Groq) and Claude Sonnet 4 (AWS Bedrock), cutting spend without dropping quality.",
    highlights: [
      "Fine-tuned DistilBERT difficulty classifier: 96% accuracy at 30ms inference",
      "Multi-factor routing engine scoring models on quality, cost, latency & success rate",
      "58.6% measured cost savings vs an all-Tier-3 baseline across 24 live routed queries, zero errors",
      "FastAPI on AWS (EC2, ECR, S3, Bedrock) + Docker, React dashboard, LLM-as-judge eval, GitHub Actions CI/CD",
    ],
    stack: ["DistilBERT", "FastAPI", "AWS Bedrock", "Groq", "Docker", "CI/CD"],
    metric: { value: "58.6%", label: "inference cost saved" },
    links: { code: "https://github.com/shivenkk/modelrouter" },
  },
  {
    id: "reproagent",
    index: "02",
    title: "ReproAgent",
    subtitle: "ML Paper Reproducibility Analysis",
    year: "2026",
    category: "Multi-Agent AI",
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
  },
  {
    id: "calibratedreturns",
    index: "03",
    title: "CalibratedReturns",
    subtitle: "Stock Predictions with Coverage Guarantees",
    year: "2026",
    category: "ML · Quant Finance",
    blurb: "Return forecasts that come with a statistical promise.",
    description:
      "A conformal-prediction system outputting 5-day return intervals with formal coverage guarantees, enabling risk-aware portfolio decisions. Trained on 20+ engineered features and validated across thousands of backtests.",
    highlights: [
      "Quantile regression over 20+ engineered features",
      "92.3% empirical coverage across 3,755 backtested predictions",
      "Full-stack app (FastAPI + React) deployed on Render and Vercel",
      "Live stock-ticker analysis with calibrated uncertainty",
    ],
    stack: ["Conformal Prediction", "Quantile Regression", "FastAPI", "React"],
    metric: { value: "92.3%", label: "empirical coverage" },
    links: { code: "https://github.com/shivenkk/calibrated-returns" },
  },
  {
    id: "nyc-taxi",
    index: "04",
    title: "NYC Taxi Demand",
    subtitle: "City-Scale Spatiotemporal Forecasting",
    year: "2025",
    category: "ML · Forecasting",
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
  },
  {
    id: "volleyball",
    index: "05",
    title: "Group Activity Recognition",
    subtitle: "Volleyball Video Analysis & Rally Prediction",
    year: "2025",
    category: "Computer Vision · DL",
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
  },
  {
    id: "qlora",
    index: "06",
    title: "QLoRA Fine-Tuning",
    subtitle: "Efficient Llama-2 Tuning Under Constraints",
    year: "2024",
    category: "LLM · Research",
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
  },
];

export type Experience = {
  role: string;
  company: string;
  logo: string;
  context?: string;
  location: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Artificial Intelligence Engineer",
    company: "Interlock Systems Inc.",
    logo: "/logos/interlock-cut.png",
    context: "Internship · Harvard Innovation Labs",
    location: "Boston, MA",
    period: "Jun 2026 - Present",
    current: true,
    points: [
      "Building a computer-vision pipeline that flags placement, orientation, and sizing discrepancies between technical design files and their specs, using a fine-tuned object detector with a deterministic verification layer that abstains under uncertainty instead of emitting a false verdict.",
      "Developing agent capabilities, prompts, and integrations for a multi-agent platform that extracts data from engineering documentation (drawings, CAD, BOMs) and autonomously executes actions in customer ERP/MRP systems.",
      "Building evaluation harnesses and benchmarks measuring agent performance across extraction, reasoning, and tool-use tasks.",
    ],
  },
  {
    role: "Web Development Intern",
    company: "ODeX Global",
    logo: "/logos/odex-cut.png",
    location: "Dubai, UAE",
    period: "Aug 2024 - Jan 2025",
    points: [
      "Resolved 500+ frontend bugs across the logistics platform over six months, improving UI consistency and reducing the QA backlog.",
      "Built 100+ dynamic form components and a comprehensive operations dashboard from scratch in React.js, streamlining internal workflows for the operations team.",
    ],
  },
  {
    role: "Undergraduate Research Assistant",
    company: "BITS Pilani, Dubai Campus",
    logo: "/logos/bits-cut.png",
    location: "Dubai, UAE",
    period: "Feb 2024 - May 2024",
    points: [
      "Researched efficient LLM fine-tuning under resource constraints (QLoRA, PEFT); fine-tuned Llama-2 7B with 4-bit quantization on a single T4 GPU (BLEU 0.5-0.7), benchmarked it against full fine-tuning, and deployed the model to Hugging Face.",
      "Ran a second research track in medical computer vision under a separate faculty advisor: brain-tumor detection and localization from MRI with ResNet + ResUNet, reaching 98% accuracy, and authored a technical report.",
    ],
  },
  {
    role: "Engineer Intern",
    company: "Tendercare FZE",
    logo: "/logos/tendercare-cut.png",
    location: "Dubai, UAE",
    period: "Jun 2023 - Aug 2023",
    points: [
      "Early full-time engineering internship spanning web development and video production for the company’s digital presence.",
    ],
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
    period: "Jan 2025 - Present",
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
      "MongoDB",
      "React.js",
      "Next.js",
    ],
  },
];

// Words for the scrolling marquee band
export const marqueeWords = [
  "LLM Systems",
  "Multi-Agent",
  "RAG",
  "Computer Vision",
  "Fine-Tuning",
  "Generative AI",
  "PyTorch",
  "AWS",
  "FastAPI",
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];
