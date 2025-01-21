// src/models/User.js
class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = User;

// src/repositories/base/BaseRepository.js
class BaseRepository {
    constructor() {
        this.items = [];
    }

    async findAll() {
        return this.items;
    }

    async findById(id) {
        return this.items.find(item => item.id === id);
    }

    async create(item) {
        this.items.push(item);
        return item;
    }

    async update(id, item) {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...item };
            return this.items[index];
        }
        return null;
    }

    async delete(id) {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = BaseRepository;

// src/repositories/UserRepository.js
const BaseRepository = require('./base/BaseRepository');
const { AppError } = require('../utils/errorHandler');

class UserRepository extends BaseRepository {
    async findByUsername(username) {
        return this.items.find(user => user.username === username);
    }

    async createUser(userData) {
        const existingUser = await this.findByUsername(userData.username);
        if (existingUser) {
            throw new AppError('Username already exists', 409);
        }
        
        const newUser = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return this.create(newUser);
    }
}

module.exports = UserRepository;

// src/services/AuthService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    }

    async register(username, password) {
        if (!username || !password) {
            throw new AppError('Username and password are required', 400);
        }

        if (password.length < 6) {
            throw new AppError('Password must be at least 6 characters', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await this.userRepository.createUser({
            username,
            password: hashedPassword
        });

        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
        };
    }

    async login(username, password) {
        if (!username || !password) {
            throw new AppError('Username and password are required', 400);
        }

        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid password', 401);
        }

        const token = this.generateToken(user);
        
        return {
            token,
            user: {
                id: user.id,
                username: user.username
            }
        };
    }

    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id,
                username: user.username 
            },
            this.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }
}

module.exports = AuthService;

// src/controllers/AuthController.js
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await this.authService.register(username, password);
            
            res.status(201).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await this.authService.login(username, password);
            
            res.json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = req.user; // Set by auth middleware
            
            res.json({
                status: 'success',
                data: {
                    user,
                    profile: {
                        lastLogin: new Date(),
                        accountType: 'user'
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;

// src/middleware/authMiddleware.js
const { AppError } = require('../utils/errorHandler');

function authMiddleware(authService) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                throw new AppError('No token provided', 401);
            }

            const decoded = authService.verifyToken(token);
            req.user = decoded;
            
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = authMiddleware;

// src/routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

function setupAuthRoutes(authController, authService) {
    const router = express.Router();

    router.post('/register', authController.register.bind(authController));
    router.post('/login', authController.login.bind(authController));
    router.get('/profile', 
        authMiddleware(authService),
        authController.getProfile.bind(authController)
    );

    return router;
}

module.exports = setupAuthRoutes;

// src/app.js
const express = require('express');
const cors = require('cors');
const { handleError } = require('./utils/errorHandler');
const UserRepository = require('./repositories/UserRepository');
const AuthService = require('./services/AuthService');
const AuthController = require('./controllers/AuthController');
const setupAuthRoutes = require('./routes/authRoutes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Setup dependencies
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Setup routes
app.use('/api', setupAuthRoutes(authController, authService));

// Error handling middleware
app.use(handleError);

module.exports = app;

// src/server.js
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});