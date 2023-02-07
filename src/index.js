const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const readTalkers = async () => {
  const talkers = await fs.readFile(path.resolve(__dirname, 'talker.json'));
  const talkersJson = JSON.parse(talkers);
  // console.log(talkersJson);
  return talkersJson;
};


// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const talker = await readTalkers();
  res.status(200).json(talker);
  } catch ({ message }) {
    res.status(200).json([]);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
