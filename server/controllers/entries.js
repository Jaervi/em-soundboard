const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Entry = require('../models/entry');
const User = require('../models/user');

router.get('/', async (request, response) => {
  const entries = await Entry.find({}).populate('user', { username: 1, name: 1, admin: 1 });
  response.json(entries);
});

router.post('/', async (request, response) => {
  const entry = new Entry(request.body);
  const user = request.user;

  if (!user) {
    return response.status(403).json({ error: 'user missing' });
  }

  if (!entry.author || !entry.description || !entry.audio) {
    return response.status(400).json({ error: 'missing attributes' });
  }

  entry.user = user;
  user.entries = user.entries.concat(entry._id);

  await user.save();
  const savedEntry = await entry.save();

  response.status(201).json(savedEntry);
});

router.delete('/:id', async (request, response) => {
  let user = request.user;

  console.log(`Removing with id ${request.params.id}`);
  const entry = await Entry.findById(request.params.id);
  if (!entry) {
    return response.status(204).end();
  }

  if (user.id.toString() !== entry.user.toString() && !user.admin) {
    return response.status(403).json({ error: 'user not authorized' });
  }

  await entry.deleteOne();

  if (user.id.toString() !== entry.user.toString() && user.admin) {
    user = await User.findById(entry.user.toString());
  }
  console.log(`From user ${user.username} with id ${entry.user.toString()}`);
  user.entries = user.entries.filter((x) => x._id.toString() !== entry._id.toString());
  await user.save();

  response.status(204).end();
});

router.put('/:id', async (request, response) => {
  const body = request.body;
  const stats = body.stats

  const entry = {
    author: body.author,
    description: body.description,
    audio: body.audio,
    tags: body.tags,
    stats: {
      likes: stats?.likes ? stats.likes : 0, 
      downloads: stats?.downloads ? stats.downloads : 0,
    },
    user: body.user.id
  };
  
  const updatedEntry = await Entry.findByIdAndUpdate(request.params.id, entry, {
    new: true
  });
  
  response.json(updatedEntry);
});

module.exports = router;
