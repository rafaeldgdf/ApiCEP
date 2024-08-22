
# Projeto ViaCep API

Este projeto é uma API construída com Spring Boot que permite aos usuários gerenciar endereços e usuários. A API integra-se ao serviço ViaCep para validar e preencher automaticamente os campos de endereço com base no CEP brasileiro.

## Funcionalidades

- **Gerenciamento de Usuários**: Operações CRUD para usuários.
- **Gerenciamento de Endereços**: Operações CRUD para endereços associados aos usuários.
- **Integração com ViaCep**: Busca de dados de endereço com base no CEP e preenchimento automático dos campos de endereço.

## Tecnologias Utilizadas

- **Spring Boot 3.3.2**
- **Java 17**
- **MySQL**
- **Swagger OpenAPI 2.1.0**
- **Lombok**
- **HikariCP**
- **Spring Data JPA**
- **Spring Web**
- **Springdoc OpenAPI UI**

## Estrutura do Projeto

### Backend

O backend foi desenvolvido utilizando Spring Boot e é responsável por gerenciar a lógica de negócios, persistência de dados, e integração com o serviço ViaCep.

#### Estrutura de Pacotes

```
via.cep/
├── src/
│   ├── main/
│       ├── java/
│       │   └── senac/api/via/cep/
│       │       ├── Application.java
│       │       ├── SwaggerConfig.java
│       │       ├── WebConfig.java
│       │       ├── controllers/
│       │       │   ├── UsuarioController.java
│       │       │   └── EnderecoController.java
│       │       ├── dtos/
│       │       │   ├── EnderecoDTO.java
│       │       │   └── UsuarioDTO.java
│       │       │   └── UsuarioComEnderecosDTO.java
│       │       ├── entities/
│       │       │   ├── Usuario.java
│       │       │   └── Endereco.java
│       │       ├── repositories/
│       │       │   ├── UsuarioRepository.java
│       │       │   └── EnderecoRepository.java
│       └── resources/
│           └── application.properties
│           
│               
└── pom.xml


#### Arquivos Principais

- **Application.java**: Classe principal que inicializa a aplicação Spring Boot.
- **UsuarioController.java**: Controlador REST responsável pelas operações CRUD relacionadas aos usuários.
- **EnderecoController.java**: Controlador REST responsável pelas operações CRUD relacionadas aos endereços e pela integração com o serviço ViaCep.
- **SwaggerConfig.java**: Configuração do Swagger para documentar e testar os endpoints da API.
- **application.properties**: Arquivo de configuração da aplicação, contendo detalhes como URL do banco de dados, configurações do Hibernate, entre outros.

### Frontend

O frontend foi desenvolvido utilizando React e é responsável por fornecer uma interface de usuário para interagir com a API.

#### Estrutura de Arquivos

```
src/
├── components/
│   └── CadastroUsuario.js
├── styles/
│   └── CadastroUsuario.css
└── App.js
```

#### Arquivos Principais

- **CadastroUsuario.js**: Componente React que gerencia o formulário de cadastro de usuários e endereços, incluindo a lógica de preenchimento automático do endereço com base no CEP utilizando a API do backend.
- **CadastroUsuario.css**: Arquivo de estilo para o formulário de cadastro, proporcionando uma interface amigável e intuitiva.
- **App.js**: Ponto de entrada da aplicação React, onde os componentes são renderizados.

#### Explicação Detalhada

1. **CadastroUsuario.js**: 
    - Este componente é responsável por capturar as informações do usuário e seus endereços. Ele permite que o usuário adicione até três endereços e faz a validação do CEP em tempo real, utilizando a API do backend para preencher automaticamente os dados do endereço.
    - Exemplo:
    ```javascript
    const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      const newEnderecos = usuario.enderecos.map((endereco, idx) => {
        if (idx === index) {
          return { ...endereco, [name]: value };
        }
        return endereco;
      });
      setUsuario({ ...usuario, enderecos: newEnderecos });

      // Se o campo atualizado for o CEP, faça a consulta ao backend
      if (name === "cep" && value.length === 8) {
        axios.get(`http://localhost:8080/enderecos/consulta-cep/${value}`)
          .then(response => {
            const data = response.data;
            const enderecoPreenchido = {
              ...newEnderecos[index],
              logradouro: data.logradouro || '',
              bairro: data.bairro || '',
              localidade: data.localidade || '',
              uf: data.uf || ''
            };
            const enderecosAtualizados = usuario.enderecos.map((endereco, idx) => idx === index ? enderecoPreenchido : endereco);
            setUsuario({ ...usuario, enderecos: enderecosAtualizados });
          })
          .catch(() => {
            alert('CEP inválido ou não encontrado');
          });
      }
    };
    ```

2. **CadastroUsuario.css**:
    - Este arquivo define os estilos para o formulário de cadastro, garantindo que ele seja visualmente agradável e fácil de usar.

## Configuração do Projeto

### Pré-requisitos

- Java 17
- Maven
- MySQL

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/rafaeldgdf/viacep-api.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd viacep-api
   ```
3. Crie um banco de dados MySQL:
   ```sql
   CREATE DATABASE viacep;
   ```
4. Atualize as configurações do banco de dados em `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/viacep?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
5. Compile e execute o projeto usando Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Executando a Aplicação

A aplicação será iniciada em `http://localhost:8080`. Você pode acessar a interface do Swagger para explorar os endpoints da API:

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`

## Testes

Execute os testes unitários com:
```bash
mvn test
```

## Autor

- **Rafael Vitor de Oliveira**
  - [LinkedIn](https://www.linkedin.com/in/rafaelvitor2/)
  - [GitHub](https://github.com/rafaeldgdf)

```
