
const mongoose = require('mongoose');

const authorsHtml = `
<h2 style="font-style: italic; color: #00008b; font-family: 'Times New Roman', serif;"><strong>Instructions to Authors</strong></h2>
<p><strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong>, published under the aegis of KIET (Deemed to be University), Ghaziabad, accepts original research articles, review papers, technical notes, and short communications. Authors must strictly adhere to the following guidelines before submitting their manuscripts.</p>
<h3>1. General Formatting Guidelines</h3>
<ul>
<li><strong>Language:</strong> All manuscripts must be written in clear, concise, and grammatically correct English (US or UK spelling, consistent throughout).</li>
<li><strong>File Format:</strong> Submissions must be uploaded in Microsoft Word (.doc, .docx) or LaTeX (.tex) format along with a PDF copy.</li>
<li><strong>Page Layout:</strong> Standard A4 page size, single-column or double-column format with 1-inch margins on all sides, standard 12 pt Times New Roman font, and 1.5 line spacing.</li>
<li><strong>Length:</strong>
<ul>
<li>Original Research Papers: 6,000 to 10,000 words (including figures, tables, and references).</li>
<li>Review Articles: 8,000 to 12,000 words.</li>
<li>Short Communications / Case Studies: 3,000 to 5,000 words.</li>
</ul>
</li>
</ul>
<h3>2. Manuscript Structure</h3>
<p>Submitted manuscripts should generally be organized in the following order:</p>
<ul>
<li><strong>Title Page (Submitted separately for Double-Blind Review):</strong>
<ul>
<li>Concise and informative title (avoid abbreviations where possible).</li>
<li>Full author name(s), institutional affiliations, and email addresses.</li>
<li>Explicitly designate the Corresponding Author with full contact information and ORCID IDs (if available).</li>
</ul>
</li>
<li><strong>Main Manuscript (Anonymized for Review):</strong>
<ul>
<li>Title: Identical to the title page, without author details.</li>
<li>Abstract: A self-contained, structured abstract of 150–250 words outlining the objective, methodology, key findings, and conclusion.</li>
<li>Keywords: 4 to 6 relevant keywords listed alphabetically, separated by semicolons.</li>
<li>Main Body:
<ol>
<li>Introduction: Context, research gap, literature background, and objective.</li>
<li>Methodology / Theoretical Framework: Detailed technical formulation, algorithms, architecture, or mathematical proofs.</li>
<li>Results &amp; Discussion: Experimental validation, empirical data, tables, figures, and comparison with baseline models.</li>
<li>Conclusion &amp; Future Work: Summary of key outcomes and potential future research directions.</li>
</ol>
</li>
<li>Acknowledgments: Acknowledge funding agencies, institutional support from KIET (Deemed to be University) or partner bodies, and technical assistance (included only in the final post-acceptance version).</li>
<li>Conflict of Interest: Explicit statement disclosing any potential financial or personal competing interests.</li>
<li>References: Fully cited sources following IEEE referencing style.</li>
</ul>
</li>
</ul>
<h3>3. Mathematics, Figures, and Tables</h3>
<ul>
<li><strong>Mathematical Equations:</strong> Must be formatted using standard equation editors (MS Word Equation Editor or MathType) or LaTeX environment. Equations should be numbered sequentially in parentheses on the right margin.</li>
<li><strong>Figures &amp; Diagrams:</strong> High-resolution vector graphics or images (minimum 300 DPI in PNG, TIFF, or JPEG format). Figures must be cited sequentially in text (e.g., Figure 1) and include descriptive captions underneath.</li>
<li><strong>Tables:</strong> Created using the table feature in Word/LaTeX (do not embed tables as image files). Number tables sequentially (e.g., Table 1) with titles placed directly above the table.</li>
</ul>
<h3>4. Plagiarism &amp; Publication Ethics Policy</h3>
<p>IJAIQT and KIET (Deemed to be University) take academic integrity and ethical publishing very seriously:</p>
<ul>
<li><strong>Plagiarism Threshold:</strong> Every submission is screened via automated plagiarism software (e.g., Turnitin/iThenticate). Manuscripts with a similarity index exceeding 10-15% (excluding references) will be rejected immediately without review.</li>
<li><strong>Originality:</strong> Manuscripts submitted to IJAIQT must be original work not previously published or currently under peer review elsewhere.</li>
<li><strong>Duplicate/Simultaneous Submissions:</strong> Submitting the same manuscript to multiple journals simultaneously is considered severe misconduct and will result in immediate rejection and potential blacklisting.</li>
</ul>
<h3>5. Peer Review &amp; Final Submission Process</h3>
<ol>
<li><strong>Initial Screening:</strong> The Managing Editor evaluates submissions for scope alignment, formatting compliance, and similarity checks.</li>
<li><strong>Double-Blind Review:</strong> Anonymized manuscripts undergo evaluation by at least two domain expert reviewers.</li>
<li><strong>Decision &amp; Revisions:</strong> Authors receive editorial decisions (Accept, Minor Revision, Major Revision, or Reject) along with reviewer comments. Revised papers must be submitted within 15–30 days alongside a itemized point-by-point response sheet.</li>
<li><strong>Final Acceptance &amp; Copyright:</strong> Upon final acceptance, authors must submit the final camera-ready manuscript files, high-res figures, and a signed IJAIQT Copyright Transfer &amp; Author Consent Form.</li>
</ol>
`;

