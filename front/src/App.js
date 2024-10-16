import React, { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import ListaUsuarios from './components/ListaUsuarios'; 

function App() {
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

  // Função para alternar entre exibir e ocultar a lista de usuários
  const toggleMostrarUsuarios = () => {
    setMostrarUsuarios(!mostrarUsuarios);
  };

  return (
    <div className="App">
      <h1>ViaCEP - Sistema de Cadastro de Endereços</h1>

      {/* Formulário de cadastro de usuários */}
      <CadastroUsuario />

      {/* Botão para listar usuários cadastrados */}
      <button onClick={toggleMostrarUsuarios} className="botao-listar-usuarios">
        {mostrarUsuarios ? 'Ocultar Usuários Cadastrados' : 'Listar Usuários Cadastrados'}
      </button>

      {/* Renderiza a lista de usuários se o botão for clicado */}
      {mostrarUsuarios && <ListaUsuarios />}
    </div>
  );
}

export default App;
