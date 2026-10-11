export const notFoundHandler = (req, res) => {
    res.status(404).json({ status: 'error', message: `Ruta NO ENCONTRADA: ${req.originalUrl}` });
};

/*cuatro parametros del midleware*/
export const errorHandler = (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ status: 'error', message: 'El body no es un JSON válido' });
    }

    if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).json({ status: 'error', message: 'Datos inválidos' });
    }

    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
};