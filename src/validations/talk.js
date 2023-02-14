function identificationTalk(req, res, next) {
    const { talk } = req.body;
    const messageWatchedAt = 'O campo "watchedAt" é obrigatório';
    const messageWatchedDate = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
    const messageTalk = 'O campo "talk" é obrigatório';
    const dateGenerator = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    if (!talk) {
        return res.status(400).json({ message: messageTalk });
    }
    if (!talk.watchedAt) {
        return res.status(400).json({ message: messageWatchedAt });
    } if (!dateGenerator.test(talk.watchedAt)) {
        return res.status(400).json({ message: messageWatchedDate });
    } 
    return next();
}

module.exports = identificationTalk;