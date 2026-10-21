require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Issue = require('../models/Issue');

const issuesToSeed = [
  { volume: 48, issue: 3, year: 2026, month: 'June', description: 'June 2026 (Volume 48, Issue 03)', isPublished: true },
  { volume: 48, issue: 2, year: 2026, month: 'April', description: 'April 2026 (Volume 48, Issue 02)', isPublished: true },
  { volume: 48, issue: 1, year: 2026, month: 'January', description: 'January 2026 (Volume 48, Issue 01)', isPublished: true },
  { volume: 47, issue: 2, year: 2025, month: 'June', description: 'June 2025 (Volume 47, Issue 02)', isPublished: true },
  { volume: 47, issue: 1, year: 2025, month: 'April', description: 'April 2025 (Volume 47, Issue 01)', isPublished: true },
  { volume: 46, issue: 1, year: 2024, month: 'Dec', description: 'Dec 2024 (Volume 46, Issue 01)', isPublished: true },
  { volume: 45, issue: 1, year: 2024, month: 'May', description: 'May 2024 (Volume 45, Issue 01)', isPublished: true },
  { volume: 44, issue: 3, year: 2023, month: 'September', description: 'September 2023 (Volume 44, Issue 03)', isPublished: true },
  { volume: 44, issue: 2, year: 2023, month: 'June', description: 'June 2023 (Volume 44, Issue 02)', isPublished: true },
  { volume: 44, issue: 1, year: 2023, month: 'January', description: 'January 2023 (Volume 44, Issue 01)', isPublished: true },
  { volume: 43, issue: 1, year: 2022, month: 'Yearly', description: 'Volume 43, Yearly Issue of 2022', isPublished: true },
  { volume: 42, issue: 4, year: 2021, month: 'Nov-Dec', description: 'Nov-Dec 2021 (Volume 42, Issue 04)', isPublished: true },
  { volume: 42, issue: 3, year: 2021, month: 'Sept', description: 'Sept 2021 (Volume 42, Issue 03)', isPublished: true },
  { volume: 42, issue: 2, year: 2021, month: 'June', description: 'June 2021 (Volume 42, Issue 02)', isPublished: true },
  { volume: 42, issue: 1, year: 2021, month: 'March', description: 'March 2021 (Volume 42, Issue 01)', isPublished: true },
  { volume: 41, issue: 3, year: 2020, month: 'Sept', description: 'Sept 2020 (Volume 41, Issue 03)', isPublished: true },
  { volume: 41, issue: 2, year: 2020, month: 'June', description: 'June 2020 (Volume 41, Issue 02)', isPublished: true },
  { volume: 41, issue: 1, year: 2020, month: 'HY01 (Jan to May)', description: 'HY01 (2020) (Jan to May) (Volume 41, Issue 01)', isPublished: true },
  { volume: 40, issue: 4, year: 2019, month: 'Oct', description: 'Oct 2019 (Volume 40, Issue 04)', isPublished: true },
  { volume: 40, issue: 3, year: 2019, month: 'June', description: 'June 2019 (Volume 40, Issue 03)', isPublished: true },
  { volume: 40, issue: 2, year: 2019, month: 'May', description: 'May 2019 (Volume 40, Issue 02)', isPublished: true },
];

async function seedArchive() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    let inserted = 0;
    for (const item of issuesToSeed) {
      const exists = await Issue.findOne({ volume: item.volume, issue: item.issue });
      if (!exists) {
        await Issue.create(item);
        inserted++;
      }
    }

    console.log(`✅ Seeded ${inserted} archive issues!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding archive:', err);
    process.exit(1);
  }
}

seedArchive();
