const formatIssues = issues =>
    issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }));

export const validateBody = schema => (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos de entrada inválidos',
            errors: formatIssues(result.error.issues)
        });
    }
    req.body = result.data;/*body validado y limpio*/
    next();
};

export const validateQuery = schema => (req, res, next) => {
    const query = Object.fromEntries(Object.entries(req.query).filter(([, value]) => value !== ''));
    const result = schema.safeParse(query);
    if (!result.success) {
        return res.status(400).json({
            status: 'error',
            message: 'Parámetros de consulta inválidos',
            errors: formatIssues(result.error.issues)
        });
    }
    req.validatedQuery = result.data;
    next();
};