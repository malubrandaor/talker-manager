function identificationRate(req, res, next) {
    const { talk } = req.body;
    const messageRate = 'O campo "rate" é obrigatório';
    const messageRateInt = 'O campo "rate" deve ser um inteiro de 1 à 5';
    if (talk.rate === undefined) {
        return res.status(400).json({ message: messageRate });
    } if (talk.rate < 1 || talk.rate > 5) {
        return res.status(400).json({ message: messageRateInt });
    }
    if (!Number.isInteger(talk.rate)) {
        return res.status(400).json({ message: messageRateInt });
    }
    next();
}

module.exports = identificationRate;