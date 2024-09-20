import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { userRoutes, authRoutes } from './routes/index.js'
import { privateRoute, authRoute, storeUser } from './middlewares/index.js'

dotenv.config()

const __dirname = fileURLToPath(import.meta.url)

const PORT = process.env.PORT || 3000
const app = express()

app.get('/', (_, res) => res.send('Hello from session server'))
	.use(
		express.urlencoded({ extended: false }),
		session({
			name: process.env.SESSION_NAME,
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: false,
			cookie: {
				maxAge: 60 * 1000 * 60 * 3,
				httpOnly: true,
				// secure: process.env.NODE_ENV === 'production'
			} // 3 hours
		}),
		cookieParser(),
		csrf({ cookie: true }),
		storeUser,
		express.static(path.resolve(path.dirname(__dirname), '../public')),
	)
	.use('/auth', authRoutes)
	.use('/users', privateRoute, userRoutes)
	// view stuff
	.set('views', path.join(path.dirname(__dirname), 'views'))
	.set('view engine', 'ejs')
	.get('/home', privateRoute, (_, res) => res.render('Home'))
	.get('/login', authRoute, (_, res) => res.render('Login', { error: null }))
	.get('/signup', authRoute, (_, res) => res.render('Signup', { error: null }))
	.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} 🚀🚀`))
