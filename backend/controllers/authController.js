const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(req, res) {
    try {
        const { name, email, password, confirmPassword, income } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "As senhas não coincidem!" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está em uso." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, income });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: "Usuário registrado com sucesso!", token, userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário.", error });
    }
}

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
        res.status(500).json({ message: "Erro ao fazer login.", error });
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