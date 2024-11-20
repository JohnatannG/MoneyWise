import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import '../styles/ReceitasModal.css';

export default function ReceitasModal({ onClose }) {
    const [revenues, setRevenues] = useState([]);
    const [formRevenue, setFormRevenue] = useState({
        date: '',
        category: '',
        value: '',
    });
    const [editingRevenue, setEditingRevenue] = useState(null);

    useEffect(() => {
        fetchRevenues();
    }, []);

    const fetchRevenues = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/revenues', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log('Receitas recebidas:', response.data);
            setRevenues(response.data);
        } catch (error) {
            console.error('Erro ao carregar as receitas:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormRevenue({ ...formRevenue, [name]: value });
    };

    const handleAddOrEditRevenue = async () => {
        try {
            const formattedDate = new Date(formRevenue.date).toISOString();
            if (isNaN(new Date(formattedDate))) {
                alert('Data inválida!');
                return;
            }
    
            setFormRevenue(prevState => ({
                ...prevState,
                date: formattedDate
            }));
    
            if (!formRevenue.category || !formRevenue.value) {
                alert('Todos os campos são obrigatórios!');
                return;
            }
    
            console.log('Enviando dados para o servidor:', formRevenue);
    
            const url = editingRevenue
                ? `http://localhost:5000/api/revenues/${editingRevenue._id}`
                : 'http://localhost:5000/api/revenues/add';
            const method = editingRevenue ? 'put' : 'post';
    
            const response = await axios[method](url, { ...formRevenue }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
    
            if (editingRevenue) {
                setRevenues(revenues.map(rev => rev._id === response.data.revenue._id ? response.data.revenue : rev));
            } else {
                setRevenues([...revenues, response.data.revenue]);
            }
    
            resetForm();
            fetchRevenues();
        } catch (error) {
            console.error('Erro ao adicionar/editar receita:', error);
            alert(error.response?.data?.message || 'Erro ao processar a requisição!');
        }
    };

    const handleRemoveRevenue = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/revenues/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRevenues(revenues.filter(rev => rev._id !== id));
        } catch (error) {
            console.error('Erro ao excluir receita:', error);
        }
    };

    const editRevenue = (revenue) => {
        setEditingRevenue(revenue);
        const formattedDate = revenue.date ? new Date(revenue.date) : null;
        const dateString = formattedDate && !isNaN(formattedDate) ? formattedDate.toISOString().split('T')[0] : '';
        setFormRevenue({ date: dateString, category: revenue.category, value: revenue.value });
    };

    const resetForm = () => {
        setFormRevenue({ date: '', category: '', value: '' });
        setEditingRevenue(null);
    };

    return (
        <div className="ReceitasModal">
            <div className="ModalContent">
                <div className="ModalHeader">
                    <h3>Receitas</h3>
                    <X size={24} onClick={onClose} />
                </div>
                <div className="ModalBody">
                    <div className="ScrollableTable">
                    <table className="RevenuesTable">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenues.map((revenue) => (
                                <tr key={revenue._id}>
                                    <td>
                                        {revenue.date && !isNaN(new Date(revenue.date))
                                            ? new Date(new Date(revenue.date).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).toISOString().split('T')[0]
                                            : 'Data inválida'}
                                    </td>
                                    <td>{revenue.category}</td>
                                    <td>R$ {revenue.value}</td>
                                    <td className='gap-button-receitas'>
                                        <button className="button-editar-receitas" onClick={() => editRevenue(revenue)}>Editar</button>
                                        <button className="button-deletar-receitas" onClick={() => handleRemoveRevenue(revenue._id)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                    <div className="AddRevenueForm">
                        <h4>{editingRevenue ? 'Editar receita' : 'Adicionar receita'}</h4>
                        <input 
                            type="date"
                            name="date"
                            value={formRevenue.date}
                            onChange={handleInputChange}
                            max="9999-12-31" 
                        />
                        <input placeholder='Digite a categoria' type="text" name="category" value={formRevenue.category} onChange={handleInputChange} />
                        <input placeholder='Digite o valor' type="number" name="value" value={formRevenue.value} onChange={handleInputChange} />
                        <div className='button-style-form'>
                            <button onClick={handleAddOrEditRevenue} className='addicionarOrAtualizar'>
                                {editingRevenue ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button className='Cancelar' onClick={resetForm}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
