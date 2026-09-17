const mongoose = require('mongoose');

const newsLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, default: '' },
  date: { type: String, default: '' },
  content: { type: String, default: '' }
});

const siteSettingsSchema = new mongoose.Schema({
  bannerImageUrl: {
    type: String,
    default: ''
  },
  themeColor: {
    type: String,
    default: '#1e40af' // Default to a blue shade
  },
  homeWelcomeTitle: {
    type: String,
    default: 'Welcome to IJCSMS'
  },
  homeWelcomeText: {
    type: String,
    default: 'International Journal of Computer Science and Management Studies (IJCSMS) is an international online journal open to the whole world...'
  },
  scopeTitle: {
    type: String,
    default: 'Scope of the journal'
  },
  scopeText: {
    type: String,
    default: 'An Indexed, Referred and Peer Reviewed Journal'
  },
  newsLinks: {
    type: [newsLinkSchema],
    default: [
      { label: 'A Peer Reviewed Journal', url: '#' },
      { label: 'Review Process:', url: '#' },
      { label: 'Ethics Policy of the Journal:', url: '#' },
      { label: 'Impact Factor', url: '#' },
      { label: 'CC License', url: '#' }
    ]
  },
  sideBannerUrl: {
    type: String,
    default: ''
  },
  indexingImages: {
    type: [String],
    default: []
  },
  sideButton1Text: {
    type: String,
    default: 'Submit Paper'
  },
  sideButton1Url: {
    type: String,
    default: '/authors'
  },
  sideButton2Text: {
    type: String,
    default: 'Paper Format'
  },
  sideButton2Url: {
    type: String,
    default: '/authors'
  },
  editorialBoardHtml: {
    type: String,
    default: '<h2>Editorial Board</h2>'
  },
  callForPapersHtml: {
    type: String,
    default: '<h2>Call For Papers</h2>'
  },
  submissionDeadline: {
    type: String,
    default: 'January 31, 2027'
  },
  notificationOfAcceptance: {
    type: String,
    default: 'February 28, 2027'
  },
  finalCameraReady: {
    type: String,
    default: 'March 15, 2027'
  },
  onlinePublication: {
    type: String,
    default: 'March 30, 2027'
  },
  authorsHtml: {
    type: String,
    default: '<h2>Instruction To Authors</h2>'
  },
  topicsHtml: {
    type: String,
    default: '<h2>Topics Covered</h2>'
  },
  faqHtml: {
    type: String,
    default: '<h2>Frequently Asked Questions</h2>'
  },
  currentIssueHtml: {
    type: String,
    default: '<h2>Current Issue</h2>'
  },
  footerText: {
    type: String,
    default: '© Copyright 2024 IJCSMS - All rights reserved. Use of this Web site signifies your agreement to the terms and conditions.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// We only need one document for settings, so we can define a static method to get/create it
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
