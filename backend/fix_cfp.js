require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');

const cleanedHtml = `
<h1 class="text-2xl font-bold text-[#000033] mb-4">Call for Papers — Upcoming Issue</h1>
<p class="mb-4 text-justify">
  <strong>International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT)</strong>, an official academic initiative run by <strong>KIET (Deemed to be University)</strong>, Delhi NCR, Ghaziabad, Uttar Pradesh, invites original research articles, review papers, short communications, and case studies for its upcoming issue.
</p>
<p class="mb-8 text-justify">
  We welcome submissions showcasing theoretical breakthroughs, algorithmic designs, software implementations, hardware architectures, and real-world applications in Artificial Intelligence and Quantum Technologies.
</p>

<h2 class="text-xl font-bold text-[#000033] mb-4 mt-8">How to Submit</h2>
<p class="mb-4">
  Authors are invited to submit their original, unpublished research papers adhering to the official IJAIQT formatting guidelines.
</p>
<ul class="list-disc pl-6 space-y-2">
  <li><strong>Managing University:</strong> KIET (Deemed to be University), Delhi NCR, Ghaziabad, UP, India</li>
  <li><strong>Submission Email:</strong> <a href="mailto:editor.ijaiqt@kiet.edu" class="text-blue-600 hover:underline">ijaiqt@kiet.edu</a></li>
  <li><strong>Manuscript Format:</strong> This Submitted Paper Must be in Accordance with Prescribed Standard MS Word Template</li>
  <li><strong>Originality Check:</strong> Submitted papers must not be under consideration by any other journal or conference.</li>
</ul>
`;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const settings = await SiteSettings.getSettings();
    settings.callForPapersHtml = cleanedHtml;
    await settings.save();
    console.log('Successfully updated callForPapersHtml to remove duplicate table');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
