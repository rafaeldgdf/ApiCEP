import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

const ListaUsuariosEnderecos = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Faz a requisição para o backend para buscar os usuários com endereços
    axios.get('http://localhost:8080/usuarios')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Erro ao buscar usuários', error));
  }, []);

  return (
    <div className="listaUsuarios">
      <h2>Endereços Cadastrados</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.nome}</strong> - 
            {usuario.enderecos && usuario.enderecos.length > 0 ? (
              <span>{usuario.enderecos[0].cep} - {usuario.enderecos[0].numero}</span>
            ) : (
              <span>Sem endereço cadastrado</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaUsuariosEnderecos;
