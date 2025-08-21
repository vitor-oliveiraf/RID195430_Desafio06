# 📋 DNC Store Manager API - Collection Postman

## 🚀 Como Usar

### 1. **Importar a Collection**

1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `DNC_Store_Manager_API.postman_collection.json`
4. A collection será importada com todos os endpoints organizados

### 2. **Configurar Variáveis de Ambiente**

A collection já vem com variáveis pré-configuradas:

- `base_url`: `http://localhost:3000` (URL base da API)
- `venda_id`: Capturado automaticamente ao criar vendas
- `pedido_id`: Capturado automaticamente ao criar pedidos

### 3. **Estrutura da Collection**

## 🛒 **MÓDULO VENDAS**

### **Criar Venda**

- **Endpoint**: `POST /api/vendas`
- **Descrição**: Criar uma nova venda
- **Body**: Dados completos da venda com itens, cliente e vendedor

### **Buscar Venda por ID**

- **Endpoint**: `GET /api/vendas/{{venda_id}}`
- **Descrição**: Buscar venda específica
- **Parâmetro**: ID da venda (capturado automaticamente)

### **Listar Todas as Vendas**

- **Endpoint**: `GET /api/vendas`
- **Descrição**: Listar todas as vendas cadastradas

### **Buscar Vendas por Cliente**

- **Endpoint**: `GET /api/vendas/cliente/1`
- **Descrição**: Buscar vendas de um cliente específico
- **Parâmetro**: ID do cliente

### **Buscar Vendas por Vendedor**

- **Endpoint**: `GET /api/vendas/vendedor/1`
- **Descrição**: Buscar vendas de um vendedor específico
- **Parâmetro**: ID do vendedor

### **Buscar Vendas por Status**

- **Endpoint**: `GET /api/vendas/status/pendente`
- **Descrição**: Buscar vendas por status
- **Status válidos**: `pendente`, `pago`, `cancelado`, `reembolsado`

### **Buscar Vendas por Produto**

- **Endpoint**: `GET /api/vendas/produto/1`
- **Descrição**: Buscar vendas que contêm um produto
- **Parâmetro**: ID do produto

### **Buscar Vendas por Período**

- **Endpoint**: `GET /api/vendas/periodo?startDate=2024-01-01&endDate=2024-12-31`
- **Descrição**: Buscar vendas em período específico
- **Query Params**: `startDate`, `endDate`

### **Atualizar Status da Venda**

- **Endpoint**: `PATCH /api/vendas/{{venda_id}}/status`
- **Descrição**: Atualizar status da venda
- **Body**: `{"status": "pago"}`

### **Cancelar Venda**

- **Endpoint**: `PATCH /api/vendas/{{venda_id}}/cancelar`
- **Descrição**: Cancelar venda pendente
- **Body**: `{"motivo": "Cliente desistiu da compra"}`

### **Reembolsar Venda**

- **Endpoint**: `PATCH /api/vendas/{{venda_id}}/reembolsar`
- **Descrição**: Reembolsar venda paga
- **Body**: `{"motivo": "Produto com defeito"}`

### **Obter Estatísticas de Vendas**

- **Endpoint**: `GET /api/vendas/estatisticas?startDate=2024-01-01&endDate=2024-12-31`
- **Descrição**: Estatísticas gerais de vendas
- **Query Params**: `startDate`, `endDate` (opcionais)

## 📦 **MÓDULO PEDIDOS**

### **Criar Pedido - Delivery**

- **Endpoint**: `POST /api/pedidos`
- **Descrição**: Criar pedido de delivery com informações de entrega
- **Body**: Dados completos incluindo `informacoesEntrega`

### **Criar Pedido - Retirada**

- **Endpoint**: `POST /api/pedidos`
- **Descrição**: Criar pedido para retirada no local
- **Body**: Dados sem `informacoesEntrega`

### **Buscar Pedido por ID**

- **Endpoint**: `GET /api/pedidos/{{pedido_id}}`
- **Descrição**: Buscar pedido específico
- **Parâmetro**: ID do pedido (capturado automaticamente)

### **Listar Todos os Pedidos**

- **Endpoint**: `GET /api/pedidos`
- **Descrição**: Listar todos os pedidos cadastrados

### **Buscar Pedidos por Cliente**

- **Endpoint**: `GET /api/pedidos/cliente/1`
- **Descrição**: Buscar pedidos de um cliente específico
- **Parâmetro**: ID do cliente

### **Buscar Pedidos por Vendedor**

- **Endpoint**: `GET /api/pedidos/vendedor/1`
- **Descrição**: Buscar pedidos de um vendedor específico
- **Parâmetro**: ID do vendedor

### **Buscar Pedidos por Status**

- **Endpoint**: `GET /api/pedidos/status/recebido`
- **Descrição**: Buscar pedidos por status
- **Status válidos**: `recebido`, `confirmado`, `preparando`, `pronto`, `em_entrega`, `entregue`, `cancelado`

