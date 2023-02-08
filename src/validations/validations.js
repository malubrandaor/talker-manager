function login(req, res, next) {
   const { email, password } = req.body;
   const mailGenerator = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/i;
   const messageMail = 'O campo "email" é obrigatório';
   const messageMail2 = 'O "email" deve ter o formato "email@email.com"';
   const messagePassword = 'O campo "password" é obrigatório';
   const messagePassword2 = 'O "password" deve ter pelo menos 6 caracteres';
   if (!email) {
    return res.status(400).json({ message: messageMail });
   } if (!mailGenerator.test(email)) {
    return res.status(400).json({ message: messageMail2 }); 
   }
   if (!password) {
    return res.status(400).json({ message: messagePassword });
   } if (password.length < 6) {
    return res.status(400).json({ message: messagePassword2 }); 
   }
   next();
}

module.exports = login;