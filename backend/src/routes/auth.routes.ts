import { Router } from 'express';

const router = Router();

// Example: Signup endpoint
router.post('/signup', (req, res) => {
  res.status(200).json({ success: true, message: 'Signup endpoint working.' });
});

// Example: Login endpoint
router.post('/login', (req, res) => {
  res.status(200).json({ success: true, message: 'Login endpoint working.' });
});

export default router;
