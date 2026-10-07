const express = require('express');
const { body, validationResult } = require('express-validator');
const EditorialBoard = require('../models/EditorialBoard');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Get all board members (public, active only)
router.get('/seed', async (req, res) => {
  try {
    const editors = [
      // Honorary Chief Editor(s)
      { name: 'Prof. (Dr.) Nagaraj Ramrao', position: 'Honorary Chief Editor', affiliation: 'Vice-Chancellor, KIET (Deemed to be University), India', order: 1 },
      { name: 'Prof. (Dr.) Manoj Goel', position: 'Honorary Chief Editor', affiliation: 'Pro Vice-Chancellor, KIET (Deemed to be University), India', order: 2 },
      
      // Honorary Co-Chief Editor
      { name: 'Prof. (Dr.) Adesh Kumar Pandey', position: 'Honorary Co-Chief Editor', affiliation: 'Director (Academics), KIET (Deemed to be University), India', order: 3 },
      
      // Executive Editor(s)
      { name: 'Prof. (Dr.) Ali Wagdy Mohamed', position: 'Executive Editor', affiliation: 'Cairo University, Egypt', order: 4 },
      { name: 'Prof. (Dr.) Mahesh Kumar Kolekar', position: 'Executive Editor', affiliation: 'Indian Institute of Technology, Patna, India', order: 5 },
      { name: 'Prof. (Dr.) Puneet Goswami', position: 'Executive Editor', affiliation: 'KIET (Deemed to be University), India', order: 6 },
      { name: 'Prof. (Dr.) Abhinav Juneja', position: 'Executive Editor', affiliation: 'KIET (Deemed to be University), India', order: 7 },
      { name: 'Prof. (Dr.) Rekha Kashyap', position: 'Executive Editor', affiliation: 'KIET (Deemed to be University), India', order: 8 },
      
      // Managing Editor
      { name: 'Prof. (Dr.) Puneet Garg', position: 'Managing Editor', affiliation: 'KIET (Deemed to be University), India', order: 9 },
      
      // Associate Editor(s)
      { name: 'Prof. (Dr.) Parveen Kumar', position: 'Associate Editor', affiliation: 'KIET (Deemed to be University), India', order: 10 },
      { name: 'Prof. (Dr.) Manish Bhardwaj', position: 'Associate Editor', affiliation: 'KIET (Deemed to be University), India', order: 11 },
      { name: 'Prof. (Dr.) Vipin Kumar', position: 'Associate Editor', affiliation: 'KIET (Deemed to be University), India', order: 12 },
      { name: 'Prof. (Dr.) Nitin Kumar Saxena', position: 'Associate Editor', affiliation: 'KIET (Deemed to be University), India', order: 13 },
      
      // Academic Editor(s)
      { name: 'Dr. Abhas Kanungo', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 14 },
      { name: 'Dr. Neeraj', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 15 },
      { name: 'Dr. Piyush Pant', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 16 },
      { name: 'Dr. Bhagwati Sharan', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 17 },
      { name: 'Mr. Gagan Thakral', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 18 },
      { name: 'Ms. Purnima Garg', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 19 },
      { name: 'Dr. Rohit', position: 'Academic Editor', affiliation: 'KIET (Deemed to be University), India', order: 20 },
      
      // Assistant editor(s)
      { name: 'Mr. Sarvesh Maurya', position: 'Assistant Editor', affiliation: 'KIET (Deemed to be University), India', order: 21 },
      { name: 'Mr. Akash Singh', position: 'Assistant Editor', affiliation: 'KIET (Deemed to be University), India', order: 22 },
      
      // International Advisory Board
      { name: 'Prof. (Dr.) David Wenzhong Gao', position: 'International Advisory Board', affiliation: 'University of Denver, USA', order: 23 },
      { name: 'Prof. (Dr.) Gulshan Sharma', position: 'International Advisory Board', affiliation: 'University of Johannesburg, SA', order: 24 },
      { name: 'Prof. (Dr.) Ramech C. Bansal', position: 'International Advisory Board', affiliation: 'University of Sharjah, UAE', order: 25 },
      { name: 'Prof. (Dr.) Ankit Agrawal', position: 'International Advisory Board', affiliation: 'University of Northwestern, USA', order: 26 },
      { name: 'Prof. (Dr.) Shruti Pandey', position: 'International Advisory Board', affiliation: 'University of Missouri, USA', order: 27 },
      { name: 'Prof. (Dr.) Meena Jha', position: 'International Advisory Board', affiliation: 'Central Queensland University, Australia', order: 28 },
      
      // Editorial Advisory Board
      { name: 'Dr. Saurabh Jain', position: 'Editorial Advisory Board', affiliation: 'IIIT, Sonipat, India', order: 29 },
      { name: 'Prof. (Dr.) Ashutosh Dixit', position: 'Editorial Advisory Board', affiliation: 'JCBUST YMCA, India', order: 30 },
      { name: 'Prof. (Dr.) Komal Kumar Bhatia', position: 'Editorial Advisory Board', affiliation: 'JCBUST YMCA, India', order: 31 },
      { name: 'Prof. (Dr.) Manpreet Kaur', position: 'Editorial Advisory Board', affiliation: 'Manav Rachna University, India', order: 32 },
      { name: 'Prof. (Dr.) Vivek Kumar Sharma', position: 'Editorial Advisory Board', affiliation: 'Manav Rachna University, India', order: 33 },
      { name: 'Prof. (Dr.) Rakesh Kumar Rajpal', position: 'Editorial Advisory Board', affiliation: 'SAITM, Delhi NCR, India', order: 34 },
      { name: 'Prof. (Dr.) Harish Mittal', position: 'Editorial Advisory Board', affiliation: 'Chandigarh University, India', order: 35 },
      { name: 'Prof. (Dr.) Surjeet Dalal', position: 'Editorial Advisory Board', affiliation: 'Amity University, Gurugram, India', order: 36 },
      { name: 'Prof. (Dr.) Varun Malik', position: 'Editorial Advisory Board', affiliation: 'Chitkara University, India', order: 37 },
      { name: 'Prof. (Dr.) Vinay Goel', position: 'Editorial Advisory Board', affiliation: 'CGC University, India', order: 38 },
      { name: 'Prof. (Dr.) Ankit Verma', position: 'Editorial Advisory Board', affiliation: 'ADGITM, New Delhi, India', order: 39 },
      { name: 'Prof. (Dr.) Amandeep Kaur', position: 'Editorial Advisory Board', affiliation: 'GTBIT, New Delhi, India', order: 40 },
      { name: 'Prof. (Dr.) Dimple Tiwari', position: 'Editorial Advisory Board', affiliation: 'VIPS, New Delhi, India', order: 41 },
      { name: 'Dr. Priya Dalal', position: 'Editorial Advisory Board', affiliation: 'MSIT, New Delhi, India', order: 42 },
      { name: 'Prof. (Dr.) Ashwani Kumar', position: 'Editorial Advisory Board', affiliation: 'NIT Kurukshetra, India', order: 43 },
      { name: 'Prof. (Dr.) Bhavesh Kumar Chauhan', position: 'Editorial Advisory Board', affiliation: 'AKTU, Lucknow, India', order: 44 },
      { name: 'Prof. (Dr.) Akash Saxena', position: 'Editorial Advisory Board', affiliation: 'Central University of Haryana, India', order: 45 },
      { name: 'Prof. (Dr.) Varun Gupta', position: 'Editorial Advisory Board', affiliation: 'NIT Sikkim, India', order: 46 },
      { name: 'Prof. (Dr.) Manish Kumar', position: 'Editorial Advisory Board', affiliation: 'Central University of Haryana', order: 47 },
      { name: 'Prof. (Dr.) Jiwanjot SIngh', position: 'Editorial Advisory Board', affiliation: 'NIT Hamirpur', order: 48 },
      { name: 'Prof. (Dr.) Sudhir Nadda', position: 'Editorial Advisory Board', affiliation: 'Amity university Noida', order: 49 },
      { name: 'Dr. Ajay Sharma', position: 'Editorial Advisory Board', affiliation: 'Amity University, Noida', order: 50 },
      { name: 'Dr. Narender Malik', position: 'Editorial Advisory Board', affiliation: 'MSIT, New Delhi, India', order: 51 },
      { name: 'Dr. Pawan Kumar Pandey', position: 'Editorial Advisory Board', affiliation: 'Gyan Ganga Institute of Technology and Sciences, Jabalpur, India', order: 52 },
      { name: 'Dr. Aditya Kumar', position: 'Editorial Advisory Board', affiliation: 'Technical Lead at HCLTech', order: 53 },
      { name: 'Dr. Neha Niharika', position: 'Editorial Advisory Board', affiliation: 'Galgotia college of Engg Greater Noida', order: 54 },
      { name: 'Dr. Javed Imran', position: 'Editorial Advisory Board', affiliation: 'Thapar University, Patiyala, Punjab', order: 55 },
      { name: 'Dr. Arvind Dagur', position: 'Editorial Advisory Board', affiliation: 'Galgotia University, Greater Noida', order: 56 },
      { name: 'Dr. Manpreet Singh Sehgal', position: 'Editorial Advisory Board', affiliation: 'LPU, Punjab', order: 57 },
      { name: 'Dr. Umesh Kumar', position: 'Editorial Advisory Board', affiliation: 'JCBUST YMCA, India', order: 58 }
    ];
    
    await EditorialBoard.deleteMany({});
    await EditorialBoard.insertMany(editors);
    res.json({ message: 'Successfully seeded editorial board!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all board members (public, active only)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };

    const members = await EditorialBoard.find(filter).sort({ order: 1, name: 1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create board member (admin only)
router.post('/',
  auth,
  requireRole('admin'),
  [
    body('name').notEmpty(),
    body('position').notEmpty(),
    body('affiliation').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const member = await EditorialBoard.create(req.body);
      await logActivity(req, 'CREATE', 'EditorialBoard', member._id, { name: member.name });

      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update board member (admin only)
router.put('/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const member = await EditorialBoard.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!member) {
        return res.status(404).json({ error: 'Board member not found' });
      }

      await logActivity(req, 'UPDATE', 'EditorialBoard', member._id);

      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete board member (admin only)
router.delete('/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const member = await EditorialBoard.findByIdAndDelete(req.params.id);

      if (!member) {
        return res.status(404).json({ error: 'Board member not found' });
      }

      await logActivity(req, 'DELETE', 'EditorialBoard', member._id);

      res.json({ message: 'Board member deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
