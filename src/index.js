const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// requisito 1 = funçao que le o arquivo talker.json e converte para a linguagem js e retorna para o path definido
const readTalkers = async () => {
  const talkers = await fs.readFile(path.resolve(__dirname, 'talker.json'));
  const talkersJson = JSON.parse(talkers);
  // console.log(talkersJson);
  return talkersJson;
};

// requisito 2 = funçao que busca o path pelo ultimo id 
// const getTalkersById = async (req) => {
//   const { id } = req.params;
//   const talkersId = await readTalkers();
//   const talkersFindId = talkersId.find((i) => i.id === Number(id));
//   return talkersFindId;
// };

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// usar o try/catch abarca qualquer erro possivel
app.get('/talker', async (req, res) => {
  try {
    const talker = await readTalkers();
    res.status(200).json(talker);
  } catch ({ message }) {
    res.status(200).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const talkersId = await readTalkers();
    const talkersFindId = talkersId.find((i) => i.id === Number(id));
   if (!talkersFindId) 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada'});
   res.status(200).json(talkersFindId);
});

app.listen(PORT, () => {
  console.log('Online');
});
