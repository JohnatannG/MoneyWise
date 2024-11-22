import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Filledbutton from '../Components/Filledbutton';
import Logo from '../Components/Logo';
import '../styles/Login.css';
import { CircleCheck, CircleX } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Enviando:', { email, password });

        setMessage('');
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Resposta:', data);

            if (response.ok) {
                // Exibe mensagem de sucesso
                setMessage(data.message);
                // Armazena o token no localStorage
                localStorage.setItem('token', data.token);

                // Redireciona após 2 segundos
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                console.log("Senha fornecida:", password);
                console.log("Senha armazenada:", user.password);

                setError(data.message || 'Credenciais inválidas.');
            }
        } catch (error) {
            // Exibe mensagem de erro genérica
            setError('Erro ao fazer login. Tente novamente mais tarde.');
        }
    };

    return (
        <main className="Login">
            <Logo />
            <div className="Text-register">
                <h1 className="Tittle-register">Bem-vindo de volta! Vamos gerenciar suas finanças?</h1>
                <p className="Paragraph-register">
                    Entre na sua conta para ver suas receitas, despesas e continuar atingindo suas metas financeiras.
                </p>
                <p className="RegisterOrLogin">
                    Não tem uma conta? <Link to="/Register">Cadastre-se</Link>
                </p>
            </div>

            {/* Mensagens de sucesso ou erro */}
            {message && <p className="success"><CircleCheck size={18} /> {message}</p>}
            {error && <p className="error"><CircleX size={18} /> {error}</p>}

            <div className="Forms">
                <form onSubmit={handleSubmit} className="forms-inputs">
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Filledbutton text="Entrar" />
                </form>
            </div>
        </main>
    );
}
