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

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                localStorage.setItem('token', data.token);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Erro ao fazer login. Tente novamente.');
        }
    };

    return (
        <main className='Login'>
            <Logo />
            <div className='Text-register'>
                <h1 className='Tittle-register'>Bem-vindo de volta! Vamos gerenciar suas finanças?</h1>
                <p className='Paragraph-register'>
                    Entre na sua conta para ver suas receitas, despesas e continuar atingindo suas metas financeiras.
                </p>
                <p className='RegisterOrLogin'>
                    Não tem uma conta? <Link to='/Register'>Cadastra-se</Link>
                </p>
            </div>

            {message && <p className="success"> <CircleCheck/> {message}</p>}
            {error && <p className="error"> <CircleX/> {error}  </p>}

            <div className='Forms'>
                <form onSubmit={handleSubmit} className='forms-inputs'>
                    <input type="email" placeholder='Digite seu e-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Digite sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Filledbutton text={'Entrar'} />
                </form>
            </div>
        </main>
    );
}
