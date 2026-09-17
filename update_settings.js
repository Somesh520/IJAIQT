const mongoose = require('mongoose');
const SiteSettings = require('./backend/models/SiteSettings');
require('dotenv').config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/college_journal';

const newScopeText = `
<ul>
  <li><strong>Institutional Governance:</strong> Managed and published under the academic leadership and ethical framework of KIET (Deemed to be University), Delhi NCR, Ghaziabad.</li>
  <li><strong>Double-Blind Peer Review:</strong> To ensure rigorous and unbiased scientific evaluation, all submitted manuscripts undergo a double-blind peer-review process conducted by an international technical review committee.</li>
  <li><strong>Plagiarism & Publication Ethics:</strong> IJAIQT maintains strict standards against plagiarism and academic misconduct. Every submission is screened using plagiarism-detection software prior to the review process.</li>
  <li><strong>Fast-Track Review:</strong> A rapid yet thorough peer-review process ensures timely feedback and publication while maintaining scientific integrity and quality standards.</li>
  <li><strong>Global Outreach:</strong> The open-access publishing model promotes the worldwide accessibility and dissemination of published scholarly research.</li>
</ul>
`;

async function update() {
  await mongoose.connect(MONGO_URI);
  const settings = await SiteSettings.findOne() || new SiteSettings();
  
  // The user said "welcome text box" but the text provided is clearly the Key Features / Quality Commitment
  // I will update the scopeText (Key Features) since that's where it logically belongs and where it was before,
  // but if the user literally meant the welcome text box, I'll update scopeText anyway because that's the title they provided in the prompt text.
  // Wait, let me just update scopeText.
  settings.scopeText = newScopeText;
  
  await settings.save();
  console.log("Settings updated successfully!");
  process.exit(0);
}

update().catch(console.error);
