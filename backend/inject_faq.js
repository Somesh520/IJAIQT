const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const SiteSettings = require('./models/SiteSettings');
  
  const faqHtml = `<h2 style="font-style: italic; color: #000000; font-family: 'Times New Roman', serif;"><strong>Frequently Asked Questions</strong></h2>
<div style="background-color: #f9f9f9; padding: 20px; font-family: 'Times New Roman', serif;">
  <h4 style="color: #990000; font-weight: bold; margin-bottom: 8px; font-size: 11pt;">Why to submit to International Journal of Artificial Intelligence and Quantum Computing?</h4>
  <p style="margin-bottom: 15px; font-size: 11pt;">International Journal of Artificial Intelligence and Quantum Computing has established itself as a professional and notable venue for publishing high quality research papers. It guarantees a maximum exposure of all its published articles in various indexing sites.</p>

  <h4 style="color: #990000; font-weight: bold; margin-bottom: 8px; font-size: 11pt;">Will International Journal of Artificial Intelligence and Quantum Computing publish articles available for free?</h4>
  <p style="margin-bottom: 15px; font-size: 11pt;">Yes, all the papers published by International Journal of Artificial Intelligence and Quantum Computing will be available for download for free. We are here to support the Open Access Publication policy.</p>

  <h4 style="color: #990000; font-weight: bold; margin-bottom: 8px; font-size: 11pt;">What is the standard or quality of papers published in International Journal of Artificial Intelligence and Quantum Computing?</h4>
  <p style="margin-bottom: 15px; font-size: 11pt;">Like most journals, International Journal of Artificial Intelligence and Quantum Computing try to ensure publishing high quality papers, that have a significant contribution, worth for sharing an idea, a concept, a technique or a result, are considered for publication as determined by our reviewers.</p>

  <h4 style="color: #990000; font-weight: bold; margin-bottom: 8px; font-size: 11pt;">May I request an extension for submitting my paper?</h4>
  <p style="margin-bottom: 15px; font-size: 11pt;">Yes, you may request an extension provided you give us a valid reason. Typically an extension for paper submission varies from 5-7 days.</p>
  
  <h4 style="color: #990000; font-weight: bold; margin-bottom: 8px; font-size: 11pt;">How do I submit my paper?</h4>
  <p style="margin-bottom: 15px; font-size: 11pt;">You can submit your paper by clicking on the "Submit Paper" button and following the formatting guidelines provided in the Instruction to Authors page.</p>
</div>`;

  // Get current settings
  const currentSettings = await SiteSettings.findOne({});
  if (currentSettings) {
    // Replace IJCSMS with the new journal name in HTML fields
    const newName = 'International Journal of Artificial Intelligence and Quantum Computing';
    
    let updateData = { faqHtml };
    
    if (currentSettings.callForPapersHtml) {
      updateData.callForPapersHtml = currentSettings.callForPapersHtml.replace(/IJCSMS/g, newName);
    }
    if (currentSettings.authorsHtml) {
      updateData.authorsHtml = currentSettings.authorsHtml.replace(/IJCSMS/g, newName);
    }
    if (currentSettings.homeWelcomeTitle) {
      updateData.homeWelcomeTitle = currentSettings.homeWelcomeTitle.replace(/IJCSMS/g, newName);
    }
    if (currentSettings.homeWelcomeText) {
      updateData.homeWelcomeText = currentSettings.homeWelcomeText.replace(/IJCSMS/g, newName);
    }
    
    await SiteSettings.findOneAndUpdate({}, updateData);
    console.log('FAQ HTML injected and all IJCSMS references updated to the new journal name successfully!');
  }
  
  process.exit(0);
});
