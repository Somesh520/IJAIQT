require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');

const reviewProcessHtml = `
<h1 class="text-2xl font-bold text-[#000033] mb-6">Peer-Review Process</h1>
<p class="mb-6">
  The peer-review process of the <strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong> follows a rigorous <strong>Double-Blind Peer Review</strong> model to ensure academic integrity, impartiality, and high scientific standards.
</p>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">1. Initial Desk Review & Pre-Screening</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Format & Scope Check:</strong> Upon submission, the Managing Editor conducts an initial review to verify that the manuscript aligns with the journal’s scope, adheres to the IEEE template and citation format, and includes a Data Availability Statement.</li>
  <li><strong>Plagiarism & Ethics Check:</strong> Submissions are screened using plagiarism detection software. Manuscripts with significant overlap or ethical issues are rejected immediately (Desk Reject).</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">2. Double-Blind Peer Review</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Anonymization:</strong> Both author identities and reviewer details are hidden throughout the evaluation process.</li>
  <li><strong>Reviewer Assignment:</strong> The Associate Editor assigns the manuscript to a minimum of <strong>two to three independent domain experts.</strong></li>
  <li><strong>Evaluation Criteria:</strong> Reviewers evaluate the manuscript based on:
    <ul class="list-disc pl-6 mt-2 space-y-1" style="list-style-type: circle;">
      <li>Originality and scientific novelty.</li>
      <li>Technical soundness and correctness of mathematical/quantum formulations.</li>
      <li>Quality of experimental results and baseline comparisons.</li>
      <li>Clarity of writing, structure, and adherence to IEEE citation standards.</li>
    </ul>
  </li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">3. Editorial Decision</h2>
<p class="mb-3">
  Based on reviewer feedback and recommendations, the Handling Editor makes one of the following decisions:
</p>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Accept As-Is:</strong> The manuscript is accepted without modifications.</li>
  <li><strong>Minor Revisions:</strong> Authors must address minor technical or formatting comments within a specified deadline (e.g., 1–2 weeks).</li>
  <li><strong>Major Revisions:</strong> The manuscript requires substantial technical improvements, additional experiments, or rewritten sections. Revised submissions undergo a second round of review.</li>
  <li><strong>Reject:</strong> The manuscript does not meet the journal’s standards or contains critical scientific flaws.</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">4. Revision & Final Recommendation</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li>Authors submitting revised manuscripts must include a detailed <strong>Point-by-Point Response to Reviewers.</strong></li>
  <li>The Handling Editor verifies whether all reviewer comments have been adequately addressed before granting final acceptance.</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">5. Camera-Ready & Production</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Accepted Manuscripts:</strong> Authors are requested to submit the final <strong>Camera-Ready file</strong> including complete author details, affiliations, and the signed <strong>Copyright Transfer Form.</strong></li>
  <li><strong>Proofreading & Publication:</strong> The manuscript undergoes copyediting, layout checks, and assigning of publication metadata before online release.</li>
</ul>
`;

const ethicsHtml = `
<h1 class="text-2xl font-bold text-[#000033] mb-6">Publication Ethics and Research Integrity</h1>
<p class="mb-6">
  The <strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong> is committed to upholding the highest standards of publication ethics and research integrity. All parties involved in the publication process—authors, editors, peer reviewers, and the publisher—are expected to adhere to the following ethical guidelines.
</p>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">1. Duties and Responsibilities of Authors</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Originality and Authenticity:</strong> Authors must ensure that submitted manuscripts are entirely original works. Any ideas, data, or text derived from prior studies must be properly acknowledged and cited using the required IEEE format.</li>
  <li><strong>Plagiarism and Fabrication:</strong> Plagiarism in any form—including direct copying, self-plagiarism (text recycling), data fabrication, or image manipulation—is strictly prohibited and constitutes grounds for immediate rejection.</li>
  <li><strong>Simultaneous Submission:</strong> Authors must not submit the same manuscript to more than one journal or conference concurrently.</li>
  <li><strong>Authorship Attribution:</strong> Authorship should be limited to individuals who made significant intellectual contributions to the study's conception, design, execution, or interpretation. All co-authors must approve the final version of the manuscript and consent to its submission.</li>
  <li><strong>Data Transparency and Integrity:</strong> Authors must present an accurate account of the research performed and an objective discussion of its significance. Underlying datasets must be made available where required, in accordance with the journal’s Data Availability Statement policy.</li>
  <li><strong>Disclosure and Conflicts of Interest:</strong> Authors must disclose any financial, personal, or institutional conflicts of interest that could be perceived as biasing the results or interpretation of their work.</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">2. Duties and Responsibilities of Editors</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Fairness and Objectivity:</strong> Editors evaluate manuscripts solely on their academic merit, technical quality, relevance to the journal’s scope, and adherence to ethical standards, without regard to the authors' race, gender, institutional affiliation, or nationality.</li>
  <li><strong>Confidentiality:</strong> Editors and editorial staff must maintain strict confidentiality regarding submitted manuscripts and must not disclose any details to anyone other than the authors, assigned reviewers, and potential reviewers.</li>
  <li><strong>Impartial Decisions:</strong> The Editor-in-Chief and Associate Editors hold full authority over editorial decisions. Editors must recuse themselves from processing manuscripts in which they have a competing interest or conflict of interest with any of the authors or institutions involved.</li>
  <li><strong>Handling Misconduct:</strong> Editors will take prompt, appropriate action if research or publication misconduct is alleged or suspected, following standard academic protocols (e.g., issuing corrections, retractions, or expressions of concern).</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">3. Duties and Responsibilities of Peer Reviewers</h2>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Contribution to Editorial Decisions:</strong> Reviewers assist editors in making informed editorial decisions and aid authors in improving their manuscripts through constructive, unbiased feedback.</li>
  <li><strong>Confidentiality:</strong> Manuscripts received for review must be treated as confidential documents. They must not be shared, discussed, or used for personal advantage.</li>
  <li><strong>Objectivity and Standards:</strong> Reviews should be conducted objectively. Personal criticism of the authors is inappropriate. Reviewers must express their views clearly with supporting arguments and evidence.</li>
  <li><strong>Promptness:</strong> Nominated reviewers who feel unqualified to evaluate a submission or know they cannot meet the review timeline must notify the editorial office promptly and decline the invitation.</li>
  <li><strong>Conflict of Interest:</strong> Reviewers must declare any potential conflicts of interest (financial, collaborative, or competitive) with the authors or institutions and decline to review the manuscript if a conflict exists.</li>
</ul>

<h2 class="text-xl font-semibold text-[#000033] mb-3 mt-6">4. Research and Publication Misconduct Protocols</h2>
<p class="mb-3">
  IJAIQT investigates all allegations of misconduct thoroughly. Depending on the severity of the violation, the journal reserves the right to take the following actions:
</p>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li>Rejection of the manuscript under consideration.</li>
  <li>Prohibition of future submissions from offending authors for a specified period.</li>
  <li>Formal notification sent to the authors' home institution or funding body.</li>
  <li>Publication of an official retraction or correction notice for published articles.</li>
</ul>
`;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const settings = await SiteSettings.getSettings();
    settings.reviewProcessHtml = reviewProcessHtml;
    settings.ethicsHtml = ethicsHtml;
    await settings.save();
    console.log('Successfully updated settings with new HTML content');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
