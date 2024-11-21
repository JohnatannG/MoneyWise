const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log('Email recebido:', email);
        
        console.log('Dados recebidos para login:', { email, password });

        const user = await User.findOne({ email });
        console.log('Usuário encontrado:', user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Senha incorreta ou usuário não encontrado.');
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
        const { name, email, password, income} = req.body;  // Adicionei o campo name para o registro do usuário
        console.log('Dados recebidos para registro:', { name, email, password });

        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Erro: Usuário já existe com o email:', email);
            return res.status(400).json({ message: "Este e-mail já está registrado." });
        }

        // Cria o hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            income
        });

        // Salva o usuário no banco de dados
        await newUser.save();

        // Cria o token JWT após o registro
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: "Usuário registrado com sucesso!", token });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: "Erro ao registrar usuário.", error });
    }
}

const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('Erro: Usuário não encontrado:', req.user.id);
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ name: user.name, income: user.income });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ message: "Erro ao buscar dados do usuário.", error });
    }
};

module.exports = { register, login, getUserData };
