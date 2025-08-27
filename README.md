# Vehicle Demo

Aplicação demonstrativa para gerenciamento de veículos, com frontend em Angular 20, backend API Node.js, RabbitMQ e PostgreSQL, todos containerizados com Docker.

## 🚀 Tecnologias utilizadas

* **Frontend:** Angular 20 (Standalone Components, Material UI)
* **Backend:** API e microserviço de consumo em NEST (Node.js)
* **Banco de dados:** PostgreSQL
* **Mensageria:** RabbitMQ
* **Containerização:** Docker & Docker Compose
* **Estilo:** Angular Material

# ⚡ Rodando a aplicação com Docker

1. Clone o repositório:

```bash
git clone https://github.com/Youkko/vehicledemo.git
cd VehicleDemo
```

2. Suba todos os serviços:

```bash
docker-compose up --build
```

3. Acesse:

* **Frontend:** [http://localhost:81](http://localhost:81/)
* **API:** [http://localhost:3000](http://localhost:3000/)
* **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672/)
  Usuário: `vehicles` / Senha: `Tu3lh0!`
* **PostgreSQL:** Porta `5432`, usuário: `vehicles`, senha: `C@!xaF0rt3`, database: `vehicles`

> O frontend se comunica automaticamente com a API via Docker network.

## 📝 Funcionalidades do Frontend

* Listagem de veículos com atualização periódica (polling)
* Criação de veículo (form standalone)
* Edição de veículo
* Exclusão de veículo
* Barra de loading durante requisições
* Feedback visual via Material Snackbar

## 🔧 Configurações

* **Polling**: O frontend atualiza a lista de veículos a cada 5 segundos.
* **API**: Recebe as requisições do frontend e envia mensagens para o microserviço via RabbitMQ.
* **Banco**: PostgreSQL com dados persistidos em volume Docker `db`.