### **Buscar Pedidos por Tipo de Entrega**

- **Endpoint**: `GET /api/pedidos/tipo-entrega/delivery`
- **Descrição**: Buscar pedidos por tipo de entrega
- **Tipos válidos**: `delivery`, `retirada`

### **Buscar Pedidos por Produto**

- **Endpoint**: `GET /api/pedidos/produto/1`
- **Descrição**: Buscar pedidos que contêm um produto
- **Parâmetro**: ID do produto

### **Buscar Pedidos por Período**

- **Endpoint**: `GET /api/pedidos/periodo?startDate=2024-01-01&endDate=2024-12-31`
- **Descrição**: Buscar pedidos em período específico
- **Query Params**: `startDate`, `endDate`

### **Atualizar Status do Pedido**

- **Endpoint**: `PATCH /api/pedidos/{{pedido_id}}/status`
- **Descrição**: Atualizar status do pedido
- **Body**: `{"status": "confirmado"}`

### **Atualizar Tempo Estimado**

- **Endpoint**: `PATCH /api/pedidos/{{pedido_id}}/tempo-estimado`
- **Descrição**: Atualizar tempo estimado de entrega
- **Body**: `{"tempoEstimado": 45}`

### **Cancelar Pedido**

- **Endpoint**: `PATCH /api/pedidos/{{pedido_id}}/cancelar`
- **Descrição**: Cancelar pedido não entregue
- **Body**: `{"motivo": "Cliente desistiu do pedido"}`

### **Buscar Pedidos Urgentes**

- **Endpoint**: `GET /api/pedidos/urgentes`
- **Descrição**: Pedidos prontos há mais de 30 minutos

### **Buscar Pedidos em Preparo**

- **Endpoint**: `GET /api/pedidos/em-preparo`
- **Descrição**: Pedidos com status confirmado ou preparando

### **Obter Estatísticas de Pedidos**

- **Endpoint**: `GET /api/pedidos/estatisticas?startDate=2024-01-01&endDate=2024-12-31`
- **Descrição**: Estatísticas gerais de pedidos
- **Query Params**: `startDate`, `endDate` (opcionais)

### **Obter Estatísticas por Status**

- **Endpoint**: `GET /api/pedidos/estatisticas/por-status?startDate=2024-01-01&endDate=2024-12-31`
- **Descrição**: Estatísticas agrupadas por status
- **Query Params**: `startDate`, `endDate` (opcionais)

## 📝 **EXEMPLOS DE DADOS**

### **Exemplo - Venda Completa**

Venda de eletrônicos com múltiplos itens e desconto.

### **Exemplo - Pedido Delivery Completo**

Pedido de pizza com informações completas de entrega.

## 🔧 **Funcionalidades Automáticas**

### **Captura Automática de IDs**

A collection possui scripts que capturam automaticamente os IDs das vendas e pedidos criados, armazenando-os nas variáveis:

- `venda_id`: ID da última venda criada
- `pedido_id`: ID do último pedido criado

### **Como Funciona**

1. Execute uma requisição de criação (POST)
2. Se a resposta for 201 (Created), o ID é capturado automaticamente
3. Use `{{venda_id}}` ou `{{pedido_id}}` em outras requisições

## 🎯 **Fluxo de Teste Recomendado**

### **Para Vendas:**

1. **Criar Venda** → Captura `venda_id`
2. **Buscar Venda por ID** → Usa `{{venda_id}}`
3. **Atualizar Status** → Usa `{{venda_id}}`
4. **Cancelar/Reembolsar** → Usa `{{venda_id}}`

### **Para Pedidos:**

1. **Criar Pedido** → Captura `pedido_id`
2. **Buscar Pedido por ID** → Usa `{{pedido_id}}`
3. **Atualizar Status** → Usa `{{pedido_id}}`
4. **Atualizar Tempo Estimado** → Usa `{{pedido_id}}`
5. **Cancelar Pedido** → Usa `{{pedido_id}}`

## ⚠️ **Observações Importantes**

### **Validações**

- Cliente e vendedor devem existir no banco SQL
- Produtos devem ter estoque suficiente
- Informações de entrega obrigatórias para delivery
- Transições de status validadas

### **Status de Vendas**

- `pendente` → `pago` → `reembolsado`
- `pendente` → `cancelado`

### **Status de Pedidos**

- `recebido` → `confirmado` → `preparando` → `pronto` → `em_entrega` → `entregue`
- Qualquer status → `cancelado` (exceto entregue)

### **Formas de Pagamento**

- `dinheiro`
- `cartao_credito`
- `cartao_debito`
- `pix`
- `transferencia`

## 🚀 **Pronto para Usar!**

Agora você pode testar todas as funcionalidades da API de Vendas e Pedidos do DNC Store Manager de forma organizada e eficiente! 🎉

