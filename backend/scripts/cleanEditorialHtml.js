require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const cleanHtml = `<p><strong>Honorary Chief Editor(s)</strong><br>Prof. (Dr.) Nagaraj Ramrao<br>Vice-Chancellor, KIET (Deemed to be University), India<br><br>Prof. (Dr.) Manoj Goel<br>Pro Vice-Chancellor, KIET (Deemed to be University), India</p>

<p><strong>Honorary Co-Chief Editor</strong><br>Prof. (Dr.) Adesh Kumar Pandey<br>Director (Academics), KIET (Deemed to be University), India<br><br>Prof. (Dr.) Vibhav Kumar Sachan<br>Dean (R&D), KIET (Deemed to be University), India</p>

<p><strong>Executive Editor(s)</strong><br>Prof. (Dr.) Ali Wagdy Mohamed, Zewail City of Science, Technology and Innovation, Egypt<br>Prof. (Dr.) Mahesh Kumar Kolekar, Indian Institute of Technology, Patna, India<br>Prof. (Dr.) Puneet Goswami, KIET (Deemed to be University), India<br>Prof. (Dr.) Abhinav Juneja, KIET (Deemed to be University), India<br>Prof. (Dr.) Rekha Kashyap, KIET (Deemed to be University), India</p>

<p><strong>Managing Editor</strong><br>Prof. (Dr.) Puneet Garg<br>KIET (Deemed to be University), India</p>

<p><strong>Associate Editor(s)</strong><br>Prof. (Dr.) Parveen Kumar, KIET (Deemed to be University), India<br>Prof. (Dr.) Manish Bhardwaj, KIET (Deemed to be University), India<br>Prof. (Dr.) Vipin Kumar, KIET (Deemed to be University), India<br>Prof. (Dr.) Nitin Kumar Saxena, KIET (Deemed to be University), India</p>

<p><strong>Academic Editor(s)</strong><br>Dr. Abhas Kanungo, KIET (Deemed to be University), India<br>Dr. Neeraj, KIET (Deemed to be University), India<br>Dr. Piyush Pant, KIET (Deemed to be University), India<br>Dr. Bhagwati Sharan, KIET (Deemed to be University), India<br>Mr. Gagan Thakral, KIET (Deemed to be University), India<br>Ms. Purnima Garg, KIET (Deemed to be University), India<br>Dr. Rohit, KIET (Deemed to be University), India</p>

<p><strong>Assistant editor(s)</strong><br>Mr. Sarvesh Maurya, KIET (Deemed to be University), India<br>Mr. Akash Singh, KIET (Deemed to be University), India</p>

<p><strong>International Advisory Board</strong><br>Prof. (Dr.) David Wenzhong Gao, University of Denver, USA<br>Prof. (Dr.) Gulshan Sharma, University of Johannesburg, SA<br>Prof. (Dr.) Ramech C. Bansal, University of Sharjah, UAE<br>Prof. (Dr.) Ankit Agrawal, University of Northwestern, USA<br>Prof. (Dr.) Shruti Pandey, University of Missouri, USA<br>Prof. (Dr.) Meena Jha, Central Queensland University, Australia</p>

<p><strong>Editorial Advisory Board</strong><br>Prof. (Dr.) Vineet Sharma, KIET (Deemed to be University), India<br>Prof. (Dr.) Ajay Kr. Shrivastava, KIET (Deemed to be University), India<br>Prof. (Dr.) Harsh Khatter, KIET (Deemed to be University), India<br>Prof. (Dr.) Neeraj Gupta, KIET (Deemed to be University), India<br>Prof. (Dr.) Ashish Karanwal, KIET (Deemed to be University), India<br>Prof. (Dr.) Sachin Malhotra, KIET (Deemed to be University), India<br>Prof. (Dr.) Binkey Srivastava, KIET (Deemed to be University), India<br>Dr. Saurabh Jain — IIIT Sonipat<br>Prof. (Dr.) Ashutosh Dixit — JCBUST YMCA<br>Prof. (Dr.) Komal Kumar Bhatia — JCBUST YMCA<br>Prof. (Dr.) Manpreet Kaur — MRIU<br>Prof. (Dr.) Vivek Kumar Sharma — MRIU<br>Prof. (Dr.) Rakesh Kumar Rajpal — SAITM, Delhi NCR<br>Prof. (Dr.) Harish Mittal — Chandigarh University<br>Prof. (Dr.) Surjeet Dalal — Amity University Gurugram<br>Prof. (Dr.) Varun Malik — Chitkara University<br>Prof. (Dr.) Vinay Goel — CGC University<br>Prof. (Dr.) Ankit Verma — ADGITM, New Delhi<br>Prof. (Dr.) Amandeep Kaur — GTBIT, New Delhi<br>Prof. (Dr.) Dimple Tiwari — VIPS, New Delhi<br>Dr. Priya Dalal — MSIT, New Delhi<br>Prof. (Dr.) Ashwani Kumar — NIT Kurukshetra<br>Prof. (Dr.) Bhavesh Kumar Chauhan — AKTU, Lucknow<br>Prof. (Dr.) Akash Saxena — CUH<br>Prof. (Dr.) Varun Gupta — NIT Sikkim<br>Prof. (Dr.) Manish Kumar — CUH<br>Prof. (Dr.) Jiwanjot Singh — NIT Hamirpur<br>Prof. (Dr.) Sudhir Nadda — Amity University Noida<br>Dr. Ajay Sharma — Amity University Noida<br>Dr. Narender Malik — MSIT, New Delhi<br>Dr. Pawan Kumar Pandey — GGITS, Jabalpur<br>Dr. Aditya Kumar — HCLTech<br>Dr. Neha Niharika — GCE, Greater Noida<br>Dr. Javed Imran — Thapar University, Patiala<br>Dr. Arvind Dagur — Galgotias University, Greater Noida<br>Dr. Manpreet Singh Sehgal — LPU, Punjab<br>Dr. Umesh Kumar — JCBUST YMCA</p>`;

async function cleanEditorial() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in env');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const result = await mongoose.connection.db.collection('sitesettings').updateOne(
      {},
      { $set: { editorialBoardHtml: cleanHtml, updatedAt: new Date() } }
    );

    console.log('✅ Updated editorialBoardHtml in database:', result.modifiedCount > 0 ? 'Success' : 'No changes');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating editorialBoardHtml:', err);
    process.exit(1);
  }
}

cleanEditorial();

