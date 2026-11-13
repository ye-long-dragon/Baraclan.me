const { connectToDatabase } = require('./db');
const { Skill, Experience, Project } = require('./models');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { type, id } = req.query || {};

    switch (req.method) {
      case 'GET': {
        const [skills, experiences, projects] = await Promise.all([
          Skill.find({}).sort({ createdAt: -1 }),
          Experience.find({}).sort({ createdAt: -1 }),
          Project.find({}).sort({ createdAt: -1 }),
        ]);

        return res.status(200).json({
          success: true,
          data: {
            skills,
            experiences,
            projects,
          },
        });
      }

      case 'POST': {
        const body = req.body || {};

        // Handle full sync to MongoDB
        if (body.action === 'syncAll') {
          const { skills, experiences, projects } = body;

          // Clear existing collections and insert new updated items
          if (Array.isArray(skills)) {
            await Skill.deleteMany({});
            if (skills.length > 0) {
              const cleanSkills = skills.map(({ _id, ...rest }) => rest);
              await Skill.insertMany(cleanSkills);
            }
          }

          if (Array.isArray(experiences)) {
            await Experience.deleteMany({});
            if (experiences.length > 0) {
              const cleanExp = experiences.map(({ _id, ...rest }) => rest);
              await Experience.insertMany(cleanExp);
            }
          }

          if (Array.isArray(projects)) {
            await Project.deleteMany({});
            if (projects.length > 0) {
              const cleanProjects = projects.map(({ _id, ...rest }) => rest);
              await Project.insertMany(cleanProjects);
            }
          }

          const [updatedSkills, updatedExp, updatedProjects] = await Promise.all([
            Skill.find({}),
            Experience.find({}),
            Project.find({}),
          ]);

          return res.status(200).json({
            success: true,
            message: 'Portfolio successfully synchronized with MongoDB',
            data: {
              skills: updatedSkills,
              experiences: updatedExp,
              projects: updatedProjects,
            },
          });
        }

        // Handle initial seed to MongoDB if empty
        if (body.action === 'seed') {
          const { skills = [], experiences = [], projects = [] } = body.data || {};
          const currentSkillsCount = await Skill.countDocuments();
          const currentExpCount = await Experience.countDocuments();
          const currentProjectsCount = await Project.countDocuments();

          if (currentSkillsCount === 0 && skills.length > 0) {
            await Skill.insertMany(skills.map(({ _id, ...r }) => r));
          }
          if (currentExpCount === 0 && experiences.length > 0) {
            await Experience.insertMany(experiences.map(({ _id, ...r }) => r));
          }
          if (currentProjectsCount === 0 && projects.length > 0) {
            await Project.insertMany(projects.map(({ _id, ...r }) => r));
          }

          const [s, e, p] = await Promise.all([Skill.find({}), Experience.find({}), Project.find({})]);
          return res.status(200).json({
            success: true,
            message: 'MongoDB seeded with initial portfolio data',
            data: { skills: s, experiences: e, projects: p },
          });
        }

        // Handle single item creation
        const itemType = body.type || type;
        const itemData = body.item || body;

        let created;
        if (itemType === 'skill') {
          created = await Skill.create(itemData);
        } else if (itemType === 'experience') {
          created = await Experience.create(itemData);
        } else if (itemType === 'project') {
          created = await Project.create(itemData);
        } else {
          return res.status(400).json({ success: false, message: 'Invalid or missing type (skill, experience, project)' });
        }

        return res.status(201).json({ success: true, data: created });
      }

      case 'PUT': {
        const body = req.body || {};
        const itemType = body.type || type;
        const targetId = body.id || id || body._id;
        const updateData = body.item || body;
        delete updateData._id;

        if (!targetId) {
          return res.status(400).json({ success: false, message: 'Item ID is required for update' });
        }

        let updated;
        if (itemType === 'skill') {
          updated = await Skill.findByIdAndUpdate(targetId, updateData, { new: true });
        } else if (itemType === 'experience') {
          updated = await Experience.findByIdAndUpdate(targetId, updateData, { new: true });
        } else if (itemType === 'project') {
          updated = await Project.findByIdAndUpdate(targetId, updateData, { new: true });
        } else {
          return res.status(400).json({ success: false, message: 'Invalid item type' });
        }

        if (!updated) {
          return res.status(404).json({ success: false, message: 'Item not found' });
        }

        return res.status(200).json({ success: true, data: updated });
      }

      case 'DELETE': {
        const body = req.body || {};
        const itemType = body.type || type;
        const targetId = body.id || id || body._id;

        if (!targetId) {
          return res.status(400).json({ success: false, message: 'Item ID is required for delete' });
        }

        let deleted;
        if (itemType === 'skill') {
          deleted = await Skill.findByIdAndDelete(targetId);
        } else if (itemType === 'experience') {
          deleted = await Experience.findByIdAndDelete(targetId);
        } else if (itemType === 'project') {
          deleted = await Project.findByIdAndDelete(targetId);
        } else {
          return res.status(400).json({ success: false, message: 'Invalid item type' });
        }

        if (!deleted) {
          return res.status(404).json({ success: false, message: 'Item not found' });
        }

        return res.status(200).json({ success: true, message: `${itemType} deleted successfully` });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API /portfolio Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

