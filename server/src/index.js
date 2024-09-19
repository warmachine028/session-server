import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import { fileURLToPath } from 'url'
import { userRoutes, authRoutes } from './routes/index.js'
import { privateRoute, authRoute } from './middlewares/index.js'

dotenv.config()

const __dirname = fileURLToPath(import.meta.url)
const PORT = process.env.PORT || 1900

const app = express()

app.get('/', (_, res) => res.send('Hello from session server'))
	.use(
		express.urlencoded({ extended: false }),
		session({
			name: process.env.SESSION_NAME,
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: false,
			cookie: { maxAge: 60 * 1000 * 60 * 3 } // 3 hours
		}),
		express.static(path.join(path.dirname(__dirname), 'public')),
		express.json(),
		(req, res, next) => {
			res.locals.user = req.session.user
			next()
		}
	)
	.use('/auth', authRoutes)
	.use('/users', privateRoute, userRoutes)
	// view stuff
	// .set('views', path.join(path.dirname(__dirname), 'views'))
	// .set('view engine', 'ejs')
	// .get('/home', privateRoute, (_, res) => res.render('Home'))
	// .get('/login', authRoute, (_, res) => res.render('Login', { error: null }))
	.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀🚀`))
