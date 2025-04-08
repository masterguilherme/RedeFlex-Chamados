# Sistema de Gerenciamento de Chamados

Sistema web para gerenciamento de chamados de suporte, desenvolvido com React e Node.js.

## Funcionalidades

### Módulo 1: Configuração Inicial e Autenticação
- [x] Configuração do ambiente de desenvolvimento
- [x] Estrutura do projeto (frontend e backend)
- [x] Configuração do banco de dados PostgreSQL
- [x] Implementação da autenticação JWT
- [x] Páginas de login e registro
- [x] Proteção de rotas
- [x] Contexto de autenticação
- [x] Validação de formulários
- [x] Tratamento de erros
- [x] Feedback visual de operações

### Módulo 2: Gestão de Usuários e Empresas
- [x] Modelo de dados para usuários e empresas
- [x] CRUD de usuários
  - [x] Listagem com paginação
  - [x] Criação de novos usuários
  - [x] Edição de usuários existentes
  - [x] Desativação de usuários (soft delete)
  - [x] Associação com empresas
- [x] CRUD de empresas
  - [x] Listagem com paginação
  - [x] Criação de novas empresas
  - [x] Edição de empresas existentes
  - [x] Desativação de empresas (soft delete)
- [x] Interface administrativa
  - [x] Dashboard personalizado
  - [x] Filtros e busca
  - [x] Ações em lote
  - [x] Exportação de dados
- [x] Controle de acesso baseado em perfis
  - [x] Admin: acesso total
  - [x] Solicitante: criação e visualização de chamados
  - [x] Prestador: atendimento de chamados
- [x] Validações e tratamento de erros
  - [x] Validação de campos obrigatórios
  - [x] Validação de formatos (email, CNPJ, etc)
  - [x] Mensagens de erro personalizadas
  - [x] Feedback visual de operações

### Módulo 3: Sistema de Chamados
- [x] Modelo de dados para chamados
  - [x] Título e descrição
  - [x] Status e prioridade
  - [x] Categoria
  - [x] Atribuição
  - [x] Datas importantes
- [x] CRUD de chamados
  - [x] Criação de novos chamados
  - [x] Edição de chamados existentes
  - [x] Visualização detalhada
  - [x] Desativação (soft delete)
- [x] Sistema de comentários
  - [x] Comentários públicos e internos
  - [x] Histórico de alterações
  - [x] Notificações de novos comentários
- [x] Histórico de alterações
  - [x] Registro de mudanças de status
  - [x] Registro de atribuições
  - [x] Registro de edições
- [x] Interface de listagem de chamados
  - [x] Filtros por status e prioridade
  - [x] Busca por texto
  - [x] Ordenação por diferentes campos
  - [x] Paginação
- [x] Interface de detalhes do chamado
  - [x] Informações completas
  - [x] Lista de comentários
  - [x] Histórico de alterações
  - [x] Ações rápidas
- [x] Formulário de criação/edição
  - [x] Validação de campos
  - [x] Seleção de categoria
  - [x] Definição de prioridade
  - [x] Atribuição de responsável
- [x] Controle de status e prioridades
  - [x] Status: aberto, em andamento, aguardando, fechado
  - [x] Prioridades: baixa, média, alta, urgente
  - [x] Transições de status controladas
- [x] Filtros e busca
  - [x] Busca por texto
  - [x] Filtros por status
  - [x] Filtros por prioridade
  - [x] Filtros por categoria
  - [x] Filtros por data

### Módulo 4: Interface do Usuário
- [x] Dashboard personalizado
  - [x] Visão geral para administradores
  - [x] Visão específica para solicitantes
  - [x] Visão específica para prestadores
  - [x] Estatísticas e métricas
  - [x] Gráficos e visualizações
- [x] Sistema de notificações
  - [x] Notificações em tempo real
  - [x] Diferentes tipos de notificações
  - [x] Notificações para:
    - [x] Criação de chamados
    - [x] Atualização de status
    - [x] Atribuição de chamados
    - [x] Novos comentários
  - [x] Menu de notificações no cabeçalho
  - [x] Página dedicada para visualização
  - [x] Marcação de notificações como lidas
  - [x] API completa para gerenciamento
- [x] Interface responsiva
  - [x] Layout adaptativo
  - [x] Menu lateral retrátil
  - [x] Componentes responsivos
  - [x] Otimização para mobile
