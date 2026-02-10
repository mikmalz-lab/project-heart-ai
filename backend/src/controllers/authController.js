const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        res.json({
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: google_id } = payload;

        let user = await User.findOne({ where: { email } });

        if (user) {
            // User exists, check if google_id is set
            if (!user.google_id) {
                user.google_id = google_id;
                user.avatar_url = picture;
                if (user.auth_provider === 'local') {
                    // Start supporting google login too
                    // user.auth_provider = 'google'; // Optional: keep as local or switch? Let's keep existing provider but link google_id
                }
                await user.save();
            }
        } else {
            // New user, create account
            user = await User.create({
                email,
                name,
                google_id,
                avatar_url: picture,
                auth_provider: 'google',
                role: 'buyer', // Default role
                password: null // No password for google auth
            });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });

    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ msg: 'Google Authentication Failed' });
    }
};
