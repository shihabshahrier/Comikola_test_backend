const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const app = require('../utils/firebase');

const auth = getAuth(app);

const authController = {
  // Sign up new user
  signup: async (req, res) => {
    try {
      const { email, password } = req.body;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      res.status(201).json({
        message: 'User created successfully',
        user: {
          uid: user.uid,
          email: user.email
        }
      });
    } catch (error) {
      let errorMessage = 'Error creating user';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
      }

      res.status(400).json({ message: errorMessage, error: error.code });
    }
  },

  // Sign in existing user
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the ID token
      const idToken = await user.getIdToken();

      res.json({
        message: 'Login successful',
        user: {
          uid: user.uid,
          email: user.email
        },
        token: idToken
      });
    } catch (error) {
      let errorMessage = 'Error signing in';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
      }

      res.status(400).json({ message: errorMessage, error: error.code });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      await signOut(auth);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error: error.code });
    }
  }
};

module.exports = authController;