- [x] Melhorias de UX
  - [x] Feedback visual de ações
  - [x] Confirmações de operações
  - [x] Tooltips informativos
  - [x] Atalhos de teclado
  - [x] Loading states
  - [x] Tratamento de erros

### Módulo 5: Relatórios e Métricas

### Funcionalidades Implementadas

1. **Geração de Relatórios**
   - Relatórios personalizáveis por tipo (chamados, performance, etc.)
   - Múltiplos formatos de exportação (Excel, PDF, CSV)
   - Agendamento automático de relatórios
   - Filtros avançados por período, status, prioridade
   - Campos personalizáveis para cada relatório

2. **Dashboard de Métricas**
   - Visualização de KPIs em tempo real
   - Gráficos interativos usando Recharts
   - Métricas por período (7 dias, 30 dias, 90 dias, 1 ano)
   - Indicadores de performance dos prestadores
   - Análise de tendências

3. **Análise de Dados**
   - Volume de chamados por período
   - Distribuição por status
   - Tempo médio de resolução
   - Taxa de resolução
   - Chamados urgentes
   - Performance por prestador

### Tecnologias Utilizadas

- **Frontend**
  - Recharts para visualização de dados
  - Material-UI para componentes de interface
  - React Query para gerenciamento de estado e cache
  - date-fns para manipulação de datas
  - Yup para validação de formulários
  - React Hook Form para gerenciamento de formulários

- **Backend**
  - ExcelJS para geração de relatórios Excel
  - PDFKit para geração de relatórios PDF
  - node-cron para agendamento de relatórios
  - nodemailer para envio de relatórios por email
  - Sequelize para consultas otimizadas

### Estrutura do Projeto

```
client/
  ├── src/
  │   ├── pages/
  │   │   ├── reports/
  │   │   │   ├── ReportsPage.js
  │   │   │   ├── ReportForm.js
  │   │   │   └── ReportMetrics.js
  │   │   ├── tickets/
  │   │   │   ├── TicketDetails.js
  │   │   │   ├── TicketForm.js
  │   │   │   └── TicketsList.js
  │   │   └── Dashboard.js
  │   ├── components/
  │   │   ├── layout/
  │   │   │   └── Navbar.js
  │   │   └── notifications/
  │   │       └── NotificationCenter.js
  │   └── context/
  │       ├── AuthContext.js
  │       ├── ReportContext.js
  │       └── TicketContext.js
server/
  ├── models/
  │   └── Report.js
  ├── controllers/
  │   └── reportController.js
  ├── services/
  │   └── reportService.js
  └── routes/
      └── reports.js
```

### Rotas Implementadas

- `GET /api/reports` - Lista todos os relatórios
- `GET /api/reports/:id` - Obtém detalhes de um relatório
- `POST /api/reports` - Cria um novo relatório
- `PUT /api/reports/:id` - Atualiza um relatório existente
- `DELETE /api/reports/:id` - Remove um relatório
- `GET /api/reports/:id/generate` - Gera um relatório
- `GET /api/reports/metrics` - Obtém métricas e KPIs

### Segurança

- Autenticação requerida para todas as rotas
- Validação de dados de entrada
- Controle de acesso baseado em roles
- Proteção contra injeção de dados
- Validação de emails para destinatários

### Próximos Passos

1. Implementar mais tipos de relatórios
2. Adicionar mais visualizações de dados
3. Melhorar a performance das consultas
4. Implementar cache de relatórios
5. Adicionar mais opções de exportação
6. Implementar comparação entre períodos
7. Adicionar mais métricas e KPIs
8. Melhorar a interface de agendamento

### Dependências Adicionadas

**Backend:**
- exceljs: ^4.4.0
- pdfkit: ^0.14.0
- node-cron: ^3.0.3
- nodemailer: ^6.9.9

**Frontend:**
- recharts: ^2.12.0
- date-fns: ^3.3.1
- @hookform/resolvers: ^3.3.4
- yup: ^1.3.3

## Tecnologias Utilizadas

