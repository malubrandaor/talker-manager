function identificationToken(req, res, next) {
    const { authorization } = req.headers;
    const messageAuthorization = 'Token não encontrado';
    const messageInvalid = 'Token inválido';

    if (!authorization) {
        return res.status(401).json({ message: messageAuthorization });
    } if (authorization.length !== 16 || typeof authorization !== 'string') {
        return res.status(401).json({ message: messageInvalid });
    }
    next();
}
module.exports = identificationToken;