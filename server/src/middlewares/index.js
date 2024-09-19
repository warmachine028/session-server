// Protected route
export const privateRoute = (req, res, next) => {
	if (!req.session.user) {
		return res.status(401).json({ error: 'unauthorized' })
	}
	next()
}
// auth route
export const authRoute = (req, res, next) => {
	if (req.session.user) {
		return res.status(401).json({ error: 'Unauthorized' })
	}
	next()
}

export const storeUser = (req, res, next) => {
	res.locals.user = req.session.user
	next()
}