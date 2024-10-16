import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import axios from 'axios'; 

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); 
  const [editandoUsuario, setEditandoUsuario] = useState(null); 
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null); 

  useEffect(() => {
    carregarUsuarios(); 
  }, []);

  const carregarUsuarios = () => {
    axios.get('http://localhost:8080/usuarios')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else {
          setUsuarios([]); 
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
        setUsuarios([]); 
      });
  };

  const abrirUsuario = (usuario) => {
    setUsuarioSelecionado(usuario); 
  };

  const editarUsuario = (usuario) => {
    console.log('Editando usuário com ID:', usuario.id_usuario);
    setEditandoUsuario(usuario);
  };

  const confirmarDelecao = (usuario) => {
    console.log('Usuário selecionado para deleção:', usuario.id_usuario);
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

    console.log('Salvando dados atualizados:', dadosAtualizados);

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

  return (
    <div>
      <h1>Usuários Cadastrados</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id_usuario}> 
              <strong>{usuario.nome}</strong> - 
              {usuario.enderecos && usuario.enderecos.length > 0 ? usuario.enderecos.cep : 'Sem CEP'} - 
              Endereços: {usuario.enderecos ? usuario.enderecos.length : 0}
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
          <div className="modal-content">
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
        </div>
      )}

      {/* Modal para Editar */}
      {editandoUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuário</h2>
            <div>
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={editandoUsuario.nome}
                onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })}
              />
            </div>
            <h3>Endereços:</h3>
            {editandoUsuario.enderecos && editandoUsuario.enderecos.map((endereco, index) => (
              <div key={endereco.id}> 
                <div>
                  <label htmlFor={`cep-${index}`}>CEP:</label>
                  <input
                    type="text"
                    id={`cep-${index}`}
                    value={endereco.cep}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].cep = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`logradouro-${index}`}>Logradouro:</label>
                  <input
                    type="text"
                    id={`logradouro-${index}`}
                    value={endereco.logradouro}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].logradouro = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                {/* ... outros campos de endereço ... */}
                <div>
                  <label htmlFor={`numero-${index}`}>Número:</label>
                  <input
                    type="text"
                    id={`numero-${index}`}
                    value={endereco.numero}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].numero = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`complemento-${index}`}>Complemento:</label>
                  <input
                    type="text"
                    id={`complemento-${index}`}
                    value={endereco.complemento}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].complemento = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`bairro-${index}`}>Bairro:</label>
                  <input
                    type="text"
                    id={`bairro-${index}`}
                    value={endereco.bairro}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].bairro = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`localidade-${index}`}>Localidade:</label>
                  <input
                    type="text"
                    id={`localidade-${index}`}
                    value={endereco.localidade}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].localidade = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`uf-${index}`}>UF:</label>
                  <input
                    type="text"
                    id={`uf-${index}`}
                    value={endereco.uf}
                    onChange={(e) => {
                      const novosEnderecos = [...editandoUsuario.enderecos];
                      novosEnderecos[index].uf = e.target.value;
                      setEditandoUsuario({ ...editandoUsuario, enderecos: novosEnderecos });
                    }}
                  />
                </div>
              </div>
            ))}
            <button onClick={salvarEdicao}>Salvar</button>
            <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal para Deletar */}
      {usuarioParaDeletar && (
        <div className="modal">
          <div className="modal-content">
            <p>Tem certeza que deseja deletar o usuário <strong>{usuarioParaDeletar.nome}</strong>?</p>
            <button onClick={() => setUsuarioParaDeletar(null)}>Cancelar</button>
            <button onClick={deletarUsuario}>Deletar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;