### Frontend
- React
- Material-UI
- React Router
- Context API
- Axios
- React Query (para cache e gerenciamento de estado)
- React Hook Form (para formulários)
- Yup (para validação)
- Recharts (para gráficos)
- XLSX (para exportação Excel)
- jspdf (para exportação PDF)
- Chart.js (para gráficos adicionais)
- date-fns (para manipulação de datas)

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Express Validator
- Nodemailer (para notificações por email)
- Multer (para upload de arquivos)
- Socket.IO (para notificações em tempo real)
- ExcelJS (para geração de relatórios Excel)
- PDFKit (para geração de relatórios PDF)
- node-cron (para agendamento de tarefas)
- nodemailer (para envio de relatórios)

## Estrutura do Projeto

```
client/
  ├── src/
  │   ├── components/
  │   │   ├── auth/
  │   │   │   ├── Login.js
  │   │   │   └── Register.js
  │   │   ├── layout/
  │   │   │   ├── Navbar.js
  │   │   │   └── PrivateRoute.js
  │   │   ├── notifications/
  │   │   │   └── NotificationCenter.js
  │   │   ├── reports/
  │   │   │   ├── ReportFilters.js
  │   │   │   ├── ReportCharts.js
  │   │   │   ├── ReportTable.js
  │   │   │   └── ReportExport.js
  │   │   └── routing/
  │   ├── contexts/
  │   │   ├── AuthContext.js
  │   │   ├── CompanyContext.js
  │   │   ├── UserContext.js
  │   │   ├── TicketContext.js
  │   │   └── ReportContext.js
  │   ├── pages/
  │   │   ├── admin/
  │   │   │   ├── CompaniesPage.js
  │   │   │   └── UsersPage.js
  │   │   ├── tickets/
  │   │   │   ├── TicketsList.js
  │   │   │   ├── TicketDetails.js
  │   │   │   └── TicketForm.js
  │   │   ├── reports/
  │   │   │   ├── ReportsPage.js
  │   │   │   ├── ReportDetails.js
  │   │   │   └── ScheduledReports.js
  │   │   └── Dashboard.js
  │   ├── services/
  │   │   ├── api.js
  │   │   └── reportService.js
  │   └── utils/
  └── public/

server/
  ├── config/
  │   └── db.js
  ├── controllers/
  │   ├── authController.js
  │   ├── companyController.js
  │   ├── userController.js
  │   ├── ticketController.js
  │   ├── commentController.js
  │   ├── ticketHistoryController.js
  │   ├── notificationController.js
  │   └── reportController.js
  ├── middleware/
  │   ├── auth.js
  │   └── validate.js
  ├── models/
  │   ├── User.js
  │   ├── Company.js
  │   ├── Ticket.js
  │   ├── Comment.js
  │   ├── TicketHistory.js
  │   ├── Notification.js
  │   └── Report.js
  ├── routes/
  │   ├── auth.js
  │   ├── companies.js
  │   ├── users.js
  │   ├── tickets.js
  │   ├── comments.js
  │   ├── ticketHistory.js
  │   ├── notifications.js
  │   └── reports.js
  ├── services/
  │   ├── reportService.js
  │   └── exportService.js
  └── utils/
```

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   # server/.env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=nome_do_banco
   JWT_SECRET=seu_secret
   PORT=5000
   SMTP_HOST=seu_servidor_smtp
   SMTP_PORT=587
   SMTP_USER=seu_email
   SMTP_PASS=sua_senha
   SOCKET_PORT=5001

   # client/.env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5001
   ```

4. Execute as migrações do banco de dados:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   ```

5. Inicie os servidores:
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd client
   npm start
   ```

## Testes

Para executar os testes:

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### Módulo 6: Integração com Email

### Funcionalidades Implementadas

1. **Configuração de Email**
   - [x] Configuração do transportador SMTP
   - [x] Sistema de logs com Winston
   - [x] Validação de configurações
   - [x] Teste de conexão
   - [x] Suporte a múltiplos provedores SMTP
   - [x] Configuração via variáveis de ambiente

2. **Serviço de Email**
   - [x] Envio assíncrono de emails
   - [x] Sistema de filas com Bull
   - [x] Cache de templates
   - [x] Métricas de fila
   - [x] Tratamento de erros
   - [x] Retry automático
   - [x] Logs de envio

3. **Templates de Email**
   - [x] Template responsivo para novos chamados
   - [x] Suporte a HTML e CSS
   - [x] Variáveis dinâmicas
   - [x] Cache de templates
   - [x] Templates para:
     - [x] Notificações de novos chamados
     - [x] Atualizações de status
     - [x] Atribuições de chamados
     - [x] Relatórios agendados
     - [x] Recuperação de senha
     - [x] Boas-vindas

4. **Utilitários**
   - [x] Formatação de emails
   - [x] Validação de endereços
   - [x] Gerenciamento de anexos
   - [x] Geração de IDs únicos
   - [x] Logs de tentativas
   - [x] Formatação de tamanho de anexos
   - [x] Validação de tamanho de anexos
   - [x] Geração de nomes únicos de arquivos

### Tecnologias Utilizadas

- **Backend**
  - Nodemailer para envio de emails
  - Bull para filas de processamento
  - Handlebars para templates
  - Winston para logs
  - Redis para cache e filas

### Estrutura do Projeto

```
server/
  ├── config/
  │   └── email.js
  ├── services/
  │   ├── emailService.js
  │   └── queueService.js
  ├── templates/
  │   ├── newTicket.hbs
  │   ├── statusUpdate.hbs
  │   ├── assignment.hbs
  │   ├── report.hbs
  │   ├── passwordReset.hbs
  │   └── welcome.hbs
  └── utils/
      └── emailUtils.js
