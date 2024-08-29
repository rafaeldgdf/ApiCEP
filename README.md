# Projeto de Cadastro de Usuários com Consulta de CEP

## Descrição Geral
Este projeto é uma aplicação web full-stack que permite o cadastro de usuários, associando a eles até três endereços consultados via API do ViaCEP. A aplicação é composta por um backend em Spring Boot e um frontend em React, garantindo uma experiência fluida e intuitiva para o usuário final.

## Estrutura do Projeto

### Backend (Spring Boot)

**Tecnologias Utilizadas:**
- Java 17
- Spring Boot 3.3.2
- JPA/Hibernate
- MySQL
- Springdoc OpenAPI (Swagger)

**Arquitetura:**

- **Entidades (Entities):** As entidades representam as tabelas no banco de dados e estão mapeadas com JPA. Estão localizadas no pacote `senac.api.via.cep.entities`.
  - `Usuario.java`: Mapeia a tabela `usuario`.
  - `Endereco.java`: Mapeia a tabela `endereco`.
    
- **Controladores (Controllers):** Os controladores são responsáveis por receber as requisições HTTP do frontend, processá-las e retornar uma resposta. Estão localizados no pacote `senac.api.via.cep.controllers`.
  - `UsuarioController.java`: Gerencia as operações CRUD para os usuários.
  - `EnderecoController.java`: Gerencia a consulta de CEPs e cadastro de endereços.

- **DTOs (Data Transfer Objects):** Os DTOs são usados para transportar dados entre as camadas da aplicação, especialmente entre o backend e o frontend. Estão no pacote `senac.api.via.cep.dtos`.
  - `EnderecoDTO.java`: Define a estrutura dos dados de endereço.
  - `UsuarioDTO.java`: Define a estrutura dos dados do usuário.
  - `UsuarioComEnderecosDTO.java`: Combina informações de usuários e seus endereços.

- **Repositórios (Repositories):** Os repositórios são responsáveis pela comunicação direta com o banco de dados. Estão no pacote `senac.api.via.cep.repositories`.
  - `UsuarioRepository.java`: Interface que gerencia operações CRUD para a entidade `Usuario`.
  - `EnderecoRepository.java`: Interface que gerencia operações CRUD para a entidade `Endereco`.

- **Controladores (Controllers):** Os controladores são responsáveis por receber as requisições HTTP do frontend, processá-las e retornar uma resposta. Estão localizados no pacote `senac.api.via.cep.controllers`.
  - `UsuarioController.java`: Gerencia as operações CRUD para os usuários.
  - `EnderecoController.java`: Gerencia a consulta de CEPs e cadastro de endereços.

- **Configurações:**
  - `SwaggerConfig.java`: Configura o Swagger para documentação da API.
  - `WebConfig.java`: Configurações adicionais do Spring MVC.

### Frontend (React)

**Tecnologias Utilizadas:**
- React
- Axios
- CSS

**Arquitetura:**
- **Componentes:** Os componentes React são responsáveis por renderizar a interface do usuário e gerenciar o estado da aplicação. Estão localizados no diretório `src/components`.
  - `CadastroUsuario.js`: Componente principal que gerencia o formulário de cadastro de usuários, incluindo a adição de até três endereços e a consulta de CEPs via API.

- **Estilos:** Os estilos são gerenciados via CSS, proporcionando uma interface simples e intuitiva. Estão localizados no diretório `src/styles`.
  - `CadastroUsuario.css`: Estiliza o formulário de cadastro de usuários.

- **Configurações e Scripts:**
  - `index.js`: Ponto de entrada da aplicação React, responsável por renderizar o componente principal na página HTML.
  - `App.js`: Componente raiz que encapsula toda a aplicação.
  - `axios`: Biblioteca utilizada para fazer requisições HTTP ao backend.

## Como Funciona

### Backend:
1. **Cadastro de Usuário:** O `UsuarioController` recebe uma requisição POST com os dados do usuário e seus endereços, salva-os no banco de dados após validar os CEPs.
2. **Consulta de CEP:** O `EnderecoController` consulta o CEP informado usando a API do ViaCEP, retornando os dados completos do endereço para auto-preenchimento no frontend.
3. **Documentação:** O Swagger é automaticamente gerado pelo Springdoc e pode ser acessado via `http://localhost:8080/swagger-ui/index.html#/`.

### Frontend:
1. **Formulário de Cadastro:** O usuário preenche seus dados e pode adicionar até três endereços. Ao informar um CEP, o campo de endereço é automaticamente preenchido com os dados retornados pela API do ViaCEP.
2. **Validação e Submissão:** Após a validação dos dados, o formulário envia as informações para o backend, que realiza o cadastro no banco de dados.
3. **Interface:** A interface é simples, focada na usabilidade e intuitividade, garantindo que o usuário final tenha uma experiência agradável.

## Como Executar

### Backend
1. Clone o repositório e navegue até o diretório do projeto.
2. Execute o comando mvn spring-boot:run para iniciar o servidor. O banco de dados será criado automaticamente.
3. Confira a documentação e/ou simule requisições no Swagge `http://localhost:8080/swagger-ui/index.html#/`.

### Frontend
1. Navegue até o diretório do frontend.
2. Instale as dependências com `npm install`.
3. Execute o comando `npm start` para iniciar a aplicação React.
