// Comprehensive Knowledge Corpus for Abhishek Gautam's RAG Chatbot

export const knowledgeChunks = [
  {
    id: 'bio-summary',
    title: 'Professional Bio & Career Overview',
    category: 'Bio',
    topics: ['bio', 'experience', 'summary', 'about', 'role', 'full stack', 'mern', 'location', 'contact'],
    content: `Abhishek Gautam is a Full Stack Developer (MERN Stack) with 3.5+ years of production experience delivering production-grade fintech and healthtech platforms independently.
Specializes in micro-frontend architecture with Vite Module Federation, multi-tenant MongoDB systems serving multiple enterprise tenants, and AWS-native cloud deployments across EC2, Lambda, ElastiCache, and KMS.
Proven track record owning end-to-end system design and implementation — from architecture decisions through live release — with strong async collaboration via GitHub, Jira, and documented technical specifications.
Comfortable working across time zones in async-first, globally distributed team environments.
Location: Jaipur, Rajasthan, India.
Contact: gautamabhishek0810@gmail.com | +918107659414.
Portfolio Website: https://abhishekgautam.vercel.app
LinkedIn: https://linkedin.com/in/abhishekgautam08
GitHub: https://github.com/abhishekgautam08`,
  },

  {
    id: 'exp-vivasvat-overview',
    title: 'Work Experience at Vivasvat Revolutions Limited (Fintech)',
    category: 'Experience',
    topics: ['vivasvat', 'fintech', 'experience', 'role', 'job', 'remote', 'work history'],
    content: `Company: Vivasvat Revolutions Limited
Role: Full Stack Developer
Period: 03/2024 – Present | Location: Remote
Context: Owned the entire technical stack across multiple fintech MERN applications — from architecture decisions through live release, establishing engineering standards, deployment pipelines, and system design patterns that scaled across products serving enterprise clients.
Shipped consistently on a two-week release cycle for 15+ months with zero P1 production incidents.
Tech Stack Used: React.js, Next.js, Node.js, Express.js, TypeScript, MongoDB, Vite Module Federation, Redis, AWS (EC2, S3, Lambda, API Gateway, Amplify, ElastiCache, KMS, CloudFront), Docker, Nginx, GitHub Actions, OpenAI API (GPT-4), Singzy API.`,
  },

  {
    id: 'exp-vivasvat-multitenant',
    title: 'Multi-Tenant MongoDB Architecture at Vivasvat Revolutions',
    category: 'Architecture',
    topics: ['multitenant', 'mongodb', 'database', 'tenant isolation', 'schema design', 'indexing', 'provisioning', 'vivasvat'],
    content: `Multi-Tenant Architecture Implementation by Abhishek Gautam:
• Built a multi-tenant MongoDB setup where each enterprise client's data stays completely isolated from others.
• Reduced new tenant provisioning time from 2–3 days to under 4 hours.
• Architecture details: Enforced tenant isolation via a Mongoose middleware layer that automatically injects tenantId into every query, insert, update, and delete operation from the authenticated JWT context.
• Database performance optimization: Rewrote slow aggregation queries and created compound indexes (such as { tenantId: 1, createdAt: -1 }) on all high-traffic collections, cutting query times from ~800ms to under 100ms.
• Added Redis caching and session management via AWS ElastiCache to offload reads from MongoDB Atlas.
• File isolation: Separate S3 prefixes per tenant and separate AWS KMS key aliases for encryption at rest per tenant.`,
  },

  {
    id: 'exp-vivasvat-microfrontends',
    title: 'Micro-Frontend Architecture with Vite Module Federation',
    category: 'Architecture',
    topics: ['micro-frontend', 'module federation', 'vite', 'frontend', 'architecture', 'react', 'vivasvat'],
    content: `Micro-Frontend Architecture by Abhishek Gautam:
• Architected and set up a micro-frontend architecture using Vite Module Federation across multiple fintech products (loan management dashboard, KYC portal, admin console).
• Enabled independent development and deployment of each module without monolithic release cycles, preventing cross-team release bottlenecks.
• Solved cross-module authentication and shared state: Stored tokens safely and implemented a custom event-based sync layer (custom window event + hook) so remotes react to auth changes without coupling to host internals.
• Solved shared dependency duplication: Configured shared dependencies (react, react-dom, react-router-dom) with 'singleton: true' and matching semver ranges to prevent duplicate runtime instances and 'Invalid hook call' errors.`,
  },

  {
    id: 'exp-vivasvat-security-kyc',
    title: 'Security, KYC Automation, and E-Signatures at Vivasvat',
    category: 'Security',
    topics: ['security', 'kyc', 'singzy', 'aadhaar', 'pan', 'kms', 'rbac', 'e-signature', 'vivasvat', 'fintech'],
    content: `Fintech Security & Automation Accomplishments:
• Automated KYC checks: Integrated Aadhaar and PAN verification via the Singzy API during user onboarding. Replaced a manual review process that previously took 24–48 hours, bringing approval down to under 3 minutes for automated verification.
• Regulatory compliance: Handled UIDAI OTP verification and tokenization regulations — ensured raw Aadhaar numbers are never permanently stored, storing tokenized references encrypted at the field level via AWS KMS.
• In-house E-Signature System: Built a custom e-signature system in-house for document signing and multi-level approval workflows, eliminating recurring subscription dependency on third-party services.
• Security & Auth: Implemented JWT-based authentication with fine-grained Role-Based Access Control (RBAC) and used AWS KMS for field-level encryption of sensitive financial data in MongoDB.`,
  },

  {
    id: 'exp-vivasvat-aws-devops',
    title: 'AWS Infrastructure, DevOps & Cost Audit at Vivasvat',
    category: 'Cloud & DevOps',
    topics: ['aws', 'devops', 'cost audit', 'ec2', 'lambda', 'elasticache', 'nginx', 'github actions', 'ci/cd', 'cloud savings'],
    content: `AWS Cloud Infrastructure & Cost Optimization:
• Managed full AWS infrastructure: EC2, S3, CloudFront, Lambda, API Gateway, Amplify, ElastiCache.
• Configured Nginx as a reverse proxy for EC2-hosted services handling SSL termination and routing across microservice endpoints.
• Setup GitHub Actions CI/CD pipelines across dev, staging, and production environments for automated testing and deployment.
• Cost Audit & Savings: Conducted an infrastructure cost audit. Right-sized over-provisioned EC2 instances (moving low-traffic t3.xlarge instances to t3.medium based on CloudWatch 30-day utilization metrics) and resolved Lambda cold start issues by bundling Puppeteer in a shared Lambda Layer and setting provisioned concurrency, cutting monthly cloud spend by 15–20%.
• Reduced engineer onboarding time by ~50% by authoring end-to-end microservices backend system design documentation.`,
  },

  {
    id: 'exp-vivasvat-ai-microservice',
    title: 'LLM Customer Support Microservice (GPT-4)',
    category: 'AI & LLM',
    topics: ['ai', 'gpt-4', 'openai', 'llm', 'microservice', 'customer support', 'vivasvat'],
    content: `LLM Microservice Built by Abhishek Gautam:
• Built a standalone Node.js customer support microservice powered by OpenAI API (GPT-4) to automate common fintech customer queries (loan status, KYC documentation requirements, onboarding steps).
• Deployed as a centralized, independent service reused across 3 distinct fintech products without duplicating infrastructure.
• Reliability & Guardrails: Designed strict system prompts with temperature=0 and contextual retrieval to eliminate hallucinations.
• Cost & Quota Control: Implemented per-tenant rate limiting using Redis counters (e.g., 500 AI queries/day per tenant) to keep OpenAI API costs predictable and prevent quota exhaustion.`,
  },

  {
    id: 'exp-vigorus-overview',
    title: 'Work Experience at Vigorus Healthtech Private Limited (Chikitsa)',
    category: 'Experience',
    topics: ['vigorus', 'chikitsa', 'healthtech', 'experience', 'job', 'onsite', 'jaipur', 'work history'],
    content: `Company: Vigorus Healthtech Private Limited (Chikitsa)
Role: Full Stack Developer
Period: 01/2023 – 03/2024 | Location: Jaipur • Onsite
Context: Built and maintained a full-stack healthtech platform for a growing clinical network. Delivered patient-facing and admin-facing features including prescription management, AI-powered clinical insights, and real-time IoT visualization.
Tech Stack: React.js, Node.js, Express.js, MongoDB, Puppeteer, AWS Rekognition, Fabric.js, AWS (EC2, S3, Lambda), WhatsApp API, RBAC, WebSockets.`,
  },

  {
    id: 'exp-vigorus-achievements',
    title: 'Healthtech Achievements at Vigorus (Chikitsa)',
    category: 'Healthtech',
    topics: ['puppeteer', 'whatsapp', 'pdf', 'qr code', 'check-in', 'rekognition', 'nlp', 'fabric.js', 'iot', 'rbac', 'vigorus'],
    content: `Key Achievements at Vigorus Healthtech (Chikitsa):
1. Automated Prescription PDF & WhatsApp Delivery: Built a Node.js + Puppeteer PDF generation system for prescriptions and appointment summaries with automated WhatsApp Business API delivery, processing 1,000+ documents/month with zero manual intervention. Used puppeteer-cluster to pool Chromium instances, reducing RAM usage from 7GB to under 500MB and preventing Lambda crashes.
2. QR-Based Appointment Check-In: Developed a QR-based appointment check-in system with real-time webcam scanning, improving on-site patient flow efficiency by ~30% and eliminating paper queues.
3. AI-Powered Prescription Analysis: Integrated AI-powered APIs (AWS Rekognition + custom NLP pipeline) to analyze handwritten prescriptions and lab reports, enabling accurate clinical insights and reducing doctor data-entry time by ~40%.
4. Role-Based Access Control (RBAC): Implemented RBAC in MongoDB across 5 distinct user roles (doctor, nurse, receptionist, admin, patient) enforcing HIPAA-compliant patient data security.
5. High-Availability AWS Setup: Configured and managed AWS infrastructure (EC2, S3, Lambda) with automated daily backups and multi-AZ failover.
6. IoT Canvas Visualizations: Built interactive canvas-based UI workflows using Fabric.js for IoT medical device data visualization and annotation, streaming real-time sensor feeds to clinical dashboards.`,
  },

  {
    id: 'skills-overview',
    title: 'Technical Skills Breakdown',
    category: 'Skills',
    topics: ['skills', 'tech stack', 'technologies', 'programming', 'languages', 'frontend', 'backend', 'cloud', 'database'],
    content: `Abhishek Gautam's Technical Skills:
• Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), Micro Frontends, Module Federation (Vite), Bootstrap, Material UI, HTML5 / CSS3, Tailwind CSS.
• Backend: Node.js, Express.js, TypeScript, REST APIs, GraphQL, Microservices, JWT, WebSockets.
• Database: MongoDB, Mongoose, PostgreSQL, SQL, Multi-Tenant Architecture, Aggregation Pipelines, Indexing Strategies, Redis.
• Cloud & DevOps: AWS (EC2, S3, Lambda, API Gateway, Amplify, ElastiCache, CloudFront), Docker, Nginx (Reverse Proxy & SSL), GitHub Actions, CI/CD pipelines.
• AI & Scripting: Python, FastAPI, OpenAI API (GPT-4), LLM Integration, AWS Rekognition.
• Security & Compliance: AWS KMS (Field-Level Encryption), Role-Based Access Control (RBAC), Aadhaar & PAN Verification APIs (Singzy), In-House E-Signature APIs.
• Async & Collaboration: GitHub, Jira, Postman, Swagger / OpenAPI, Notion, Agile / Scrum, Puppeteer, Fabric.js.`,
  },

  {
    id: 'certifications-education',
    title: 'Certifications and Education Credentials',
    category: 'Credentials',
    topics: ['certifications', 'certificates', 'education', 'degree', 'college', 'poornima', 'btech', 'udemy', 'namastedev'],
    content: `Education:
• Bachelor of Technology (B. Tech) — Poornima College of Engineering (2015 – 2019 | Jaipur, India).

Verified Professional Certifications (8 Total):
1. Namaste React — NamasteDev.com (Akshay Saini) (Credential ID: 87550561422401488783393 | Skills: React.js, Redux Toolkit, Tailwind CSS, Custom Hooks, Reconciliation).
2. The Complete 2022 Web Development Bootcamp — Udemy (Dr. Angela Yu) (Credential ID: UC-e0669168-abd3-40cb-b9ff-135ec4b575d7 | Skills: Full-Stack Web Development, Node, Express, MongoDB).
3. Namaste Node.js — NamasteDev.com (libuv, Event Loop, Streams, Buffers, Clustering, Microservices).
4. Namaste JavaScript — NamasteDev.com (Deep JS Mechanics, Execution Context, Closures, Prototypes, Event Loop).
5. Namaste DSA — NamasteDev.com (Data Structures & Algorithms, Problem Solving, Algorithmic Complexity).
6. Claude Code 101 — Anthropic (AI-assisted agentic software development workflows).
7. AWS Serverless Knowledge — Amazon Web Services (Serverless architecture, Lambda, API Gateway, event-driven cloud).
8. AWS Knowledge: Cloud Essentials — Amazon Web Services (Core AWS cloud services, infrastructure, and deployment).`,
  },

  {
    id: 'projects-summary',
    title: 'Key Portfolio Projects & Case Studies',
    category: 'Projects',
    topics: ['projects', 'portfolio', 'case studies', 'apps', 'fintech platform', 'chikitsa', 'e-signature', 'kyc'],
    content: `Abhishek Gautam's 8 Featured Engineering Case Studies:
1. Fintech Multi-Tenant Platform (React, Node, MongoDB, AWS, Redis): Production MERN app with complete tenant data isolation, sub-4hr provisioning, Vite micro-frontends, zero P1 incidents.
2. LLM Customer Support Microservice (Node.js, OpenAI GPT-4, Express, Lambda): Reusable support microservice across 3 fintech apps with strict hallucination-free prompts & Redis rate limits.
3. In-House E-Signature System (React, Node, MongoDB, AWS KMS, S3): Custom document signing & approval workflow eliminating third-party tools with KMS encryption.
4. KYC Automation (Node, Express, Singzy API, MongoDB, AWS KMS): Real-time Aadhaar & PAN verification automating user onboarding from 48 hours down to 3 minutes.
5. Healthtech Platform - Chikitsa (React, Node, MongoDB, AWS Rekognition, Fabric.js, Puppeteer): Complete clinic management system with prescription management, IoT dashboard, and RBAC.
6. Prescription PDF & WhatsApp Delivery (Node.js, Puppeteer, WhatsApp API, S3, Lambda): Automated PDF prescription generation & WhatsApp dispatch processing 1,000+ docs/month.
7. QR-Based Appointment Check-In (React, Node, MongoDB, WebSocket, QR Scanner): Real-time webcam check-in improving patient flow efficiency by 30%.
8. Micro-Frontend Architecture (Vite, Module Federation, React, TypeScript, GitHub Actions): Decoupled micro-frontend ecosystem enabling independent module deployment without monolithic release cycles.`,
  },

  {
    id: 'work-ethic-collab',
    title: 'Work Methodology, Async Collaboration & Team Culture',
    category: 'Culture',
    topics: ['async', 'collaboration', 'methodology', 'jira', 'github', 'remote', 'agile', 'scrum', 'time zones'],
    content: `Work Methodology and Collaboration Practices:
• Async-First Communication: Highly proficient in global distributed team environments. Uses GitHub PRs, Jira tickets, Notion specs, and Swagger/OpenAPI documentation to maintain momentum without constant synchronous meetings.
• Architectural Documentation: Author of technical design documents and architectural blueprints that halved new engineer onboarding time.
• Delivery Cadence: Shipped consistently on strict two-week release cycles across 15+ months with zero P1 production incidents.
• Cost & Quality Consciousness: Proactive about performance optimization (indexing slow queries, eliminating Lambda cold starts, right-sizing cloud infrastructure to save 15-20% on cloud spend).
• Security-First Mindset: Experienced handling sensitive financial and healthcare data with field-level KMS encryption, tokenization regulations, and role-based access control.`,
  }
];
