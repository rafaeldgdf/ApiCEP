import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Para exibir detalhes
    const [editandoUsuario, setEditandoUsuario] = useState(null); // Para edição

    useEffect(() => {
        // Fetch usuários from API
        axios.get('/api/usuarios')
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Erro ao carregar usuários", error));
    }, []);

    const abrirUsuario = (usuario) => {
        // Exibir os detalhes do usuário selecionado
        setUsuarioSelecionado(usuario);
    };

    const editarUsuario = (usuario) => {
        // Preparar o estado para editar o usuário
        setEditandoUsuario(usuario);
    };

    const deletarUsuario = (id) => {
        // Função para deletar o usuário
        axios.delete(`/api/usuarios/${id}`)
            .then(() => {
                // Remove o usuário da lista local sem recarregar a página
                setUsuarios(usuarios.filter(usuario => usuario.id !== id));
                // Limpar o estado se o usuário que estava aberto foi deletado
                if (usuarioSelecionado && usuarioSelecionado.id === id) {
                    setUsuarioSelecionado(null);
                }
            })
            .catch(error => console.error("Erro ao deletar usuário", error));
    };

    const salvarEdicao = (usuarioEditado) => {
        // Simula o salvamento da edição (pode ser uma requisição PUT)
        axios.put(`/api/usuarios/${usuarioEditado.id}`, usuarioEditado)
            .then(response => {
                const novosUsuarios = usuarios.map(usuario => 
                    usuario.id === response.data.id ? response.data : usuario
                );
                setUsuarios(novosUsuarios);
                setEditandoUsuario(null); // Limpar formulário de edição
            })
            .catch(error => console.error("Erro ao salvar usuário", error));
    };

    return (
        <div>
            <h1>Usuários Cadastrados</h1>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id} className="usuario-item">
                        <div className="usuario-info">
                            <strong>{usuario.nome}</strong> - 
                            CEP: {usuario.enderecos && usuario.enderecos.length > 0 ? usuario.enderecos[0].cep : 'Sem CEP'}
                        </div>
                        <div className="acoes">
                            <button className="abrir-btn" onClick={() => abrirUsuario(usuario)}>Abrir</button>
                            <button className="editar-btn" onClick={() => editarUsuario(usuario)}>Editar</button>
                            <button className="deletar-btn" onClick={() => deletarUsuario(usuario.id)}>Deletar</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Exibir os detalhes do usuário */}
            {usuarioSelecionado && (
                <div className="detalhes-usuario">
                    <h3>Detalhes do Usuário</h3>
                    <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
                    {usuarioSelecionado.enderecos && usuarioSelecionado.enderecos.length > 0 ? (
                        <div>
                            <h4>Endereço:</h4>
                            <p><strong>CEP:</strong> {usuarioSelecionado.enderecos[0].cep}</p>
                            <p><strong>Logradouro:</strong> {usuarioSelecionado.enderecos[0].logradouro}</p>
                            <p><strong>Bairro:</strong> {usuarioSelecionado.enderecos[0].bairro}</p>
                            <p><strong>Localidade:</strong> {usuarioSelecionado.enderecos[0].localidade}</p>
                            <p><strong>UF:</strong> {usuarioSelecionado.enderecos[0].uf}</p>
                        </div>
                    ) : (
                        <p>Sem endereço cadastrado</p>
                    )}
                    <button onClick={() => setUsuarioSelecionado(null)}>Fechar Detalhes</button>
                </div>
            )}

            {/* Exibir o formulário de edição do usuário */}
            {editandoUsuario && (
                <div className="editar-usuario">
                    <h3>Editar Usuário</h3>
                    <input 
                        type="text" 
                        value={editandoUsuario.nome} 
                        onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })}
                    />
                    {/* Campos para editar endereço */}
                    {editandoUsuario.enderecos && editandoUsuario.enderecos.length > 0 && (
                        <div>
                            <input 
                                type="text" 
                                value={editandoUsuario.enderecos[0].cep} 
                                onChange={(e) => {
                                    const enderecoEditado = { ...editandoUsuario.enderecos[0], cep: e.target.value };
                                    setEditandoUsuario({
                                        ...editandoUsuario,
                                        enderecos: [enderecoEditado]
                                    });
                                }}
                            />
                            {/* Outros campos de endereço podem ser editados aqui */}
                        </div>
                    )}
                    <button onClick={() => salvarEdicao(editandoUsuario)}>Salvar</button>
                    <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Usuarios;
