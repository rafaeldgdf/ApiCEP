import React, { useState, useEffect } from 'react';
import '../styles/App.css';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]); 
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Para exibir detalhes
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/usuarios') 
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
        setUsuarios([]);
      });
  }, []);

  const abrirUsuario = (usuario) => {
    setUsuarioSelecionado(usuario); // Exibir modal de detalhes
  };

  const editarUsuario = (usuario) => {
    setEditandoUsuario(usuario); // Exibir modal de edição
  };

  const confirmarDelecao = (usuario) => {
    setUsuarioParaDeletar(usuario); // Exibir modal de confirmação
  };

  const deletarUsuario = () => {
    fetch(`http://localhost:8080/usuarios/${usuarioParaDeletar.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsuarios(usuarios.filter((user) => user.id !== usuarioParaDeletar.id));
        setUsuarioParaDeletar(null);
      })
      .catch((error) => console.error('Erro ao deletar usuário:', error));
  };

  return (
    <div>
      <h2>Usuários Cadastrados</h2>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              <strong>{usuario.nome}</strong> - {usuario.enderecos[0]?.cep || 'Sem CEP'} - Endereço: {usuario.enderecos.length}
              <button onClick={() => abrirUsuario(usuario)}>Abrir</button>
              <button onClick={() => editarUsuario(usuario)}>Editar</button>
              <button onClick={() => confirmarDelecao(usuario)}>Deletar</button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal para Detalhes */}
      {usuarioSelecionado && (
        <div className="modal">
          <h3>Detalhes do Usuário</h3>
          <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
          {usuarioSelecionado.enderecos.length > 0 ? (
            <div>
              <h4>Endereço:</h4>
              <p><strong>CEP:</strong> {usuarioSelecionado.enderecos[0].cep}</p>
              <p><strong>Logradouro:</strong> {usuarioSelecionado.enderecos[0].logradouro}</p>
              <p><strong>Número:</strong> {usuarioSelecionado.enderecos[0].numero}</p>
              <p><strong>Bairro:</strong> {usuarioSelecionado.enderecos[0].bairro}</p>
              <p><strong>Localidade:</strong> {usuarioSelecionado.enderecos[0].localidade}</p>
              <p><strong>UF:</strong> {usuarioSelecionado.enderecos[0].uf}</p>
            </div>
          ) : (
            <p>Sem endereço cadastrado.</p>
          )}
          <button onClick={() => setUsuarioSelecionado(null)}>Fechar</button>
        </div>
      )}

      {/* Modal para Editar */}
      {editandoUsuario && (
        <div className="modal">
          <h3>Editar Usuário</h3>
          <label>Nome:</label>
          <input 
            type="text" 
            value={editandoUsuario.nome} 
            onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })}
          />
          <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
          <button onClick={() => {
              fetch(`http://localhost:8080/usuarios/${editandoUsuario.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(editandoUsuario),
              })
              .then(response => response.json())
              .then(data => {
                const novosUsuarios = usuarios.map(usuario => 
                  usuario.id === data.id ? data : usuario
                );
                setUsuarios(novosUsuarios);
                setEditandoUsuario(null);
              })
              .catch(error => console.error('Erro ao salvar usuário', error));
          }}>Salvar</button>
        </div>
      )}

      {/* Modal para Deletar */}
      {usuarioParaDeletar && (
        <div className="modal">
          <h3>Tem certeza que deseja deletar o usuário {usuarioParaDeletar.nome}?</h3>
          <button onClick={() => setUsuarioParaDeletar(null)}>Cancelar</button>
          <button onClick={deletarUsuario}>Deletar</button>
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;
