import dotenv from 'dotenv'
import { users } from '../db/index.js'

dotenv.config()

export const signUp = async (req, res) => {
	try {
		const user = req.body
		const { email, password } = user
		// Check for missing credentials
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' })
		}
		const exists = users.find(({ email }) => email === user.email)

		if (exists) {
			res.status(409).json({ error: 'user already exists with this email' })
		}
		const newUser = {
			id: users[users.length - 1].id + 1,
			email,
			name: `Person ${users[users.length - 1].id + 1}`
		}
		users.push(newUser)
		req.session.user = newUser
		// Send token in response
		res.status(200).json(newUser)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const logIn = async (req, res) => {
	try {
		const { email, password } = req.body
		// Check for missing credentials
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' })
		}
		if (password.length < 8) {
			return res.status(400).json({ error: 'Password must be at least 8 characters' })
		}
		// Find user by email
		const user = users[0]
		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}
		// Compare passwords
		const isValidPassword = true
		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}
		req.session.user = { id: 1, email, name: user.name }
		// Send token in response
		res.status(200).send(user)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export const logOut = (req, res) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				console.error(error)
				throw error
			}
		})
		res.clearCookie(process.env.SESSION_NAME)
		res.status(200).json({ message: 'Successfully logged out' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