const homeWelcomeTitle = `Welcome to IJAIQT`;

const homeWelcomeText = `
<p><strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong> is an international, peer-reviewed, open-access journal managed and run by KIET (Deemed to be University), Delhi NCR, Ghaziabad, Uttar Pradesh.</p>
<p>The journal is dedicated to publishing high-quality, original research at the intersection of artificial intelligence, machine learning, and quantum computing paradigms. Supported by the academic rigor and technological vision of KIET (Deemed to be University), IJAIQT serves as a premier interdisciplinary forum for researchers, academicians, industry professionals, and engineers to exchange pioneering ideas, theoretical advancements, and practical applications.</p>
<p>IJAIQT is committed to maximizing the global exposure of scholarly research by offering unrestricted open access, ensuring that emerging scientific knowledge is accessible worldwide.</p>
<p><em>(Note: ISSN approval is currently pending. An official ISSN will be assigned upon publication of initial issues under the sponsorship of KIET (Deemed to be University).)</em></p>
<h3 class="font-bold text-lg mt-4 mb-2">Key Features & Quality Commitment</h3>
<ul class="list-disc pl-5 space-y-2">
<li><strong>Institutional Governance:</strong> Managed and published under the academic leadership and ethical framework of KIET (Deemed to be University), Delhi NCR, Ghaziabad.</li>
<li><strong>Double-Blind Peer Review:</strong> To ensure rigorous scientific evaluation, all submitted manuscripts undergo a double-blind peer-review process by an international technical review committee.</li>
<li><strong>Plagiarism & Publication Ethics:</strong> IJAIQT maintains strict standards against plagiarism and academic misconduct. Every submission is screened using advanced plagiarism detection software prior to review.</li>
<li><strong>Fast-Track Review:</strong> Rapid yet thorough peer review ensures timely feedback and publication without compromising scientific integrity.</li>
<li><strong>Global Outreach:</strong> Open access formatting guarantees maximum citations, readership, and visibility for published authors.</li>
</ul>
`;

