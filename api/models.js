const mongoose = require('mongoose');

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  img: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Skill Model
const SkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, trim: true },
  focus: {
    type: String,
    enum: ['Software', 'Hardware', 'Data', 'AI', 'Web'],
    required: true,
  },
  img: { type: String, default: '' },
  descrip: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Experience Model
const ExperienceSchema = new mongoose.Schema({
  type: { type: String, enum: ['Education', 'Work'], required: true },
  company: { type: String, required: true, trim: true },
  subDescrip: { type: String, default: '' },
  date: { type: String, default: '' },
  descrip: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Project Model
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  img: { type: String, default: '' },
  role: { type: String, default: '' },
  date: { type: String, default: '' },
  techStack: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Avoid recompiling models if already compiled in cached node process
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

module.exports = { User, Skill, Experience, Project };

