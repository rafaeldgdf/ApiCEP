import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); 
  const [editandoUsuario, setEditandoUsuario] = useState(null); 
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    axios.get('http://localhost:8080/usuarios')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error("Erro ao carregar usuários", error));
  };

  const abrirUsuario = (usuario) => {
    setUsuarioSelecionado(usuario); 
  };

  const editarUsuario = (usuario) => {
    setEditandoUsuario(usuario); 
  };

  const confirmarDelecao = (usuario) => {
    setUsuarioParaDeletar(usuario); 
  };

  const deletarUsuario = () => {
    if (!usuarioParaDeletar || !usuarioParaDeletar.id_usuario) {
      console.error('ID do usuário a ser deletado está ausente!');
      return;
    }

    axios.delete(`http://localhost:8080/usuarios/${usuarioParaDeletar.id_usuario}`)
      .then(() => {
        setUsuarios(usuarios.filter((user) => user.id_usuario !== usuarioParaDeletar.id_usuario));
        setUsuarioParaDeletar(null); 
      })
      .catch((error) => console.error('Erro ao deletar usuário:', error));
  };

  const salvarEdicao = () => {
    if (!editandoUsuario || !editandoUsuario.id_usuario) {
      console.error('ID do usuário está ausente!');
      return;
    }

    const dadosAtualizados = {
      id_usuario: editandoUsuario.id_usuario, 
      nome: editandoUsuario.nome,
      enderecos: editandoUsuario.enderecos.map(endereco => ({
        id: endereco.id,
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        localidade: endereco.localidade,
        uf: endereco.uf
      }))
    };

    axios.put(`http://localhost:8080/usuarios/${editandoUsuario.id_usuario}`, dadosAtualizados)
      .then(response => {
        const novosUsuarios = usuarios.map(usuario =>
          usuario.id_usuario === response.data.id_usuario ? response.data : usuario
        );
        setUsuarios(novosUsuarios);
        setEditandoUsuario(null); 
      })
      .catch(error => console.error("Erro ao salvar usuário", error));
  };

  const atualizarUsuario = (campo, valor) => {
    setEditandoUsuario({
      ...editandoUsuario,
      [campo]: valor
    });
  };

  const atualizarEndereco = (indice, campo, valor) => {
    const enderecosAtualizados = [...editandoUsuario.enderecos];
    enderecosAtualizados[indice] = {
      ...enderecosAtualizados[indice],
      [campo]: valor
    };
    setEditandoUsuario({
      ...editandoUsuario,
      enderecos: enderecosAtualizados
    });
  };

  return (
    <div>
      <h1>Usuários Cadastrados</h1>
      {usuarios.map(usuario => (
        <div key={usuario.id_usuario}> 
          <strong>{usuario.nome}</strong> - 
          CEP: {usuario.enderecos && usuario.enderecos.length > 0 ? usuario.enderecos.cep : 'Sem CEP'} - 
          Número: {usuario.enderecos && usuario.enderecos.length > 0 ? usuario.enderecos.numero : 'Sem Número'}
          <button onClick={() => abrirUsuario(usuario)}>Abrir</button>
          <button onClick={() => editarUsuario(usuario)}>Editar</button>
          <button onClick={() => confirmarDelecao(usuario)}>Deletar</button>
        </div>
      ))}

      {/* Modal para Detalhes */}
      {usuarioSelecionado && (
        <div className="modal">
          <h2>Detalhes do Usuário</h2>
          <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
          {usuarioSelecionado.enderecos && usuarioSelecionado.enderecos.length > 0 ? (
            <div>
              <h3>Endereço:</h3>
              <p><strong>CEP:</strong> {usuarioSelecionado.enderecos.cep}</p>
              <p><strong>Logradouro:</strong> {usuarioSelecionado.enderecos.logradouro}</p>
              <p><strong>Número:</strong> {usuarioSelecionado.enderecos.numero}</p>
              <p><strong>Bairro:</strong> {usuarioSelecionado.enderecos.bairro}</p>
              <p><strong>Localidade:</strong> {usuarioSelecionado.enderecos.localidade}</p>
              <p><strong>UF:</strong> {usuarioSelecionado.enderecos.uf}</p>
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
          <h2>Editar Usuário</h2>
          <div>
            <label htmlFor="nome">Nome:</label>
            <input 
              type="text" 
              id="nome" 
              value={editandoUsuario.nome} 
              onChange={(e) => atualizarUsuario('nome', e.target.value)} 
            />
          </div>
          {editandoUsuario.enderecos && editandoUsuario.enderecos.map((endereco, index) => (
            <div key={index}> 
              <h3>Endereço {index + 1}:</h3> 
              <div>
                <label htmlFor={`cep-${index}`}>CEP:</label>
                <input 
                  type="text" 
                  id={`cep-${index}`} 
                  value={endereco.cep} 
                  onChange={(e) => atualizarEndereco(index, 'cep', e.target.value)} 
                />
              </div>
              {/* Repita a estrutura acima para os outros campos de endereço */}
              {/* ... */}
            </div>
          ))}
          <button onClick={salvarEdicao}>Salvar</button>
          <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
        </div>
      )}

      {/* Modal para Deletar */}
      {usuarioParaDeletar && (
        <div className="modal">
          <p>Tem certeza que deseja deletar o usuário {usuarioParaDeletar.nome}?</p>
          <button onClick={() => setUsuarioParaDeletar(null)}>Cancelar</button>
          <button onClick={deletarUsuario}>Deletar</button>
        </div>
      )}
    </div>
  );
};

export default Usuarios;