# RedeFlex - Sistema de Gerenciamento de Solicitações Técnicas

## Visão Geral
RedeFlex é uma aplicação web moderna desenvolvida em React com TypeScript para gerenciamento de solicitações técnicas. O sistema permite que usuários criem e acompanhem solicitações de suporte técnico, enquanto técnicos podem gerenciar e atender estas solicitações.

## Tecnologias Principais
- React 18.2.0
- TypeScript 4.9.5
- Material-UI (MUI) 5.15.10
- React Router DOM 6.22.1
- Axios
- Jest + Testing Library
- MSW (Mock Service Worker)

## Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/redeflex.git
cd redeflex/client
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Copie os arquivos `.env.example` para:
  - `.env.development` (desenvolvimento)
  - `.env.production` (produção)
  - `.env.test` (testes)

## Scripts Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar testes
npm test

# Executar testes com cobertura
npm test -- --coverage

# Verificar e corrigir problemas de linting
npm run lint
npm run lint:fix

# Formatar código
npm run format
```

### Docker
```bash
# Ambiente de desenvolvimento
npm run docker:dev
npm run docker:dev:build
npm run docker:dev:down

# Ambiente de produção
npm run docker:prod
npm run docker:prod:build
npm run docker:prod:down
```

## Estrutura do Projeto

```
client/
├── src/
│   ├── components/     # Componentes React
│   ├── context/       # Contextos React (estados globais)
│   ├── hooks/         # Hooks personalizados
│   ├── services/      # Serviços e integrações
│   ├── types/         # Definições de tipos TypeScript
│   ├── utils/         # Utilitários e helpers
│   └── mocks/         # Mocks para testes
├── public/           # Arquivos públicos
└── tests/            # Testes
```

## Funcionalidades Principais

### Autenticação
- Login
- Registro
- Recuperação de senha
- Gerenciamento de sessão

### Solicitações
- Criação de solicitações
- Listagem e filtragem
- Detalhes e atualização
- Atribuição a técnicos
- Acompanhamento de status

### Técnicos
- Cadastro e gerenciamento
- Especialidades
- Disponibilidade
- Histórico de atendimentos

### Administração
- Gerenciamento de usuários
- Configurações do sistema
- Relatórios e métricas

## Testes

O projeto utiliza Jest e Testing Library para testes. A cobertura mínima exigida é de 80% para:
- Branches
- Funções
- Linhas
- Statements

### Estrutura de Testes
- Testes unitários para componentes
- Testes de integração
- Testes de contextos
- Mocks de serviços com MSW

## Padrões de Código

### Estilo
- ESLint para linting
- Prettier para formatação
- Convenções do TypeScript

### Commits
Seguimos o padrão Conventional Commits:
- feat: nova funcionalidade
- fix: correção de bug
- docs: documentação
- style: formatação
- refactor: refatoração
- test: testes
- chore: manutenção

## Ambientes

### Desenvolvimento
- URL: http://localhost:3000
- API: http://localhost:3001
- Mock API habilitado

### Produção
- URL: https://redeflex.com.br
- API: https://api.redeflex.com.br
- Mock API desabilitado

### Testes
- URL: http://localhost:3000
- API: http://localhost:3001
- Mock API habilitado

## Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 