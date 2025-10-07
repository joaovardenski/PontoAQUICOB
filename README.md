# Ponto Eletrônico AQUICOB

## 📸 Imagem do projeto
<p align="center">
  <img src="src/assets/loginAQUICOB.png" alt="Demonstração do projeto" width="100%"/>
</p>

## 🖥️ Sobre o projeto
Esse é um projeto Web Responsivo de um Ponto Eletrônico destinado à empresa AQUICOB.

## 🚀 Tecnologias utilizadas
Esse projeto foi desenvolvido como parte de um processo para vaga de desenvolvedor com as seguintes tecnologias:
- React.JS
- TypeScript
- Tailwind CSS
- Vite
- Git e GitHub

## ⚙️ Preparação do ambiente
O projeto foi dividido em dois repositórios:

- **Front-end:** https://github.com/joaovardenski/PontoAQUICOB  
- **Back-end:** https://github.com/joaovardenski/PontoAQUICOB-Back  

### 1️⃣ Clonar os repositórios
git clone https://github.com/joaovardenski/PontoAQUICOB.git <br>
git clone https://github.com/joaovardenski/PontoAQUICOB-Back.git <br>

### 2️⃣ Instalar pacotes e iniciar os servidores

#### Front-end
cd PontoAQUICOB <br>
npm install <br>
npm run dev   # Inicia o servidor do front-end <br>

#### Back-end (Laravel)
cd PontoAQUICOB-Back <br>
composer install        # Instala dependências do Laravel <br>
cp .env.example .env    # Copia arquivo de ambiente <br>
php artisan key:generate # Gera chave da aplicação <br>

**Configurar banco de dados no `.env`** (MySQL):

DB_CONNECTION=mysql <br>
DB_HOST=127.0.0.1 <br>
DB_PORT=3306 <br>
DB_DATABASE=nome_do_banco <br>
DB_USERNAME=usuario <br>
DB_PASSWORD=senha <br>

php artisan migrate                 # Executa migrations <br>
php artisan db:seed --class=UsersSeeder # Insere usuários iniciais <br>
php artisan serve                    # Inicia o servidor do back-end <br>

**Usuários iniciais cadastrados via seeder:**

- **Admin:**  
  CPF: 071.340.919-37 | Senha: admin1234

- **Funcionários:**  
  CPF: 174.244.710-40 | Senha: func12345  
  CPF: 142.811.680-01 | Senha: func12345

### 3️⃣ Utilização
- O front-end estará disponível em: http://localhost:5173/  
- O back-end estará disponível em: http://localhost:8000/  
- Ao acessar o front-end, os módulos já se comunicam automaticamente com o back-end.

## 📌 Funcionalidades

### Login
- Permite login utilizando os usuários cadastrados via seeders (ou outros criados posteriormente).  
- Validações de campos implementadas no front-end e back-end.  
- Proteção de rotas não implementada nesta versão.

### Dashboard do Funcionário
- Tela de registro de ponto com opções: Entrada, Pausa e Saída.  
- O fluxo segue a lógica: entrada → pausas (opcional) → entrada novamente → saída final.  
- Após a saída, não é permitido registrar novos pontos no mesmo dia.  
- Mostra horas trabalhadas e registros de ponto do dia.

### Dashboard do Admin (CRUD de funcionários)
- Admin pode criar, editar e excluir funcionários.  
- Ao criar um funcionário, o sistema gera uma senha inicial para login.  
- O admin consegue visualizar informações como CPF, cargo e carga horária.

### Relatórios do Admin
- Permite pesquisar histórico de pontos de um funcionário por período.  
- Mostra saldo diário com base na carga horária.  
- Possibilidade de exportar relatórios em PDF.

## 💻 Executando localmente
1. Certifique-se de que MySQL e PHP estão instalados e configurados.  
2. Clone os repositórios.  
3. Instale dependências (`npm install` e `composer install`).  
4. Configure o `.env` do Laravel.  
5. Rode migrations e seeders.  
6. Inicie os servidores (`npm run dev` e `php artisan serve`).  
7. Acesse http://localhost:5173/ para utilizar o sistema.

## 📖 Observações
- Essa versão não possui proteção de rotas no front-end.  
- Senhas iniciais são geradas via seeder e podem ser alteradas em futuras versões.  
- Recomenda-se utilizar um ambiente local seguro para testes com MySQL e PHP.

---
Feito por João Victor Vardenski de Andrade