const callForPapersHtml = `
<h2 style="font-style: italic; color: #00008b; font-family: 'Times New Roman', serif; font-size: 1.5rem;"><strong>Call for Papers — Upcoming Issue</strong></h2>
<p><strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong>, an official academic initiative run by KIET (Deemed to be University), Delhi NCR, Ghaziabad, Uttar Pradesh, invites original research articles, review papers, short communications, and case studies for its upcoming issue.</p>
<p>We welcome submissions showcasing theoretical breakthroughs, algorithmic designs, software implementations, hardware architectures, and real-world applications in Artificial Intelligence and Quantum Technologies.</p>

<h3 class="font-bold text-lg mt-4 mb-2">Submission Timeline & Process</h3>
<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;" class="my-4">
  <thead style="background-color: #fce4ce;">
    <tr>
      <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Event</th>
      <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Submission Deadline</td>
      <td style="padding: 8px; border: 1px solid #ddd;">25th of Every Month</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Notification of Acceptance</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Last Day of Every Month</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Final Camera-Ready Submission</td>
      <td style="padding: 8px; border: 1px solid #ddd;">3rd of Upcoming Month</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Online Publication</td>
      <td style="padding: 8px; border: 1px solid #ddd;">First Week of Upcoming Month</td>
    </tr>
  </tbody>
</table>

<h3 class="font-bold text-lg mt-4 mb-2">How to Submit</h3>
<p>Authors are invited to submit their original, unpublished research papers adhering to the official IJAIQT formatting guidelines.</p>
<ul class="list-disc pl-5 space-y-2 mb-4">
<li><strong>Managing University:</strong> KIET (Deemed to be University), Delhi NCR, Ghaziabad, UP, India</li>
<li><strong>Submission Email:</strong> <a href="mailto:editor.ijaiqt@kiet.edu">editor.ijaiqt@kiet.edu</a> / <a href="mailto:ijaiqteditor@gmail.com">ijaiqteditor@gmail.com</a></li>
<li><strong>Manuscript Format:</strong> Standard MS Word / LaTeX templates with double-blind reviewer compliance (author details removed for review).</li>
<li><strong>Originality Check:</strong> Submitted papers must not be under consideration by any other journal or conference.</li>
</ul>
`;

