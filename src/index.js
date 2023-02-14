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
  const talkers = path.resolve(__dirname, 'talker.json');
  const talkersUTF8 = await fs.readFile(talkers, 'utf8');
  return JSON.parse(talkersUTF8);
};

const writeTalkers = async (identification) => {
  const talkerNew = fs.writeFile(path.resolve(__dirname, 'talker.json'), 
  JSON.stringify(identification));
  return talkerNew;
};

// const newTalker = async (req, res) => {
//   const { name, age, talk } = req.body;
//   const talker = await readTalkers();
//   const writeNewTalker = { id: talker.length + 1, name, age, talk };
//   await writeTalkers(writeNewTalker);
//   res.status(201).json(writeNewTalker);
// };

// requisito 3 = validacao de login, senha e post (funcao login na pasta validations)

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// usar o try/catch abarca qualquer erro possivel (requisito 1)
app.get('/talker', async (req, res) => {
  try {
    const talker = await readTalkers();
    res.status(200).json(talker);
  } catch ({ message }) {
    res.status(200).json([]);
  }
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
app.post('/login', validationsRequired, async (req, res) => {
  try {
  const randomToken = tolken();
  res.status(HTTP_OK_STATUS).json({ token: `${randomToken}` });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});
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

app.listen(PORT, () => {
  console.log('Online');
});
