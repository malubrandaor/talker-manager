function identificationAge(req, res, next) {
    const { age } = req.body;
    const messageAge = 'O campo "age" é obrigatório';
    const messageAgeNumber = 'O campo "age" deve ser do tipo "number"';
    const messageEighteen = 'A pessoa palestrante deve ser maior de idade';
    const messageAgeInt = 'O campo "age" deve ser um "number" do tipo inteiro';
    if (!age) {
        return res.status(400).json({ message: messageAge });
    } if (typeof age !== 'number') {
        return res.status(400).json({ message: messageAgeNumber });
    } if (age < 18) {
        return res.status(400).json({ message: messageEighteen });
    } if (!Number.isInteger(age)) { // is interger mostra a condicao do inteiro
        return res.status(400).json({ message: messageAgeInt });
    } 
    next();
}

module.exports = identificationAge;