const topicsHtml = `
<h2 style="font-style: italic; color: #00008b; font-family: 'Times New Roman', serif; font-size: 1.5rem;"><strong>Topics Covered</strong></h2>
<p>The <strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong> covers a broad range of topics across computing and applied sciences, including but not limited to:</p>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 1: Artificial Intelligence & Machine Learning</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Deep Learning Architectures, Neural Networks, and Representation Learning</li>
<li>Natural Language Processing (NLP), Speech Processing, and Large Language Models (LLMs)</li>
<li>Computer Vision, Pattern Recognition, and Multimodal AI Systems</li>
<li>Reinforcement Learning, Autonomous Agents, and Swarm Intelligence</li>
<li>Explainable AI (XAI), Model Interpretability, Robustness, and Safety</li>
<li>Knowledge Graphs, Automated Reasoning, and Hybrid Neuro-Symbolic Systems</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 2: Quantum Computing & Information Science</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Quantum Algorithms, Circuit Synthesis, and Computational Complexity</li>
<li>Quantum Information Theory, Entanglement, and Quantum Teleportation</li>
<li>Quantum Error Correction, Fault-Tolerant Computing, and Surface Codes</li>
<li>Quantum Hardware Implementations (Superconducting, Trapped Ion, Photonic, Silicon Spin Qubits)</li>
<li>Quantum Metrology, High-Precision Quantum Sensors, and Sensing Networks</li>
<li>Quantum Cryptography, Quantum Key Distribution (QKD), and Post-Quantum Cryptography (PQC)</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 3: Synergistic Quantum AI & Quantum Machine Learning (QML)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Quantum Machine Learning (QML) Algorithms and Hybrid Quantum-Classical Frameworks</li>
<li>Variational Quantum Algorithms (VQE, QAOA) and Quantum Neural Networks (QNN)</li>
<li>Quantum Tensor Networks and Quantum Inspired Classical Algorithms</li>
<li>AI-Assisted Design, Calibration, and Control of Quantum Processors</li>
<li>Quantum Optimization for Complex Systems and Industrial Engineering</li>
<li>Benchmarking and Benchmarks for Quantum Hardware and Quantum Software Platforms</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 4: Computational Medicine, Genomics, and Healthcare (Multidisciplinary)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>AI and Quantum Algorithms for Drug Discovery, Molecular Docking, and Protein Folding</li>
<li>Quantum Computing in Computational Biology, Genomics, and Structural Bioinformatics</li>
<li>Medical Image Analytics, Diagnostic Decision Support Systems, and Surgical Robotics</li>
<li>Personalised Medicine, Disease Modeling, and Electronic Health Record (EHR) Mining</li>
<li>Quantum Sensing for In-Vivo Diagnostics and Advanced Biological Imaging</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 5: Smart Infrastructure, Energy, and Sustainable Engineering (Multidisciplinary)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>AI and Quantum Optimization for Smart Electrical Grids and Renewable Energy Integration</li>
<li>Autonomous Vehicles, Intelligent Transportation Systems (ITS), and Fleet Management</li>
<li>Sustainable AI, Energy-Efficient Hardware, and Green Quantum Computing Architectures</li>
<li>Predictive Maintenance, Structural Health Monitoring, and Smart Cities Infrastructure</li>
<li>Optimization of Supply Chains, Logistics Networks, and Urban Planning Systems</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 6: Materials Science, Chemistry, and Physics Simulations (Multidisciplinary)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Quantum Simulation of Novel Materials, High-Temperature Superconductors, and Battery Chemistries</li>
<li>Machine Learning Models for Material Property Prediction and Crystal Structure Synthesis</li>
<li>Molecular Dynamics Simulations using Hybrid Quantum-Classical Architectures</li>
<li>Computational Fluid Dynamics (CFD) Acceleration via AI and Quantum Solvers</li>
<li>Nanotechnology, Nanophotonics, and Quantum Material Interfaces</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 7: Finance, Fintech, and Socio-Economic Systems (Multidisciplinary)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Quantum and AI Models for Portfolio Optimization, Algorithmic Trading, and Asset Pricing</li>
<li>Fraud Detection, Anti-Money Laundering (AML), and Credit Risk Assessment</li>
<li>Computational Economics, Game Theory, and AI Agent-Based Market Simulations</li>
<li>Quantum-Resistant Financial Networks, Distributed Ledgers, and Blockchain Security</li>
<li>Quantitative Risk Analytics and Macroeconomic Forecasting Models</li>
</ul>

<h3 class="font-bold text-lg mt-4 mb-2 text-[#e67e22]">Track 8: Governance, Ethics, Policy, and Human-Technology Interaction (Multidisciplinary)</h3>
<ul class="list-disc pl-5 space-y-1 mb-4">
<li>Ethical AI, Bias Mitigation, Fairness, and Transparency in Automated Decision-Making</li>
<li>Legal Frameworks, Intellectual Property (IP), and Global Standards for AI and Quantum IP</li>
<li>Human-In-The-Loop Systems, Human-AI Collaboration, and Cognitive Ergonomics</li>
<li>Societal Impacts, Workforce Displacement, and Policy Formulation for Emerging Technologies</li>
<li>AI and Quantum Tech for Cyber Defense, National Security, and Global Governance</li>
</ul>
`;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/journalDB').then(async () => {
  const SiteSettings = require('./models/SiteSettings');
  let settings = await SiteSettings.findOne({});
  if (!settings) {
    settings = new SiteSettings();
  }
  
  settings.authorsHtml = authorsHtml;
  settings.homeWelcomeTitle = homeWelcomeTitle;
  settings.homeWelcomeText = homeWelcomeText;
  settings.callForPapersHtml = callForPapersHtml;
  settings.topicsHtml = topicsHtml;
  settings.footerText = '© Copyright 2024 International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT). Managed by KIET (Deemed to be University), Delhi NCR, Ghaziabad. All rights reserved.';
  
  await settings.save();
  console.log('Data injected successfully!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
