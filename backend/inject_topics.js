const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const SiteSettings = require('./models/SiteSettings');
  const html = `<h2 style="font-style: italic; color: #000000; font-family: 'Times New Roman', serif;"><strong>Topics Covered</strong></h2>
<table style="width: 100%; max-width: 800px; border-collapse: collapse; border: 1px solid #666; font-family: 'Times New Roman', serif; font-size: 11pt; text-align: left;">
  <tbody>
    <tr>
      <td style="padding: 4px 8px; border: 1px solid #666; background-color: #fce4ce; color: #d90000; font-style: italic; font-weight: bold;">
        Computer Science
      </td>
    </tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Adhoc Networks</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computer Vision, Graphics and Intelligence</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computational and Artificial Intelligence</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computer Vision</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Pattern Analysis and Recognition</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computer Graphics and Virtual Reality</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Human-Computer Interaction</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Simulation and Modelling</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Natural Language Understanding</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Networks and Systems</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computer networks</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Parallel and Distributed Computing</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Computer Architecture</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Operating Systems</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Security and Cryptography</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Mobile computing</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Reconfigurable computing systems</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Sensor networks</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Embedded systems</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Data Management</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Data Mining</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Databases</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Information Retrieval</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Web Data Management</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Web Information Systems</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Multimedia DB's</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Mining Data, Text, and the Web</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Educational Technology</td></tr>
    <tr><td style="padding: 4px 8px; border: 1px solid #666;">Bioinformatics and Biosciences</td></tr>
  </tbody>
</table>
<p style="color: #d90000; font-style: italic; font-weight: bold; margin-top: 10px;">... and all other topics related to Computer Science</p>`;
  await SiteSettings.findOneAndUpdate({}, { topicsHtml: html });
  console.log('Topics HTML injected successfully!');
  process.exit(0);
});
