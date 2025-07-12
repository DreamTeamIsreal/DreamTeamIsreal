import { Router } from 'express';
import { authController } from '../controllers/authController';
import { 
  registrationRateLimit, 
  authRateLimit, 
  mfaRateLimit,
  validateInput,
  registrationValidation,
  loginValidation,
  mfaValidation
} from '../middleware/security';
import { authenticate, voterOrHigher } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', 
  registrationRateLimit,
  validateInput(registrationValidation),
  (req, res) => authController.register(req, res)
);

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login',
  authRateLimit,
  validateInput(loginValidation),
  (req, res) => authController.login(req, res)
);

/**
 * POST /api/auth/verify-mfa
 * Verify MFA code and complete login
 */
router.post('/verify-mfa',
  mfaRateLimit,
  validateInput(mfaValidation),
  (req, res) => authController.verifyMFA(req, res)
);

/**
 * GET /api/auth/mfa-setup
 * Setup MFA for authenticated user
 */
router.get('/mfa-setup',
  voterOrHigher,
  authController.setupMFA.bind(authController)
);

/**
 * POST /api/auth/mfa-enable
 * Enable MFA after verification
 */
router.post('/mfa-enable',
  voterOrHigher,
  validateInput(mfaValidation),
  authController.enableMFA.bind(authController)
);

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
router.post('/refresh-token',
  authController.refreshToken.bind(authController)
);

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile',
  authenticate,
  authController.getProfile.bind(authController)
);

export default router;