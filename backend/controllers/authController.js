const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Login bem-sucedido!", token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: "Erro ao fazer login.", error });
    }
}

async function register(req, res) {
    try {
        const { name, email, password, income} = req.body;  

        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está registrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            income
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: "Usuário registrado com sucesso!", token });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário.", error });
    }
}

const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ name: user.name, income: user.income });
    } catch (error) {
        
        res.status(500).json({ message: "Erro ao buscar dados do usuário.", error });
    }
};

module.exports = { register, login, getUserData };