```

### Configuração

```env
# Configurações de Email
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=seu_email@exemplo.com
SMTP_PASS=sua_senha
SMTP_FROM=noreply@exemplo.com

# Redis (para filas)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Próximos Passos

1. Implementar mais templates de email
2. Adicionar suporte a HTML responsivo
3. Melhorar sistema de logs
4. Implementar métricas de entrega
5. Adicionar suporte a múltiplos idiomas
6. Implementar testes de email
7. Adicionar preview de templates
8. Melhorar sistema de filas

### Dependências Adicionadas

**Backend:**
- nodemailer: ^6.9.9
- bull: ^4.12.2
- handlebars: ^4.7.8
- winston: ^3.11.0
- redis: ^4.6.13

### Módulo 7: Sistema de Backup

### Funcionalidades Implementadas

1. **Backup do Banco de Dados**
   - [x] Backup completo do PostgreSQL
   - [x] Compactação automática
   - [x] Verificação de integridade
   - [x] Restauração de backup
   - [x] Limpeza automática de backups antigos

2. **Agendamento de Backups**
   - [x] Backup diário
   - [x] Backup semanal
   - [x] Backup mensal
   - [x] Configuração flexível de horários
   - [x] Notificações por email

3. **Gerenciamento de Backups**
   - [x] Listagem de backups disponíveis
   - [x] Download de backups
   - [x] Verificação de integridade
   - [x] Limpeza automática
   - [x] Logs detalhados

4. **Segurança**
   - [x] Autenticação requerida
   - [x] Validação de dados
   - [x] Proteção contra acesso não autorizado
   - [x] Logs de operações
   - [x] Tratamento de erros

### Tecnologias Utilizadas

- **Backend**
  - pg_dump/pg_restore para backup do PostgreSQL
  - node-cron para agendamento
  - nodemailer para notificações
  - winston para logs
  - express-validator para validação

### Estrutura do Projeto

```
server/
  ├── services/
  │   └── backupService.js
  ├── controllers/
  │   └── backupController.js
  ├── routes/
  │   └── backups.js
  └── scripts/
      └── scheduleBackups.js
```

### Configuração

```env
# Configurações de Backup
BACKUP_SCHEDULE_DAILY=0 0 * * *    # Todo dia à meia-noite
BACKUP_SCHEDULE_WEEKLY=0 0 * * 0   # Todo domingo à meia-noite
BACKUP_SCHEDULE_MONTHLY=0 0 1 * *  # Primeiro dia do mês à meia-noite
BACKUP_MAX_AGE_DAYS=30             # Manter backups por 30 dias
BACKUP_EMAIL_RECIPIENTS=admin@exemplo.com,backup@exemplo.com
```

### Rotas Implementadas

- `GET /api/backups` - Lista todos os backups
- `POST /api/backups` - Cria um novo backup
- `POST /api/backups/:backupFile/restore` - Restaura um backup
- `GET /api/backups/:backupFile/verify` - Verifica integridade
- `DELETE /api/backups/cleanup` - Remove backups antigos
- `GET /api/backups/:backupFile/download` - Download de backup

### Próximos Passos

1. Implementar backup de arquivos
2. Adicionar suporte a múltiplos bancos
3. Melhorar sistema de logs
4. Implementar métricas de backup
5. Adicionar interface web para gerenciamento
6. Implementar testes automatizados
7. Adicionar suporte a backup remoto
8. Melhorar sistema de notificações

