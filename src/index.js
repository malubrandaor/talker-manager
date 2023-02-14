const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const validationsRequired = require('./validations/validations');
const tolken = require('./token');
const ageNumber = require('./validations/age');
const names = require('./validations/name');
const talkersValidation = require('./validations/talk');
const rates = require('./validations/rate');
const tokenValidation = require('./validations/tokenValidation');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// requisito 1 = funçao que le o arquivo talker.json e converte para a linguagem js e retorna para o path definido
const readTalkers = async () => {
  try {
  const talkers = await fs.readFile(path.resolve(__dirname, 'talker.json'));
  return JSON.parse(talkers);
  } catch (error) {
    return [];
  }
};

const writeTalkers = async (identification) => {
  const talkerNew = fs.writeFile(path.resolve(__dirname, 'talker.json'), 
  JSON.stringify(identification));
  return talkerNew;
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// usar o try/catch abarca qualquer erro possivel (requisito 1)
app.get('/talker', async (__req, res) => {
  try {
    const talker = await readTalkers();
    res.status(200).json(talker);
  } catch ({ message }) {
    res.status(200).json([]);
  }
});

app.post('/login', validationsRequired, async (req, res) => {
  try {
  const randomToken = tolken();
  res.status(HTTP_OK_STATUS).json({ token: `${randomToken}` });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

app.get('/talker/search', tokenValidation, async (req, res) => {
  const { q } = req.query;
  const talkers = await readTalkers();

  const list = talkers.filter((talker) => talker.name.includes(q));

  if (!list) {
    return res.status(200).json([]);
  }
  if (!q) {
      return res.status(200).json(talkers);
    }
    return res.status(200).json(list);
});

 // inseri a funcao que coleta pelo id dentro do get (requisito 2)
app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const talkersId = await readTalkers();
    const findId = talkersId.find((i) => i.id === Number(id));
   if (!findId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
   res.status(200).json(findId);
});
// a logica da funcao esta na pasta validations para organizaçao do arquivo
// app.post('/login', validationsRequired, async (req, res) => {
//   try {
//   const randomToken = tolken();
//   res.status(HTTP_OK_STATUS).json({ token: `${randomToken}` });
//   } catch ({ message }) {
//     res.status(500).json({ message });
//   }
// });
// logicas da funcao esta na pasta validations 
app.post('/talker', 
tokenValidation, 
names, 
ageNumber, 
talkersValidation, 
rates,
async (req, res) => {
  const talkers = await readTalkers();
  const addNewTalker = { id: talkers.length + 1, ...req.body };
  await writeTalkers([...talkers, addNewTalker]);
  res.status(201).json(addNewTalker);
});

app.put('/talker/:id',
tokenValidation, 
names, 
ageNumber, 
talkersValidation, 
rates,
async (req, res) => {
  const talkers = readTalkers();
  const { id } = req.params;
  talkers[Number(id)] = { id: +id, ...req.body };
  await writeTalkers(talkers);
  res.status(200).json({ id: +id, ...req.body });
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const talkers = await readTalkers();
  const { id } = req.params;
  const list = talkers.filter((talker) => talker.id !== +(id));
  await writeTalkers(list);
  return res.status(204).end();
});

// app.get('/talker/search', tokenValidation, async (req, res) => {
//   const talkers = await readTalkers();
//   const { query1 } = req.query;
//   const list = talkers.filter((talker) => talker.name.includes(query1));

//  if (list === undefined || list === '') {
//       return res.status(200).json(talkers);
//     }
//     if (!list) {
//       return res.status(200).json([]);
//     }
//     return res.status(200).json(list);
// });

app.listen(PORT, () => {
  console.log('Online');
});
