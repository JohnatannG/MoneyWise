import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Filledbutton from '../Components/Filledbutton';
import Logo from '../Components/Logo';
import '../styles/Register.css';
import { CircleCheck, CircleX } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [income, setIncome] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const parsedIncome = parseFloat(income);
        if (isNaN(parsedIncome)) {
            setError('Renda mensal inválida!');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword, income }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message)
                localStorage.setItem('token', data.token);  

                setTimeout(() => {
                    navigate('/dashboard'); 
                }, 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Erro ao registrar usuário. Tente novamente.');
        }
    };

    return (
        <main className='Register'>
            <Logo />
            <div className='Text-register'>
                <h1 className='Tittle-register'>Cadastre-se e comece a controlar suas finanças agora!</h1>
                <p className='Paragraph-register'>
                    Junte-se a nós e tenha o controle total dos seus gastos. Defina metas, acompanhe suas despesas e planeje um futuro financeiro mais seguro!
                </p>
                <p className='RegisterOrLogin'>
                    Já tem cadastro? <Link to='/'>Faça Login</Link>
                </p>
            </div>

            {message && <p className="success"> <CircleCheck/> {message}</p>}
            {error && <p className="error"> <CircleX/> {error}  </p>}


            <div className='Forms'>
                <form onSubmit={handleSubmit} className='forms-inputs'>
                    <input type="text" placeholder='Digite seu nome' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder='Digite seu e-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Digite sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder='Confirme sua senha' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <input type="number" placeholder='Digite sua renda mensal' value={income} onChange={(e) => setIncome(e.target.value)} />

                    <Filledbutton text={'Cadastrar'} />
                </form>
            </div>
        </main>
    );
}