### Dependências Adicionadas

**Backend:**
- node-cron: ^3.0.3
- pg-dump: ^0.11.0
- winston: ^3.11.0

### Módulo 8: Sistema de Logs

### Funcionalidades Implementadas

1. **Interface Web**
   - [x] Página dedicada para visualização de logs
   - [x] Filtros por tipo de log e período
   - [x] Visualização em tempo real
   - [x] Gráficos estatísticos
   - [x] Exportação em múltiplos formatos
   - [x] Limpeza de logs antigos
   - [x] Interface responsiva
   - [x] Visualização detalhada de logs individuais
   - [x] Filtros avançados por data e tipo
   - [x] Paginação de resultados

2. **Visualização de Dados**
   - [x] Tabela de logs com paginação
   - [x] Gráfico de barras por nível
   - [x] Gráfico de linha por hora
   - [x] Estatísticas gerais
   - [x] Detalhes expandíveis
   - [x] Formatação de data/hora
   - [x] Highlight de erros
   - [x] Preview de metadados
   - [x] Indicadores visuais por nível de log
   - [x] Visualização de metadados completos

3. **Exportação**
   - [x] Exportação para CSV
   - [x] Exportação para Excel
   - [x] Exportação para PDF
   - [x] Exportação para JSON
   - [x] Cabeçalhos personalizados
   - [x] Formatação condicional
   - [x] Nomes de arquivo dinâmicos
   - [x] Download automático
   - [x] Seleção de campos para exportação
   - [x] Filtros aplicados na exportação

4. **Gerenciamento**
   - [x] Limpeza automática
   - [x] Configuração de retenção
   - [x] Confirmação de operações
   - [x] Feedback visual
   - [x] Loading states
   - [x] Tratamento de erros
   - [x] Validação de dados
   - [x] Controle de acesso
   - [x] Políticas de retenção configuráveis
   - [x] Notificações de operações críticas

5. **Componentes de Interface**
   - [x] LogCharts - Visualização gráfica de logs
   - [x] LogExport - Exportação em múltiplos formatos
   - [x] LogDetails - Visualização detalhada de logs
   - [x] Filtros avançados por tipo e período
   - [x] Estatísticas em tempo real
   - [x] Interface responsiva para todos os dispositivos

### Tecnologias Utilizadas

- **Frontend**
  - Material-UI para interface
  - Recharts para gráficos
  - date-fns para datas
  - axios para requisições
  - Context API para estado
  - React Query para cache e gerenciamento de estado
  - React Hook Form para formulários
  - Yup para validação

- **Backend**
  - Winston para logs
  - Express para rotas
  - ExcelJS para Excel
  - PDFKit para PDF
  - json2csv para CSV
  - Sequelize para consultas otimizadas
  - Express Validator para validação

### Estrutura do Projeto

```
client/
  ├── src/
  │   ├── components/
  │   │   └── logs/
  │   │       ├── LogCharts.js
  │   │       ├── LogExport.js
  │   │       └── LogDetails.js
  │   ├── contexts/
  │   │   └── LogContext.js
  │   └── pages/
  │       └── logs/
  │           └── LogsPage.js
server/
  ├── controllers/
  │   └── logController.js
  ├── routes/
  │   └── logs.js
  ├── services/
  │   └── logService.js
  └── models/
      └── Log.js
```

### Rotas Implementadas

- `GET /api/logs` - Lista logs com filtros
- `GET /api/logs/stats` - Obtém estatísticas
- `POST /api/logs/cleanup` - Remove logs antigos
- `GET /api/logs/export` - Exporta logs
- `GET /api/logs/:id` - Obtém detalhes de um log específico
- `GET /api/logs/types` - Lista tipos de logs disponíveis

### Validações

- **Consulta de Logs**
  - Tipo de log válido
  - Datas em formato ISO
  - Limite entre 1 e 1000

- **Estatísticas**
  - Tipo de log válido
  - Período válido (1h, 24h, 7d, 30d)

- **Limpeza**
  - Idade máxima entre 1 e 365 dias

- **Exportação**
  - Tipo de log válido
  - Datas em formato ISO
  - Formato válido (csv, xlsx, pdf, json)

### Funcionalidades da Página de Logs

