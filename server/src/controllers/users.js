import { users as Users } from '../db/index.js'

export const getUser = async (req, res) => {
	const { id } = req.params
	try {
		const user = Users.find((r) => id === r.id.toString())
		if (user) {
			return res.status(200).json(user)
		}
		res.status(404).json({ error: 'User not found' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Find user
export const getUsers = async (req, res) => {
	try {
		const users = Users
		const { name, email, id } = req.query
		let results = [...users]
		if (name) {
			results = results.filter((r) => r.name === name)
		}
		if (email) {
			results = results.filter((r) => r.email === email)
		}
		if (id) {
			results = results.filter((r) => id === r.id.toString())
		}
		res.status(200).json(results)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
