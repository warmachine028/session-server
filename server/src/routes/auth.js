import express from 'express'
import { logIn, logOut, signUp } from '../controllers/auth.js'
import { authRoute, privateRoute } from '../middlewares/index.js'

const router = express.Router()

router.post('/login', authRoute, logIn)
router.post('/signup', authRoute, signUp)
router.post('/logout', privateRoute, logOut)

export default router