1. **Filtros Avançados**
   - Seleção por tipo de log (aplicação, acesso, erro, banco de dados, etc.)
   - Filtro por período com seletores de data
   - Limite de resultados configurável
   - Seleção de período para estatísticas (1h, 24h, 7d, 30d)

2. **Visualização de Dados**
   - Tabela com logs paginados
   - Indicadores visuais por nível (erro, aviso, info)
   - Visualização detalhada ao clicar em um log
   - Estatísticas gerais (total de logs, erros)
   - Gráficos interativos de distribuição

3. **Gerenciamento**
   - Botão para limpeza de logs antigos
   - Diálogo de confirmação com configuração de idade máxima
   - Exportação em múltiplos formatos
   - Feedback visual de operações

4. **Detalhes de Log**
   - Modal com informações completas
   - Formatação de data/hora
   - Exibição de metadados
   - Visualização de stack trace para erros

### Próximos Passos

1. Implementar busca textual
2. Adicionar filtros avançados
3. Melhorar performance de consultas
4. Implementar cache de logs
5. Adicionar mais tipos de gráficos
6. Implementar alertas
7. Melhorar exportação PDF
8. Adicionar testes automatizados
9. Implementar notificações em tempo real
10. Adicionar suporte a múltiplos idiomas

### Dependências Adicionadas

**Frontend:**
- @mui/material: ^5.15.0
- recharts: ^2.12.0
- date-fns: ^3.3.1
- @mui/x-date-pickers: ^6.18.0
- react-query: ^3.39.3

**Backend:**
- winston: ^3.11.0
- exceljs: ^4.4.0
- pdfkit: ^0.14.0
- json2csv: ^6.0.0
- express-validator: ^7.0.1

### Estrutura de Contextos

O projeto utiliza a Context API do React para gerenciamento de estado global. Todos os contextos estão centralizados na pasta `context/` para facilitar a manutenção e garantir consistência no acesso aos dados.

#### Contextos Disponíveis

1. **AuthContext**
   - Gerencia o estado de autenticação do usuário
   - Fornece funções para login, logout e verificação de permissões
   - Disponibiliza informações do usuário atual

2. **TicketContext**
   - Gerencia o estado dos chamados (tickets)
   - Fornece funções para criar, atualizar, listar e excluir chamados
   - Controla o estado de carregamento e erros relacionados aos chamados

3. **ReportContext**
   - Gerencia o estado dos relatórios
   - Fornece funções para criar, atualizar, listar e excluir relatórios
   - Implementa a geração de relatórios e métricas

#### Uso dos Contextos

Para utilizar um contexto em qualquer componente, importe o hook correspondente:

```jsx
import { useAuth } from '../context/AuthContext';
import { useTicket } from '../context/TicketContext';
import { useReports } from '../context/ReportContext';

function MeuComponente() {
  const { user, logout } = useAuth();
  const { tickets, loading } = useTicket();
  const { reports, createReport } = useReports();
  
  // Uso dos dados e funções dos contextos
}
```

#### Providers

Os providers dos contextos devem ser configurados no componente raiz da aplicação (App.js):

```jsx
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ReportProvider } from './context/ReportContext';

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <ReportProvider>
          {/* Resto da aplicação */}
        </ReportProvider>
      </TicketProvider>
    </AuthProvider>
  );
}
```

## Atualizações Recentes

### Consolidação de Contextos

Recentemente, realizamos uma consolidação dos contextos do React para melhorar a organização e manutenção do código:

1. **Centralização de Contextos**
   - Todos os contextos foram movidos para a pasta `context/`
   - Removida a pasta `contexts/` para evitar duplicidade
   - Atualizados todos os imports nos componentes para refletir a nova estrutura

2. **Contextos Consolidados**
   - `AuthContext.js`: Gerencia autenticação e permissões
   - `TicketContext.js`: Gerencia operações relacionadas a chamados
   - `ReportContext.js`: Gerencia relatórios e métricas

3. **Benefícios da Consolidação**
   - Código mais organizado e fácil de manter
   - Redução de duplicação de código
   - Padronização dos imports em todo o projeto
   - Melhor experiência para novos desenvolvedores

### Atualizações de Dependências

- Atualização do Material-UI de `@material-ui/core` para `@mui/material`
- Atualização do React Router para usar `useNavigate` em vez de `useHistory`
