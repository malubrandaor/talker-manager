function identificationName(req, res, next) {
    const { name } = req.body;
    const messageNameObligation = 'O campo "name" é obrigatório';
    const messageNameCondition = 'O "name" deve ter pelo menos 3 caracteres';
    if (!name) {
        return res.status(400).json({ message: messageNameObligation });
    } if ((name.length < 3)) {
        return res.status(400).json({ message: messageNameCondition });
    }
    next();
}

module.exports = identificationName;