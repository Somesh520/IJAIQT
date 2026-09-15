require('dotenv').config();
const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const Paper = require('../models/Paper');
const EditorialBoard = require('../models/EditorialBoard');
const Cfp = require('../models/Cfp');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check and Create sample issue
    const existingIssue = await Issue.findOne({ volume: 1, issue: 1 });
    if (!existingIssue) {
      await Issue.create({
        volume: 1,
        issue: 1,
        year: 2024,
        month: 'January',
        description: 'Inaugural Issue',
        isCurrent: true,
        isPublished: true
      });
      console.log('✅ Created sample issue');
    } else {
      console.log('⚠️  Sample issue already exists');
    }

    // Check and Create sample editorial board member
    const existingBoard = await EditorialBoard.findOne({ email: 'john.smith@example.edu' });
    if (!existingBoard) {
      await EditorialBoard.create({
        name: 'Dr. John Smith',
        position: 'Editor-in-Chief',
        affiliation: 'University of Example',
        email: 'john.smith@example.edu',
        bio: 'Leading researcher in computer science',
        order: 1
      });
      console.log('✅ Created sample board member');
    } else {
      console.log('⚠️  Sample board member already exists');
    }

    // Check and Create sample CFP
    const existingCfp = await Cfp.findOne({ title: 'Call for Papers - Volume 1, Issue 2' });
    if (!existingCfp) {
      await Cfp.create({
        title: 'Call for Papers - Volume 1, Issue 2',
        description: 'We invite submissions for the upcoming issue on emerging technologies in research.',
        topics: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cloud Computing'],
        deadlines: {
          submission: new Date('2024-06-30'),
          revision: new Date('2024-08-15'),
          camera_ready: new Date('2024-09-15'),
          notification: new Date('2024-07-30')
        },
        guidelines: 'Papers should be 8-12 pages in IEEE format.',
        contactEmail: 'submissions@college-journal.com',
        isActive: true
      });
      console.log('✅ Created sample CFP');
    } else {
      console.log('⚠️  Sample CFP already exists');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
