# Online Shop Dashboard

Aplicação web construída em React + TypeScript para administrar produtos, clientes e carrinho de compras utilizando dados públicos da Fake Store API. A interface segue os componentes do Ant Design e inclui modo claro/escuro.

## Sumário
1. [Stack Principal](#stack-principal)
2. [Arquitetura e Pastas](#arquitetura-e-pastas)
3. [Pré-requisitos](#pré-requisitos)
4. [Como Executar](#como-executar)
5. [Scripts Disponíveis](#scripts-disponíveis)
6. [Fluxos de Negócio](#fluxos-de-negócio)
7. [Integração com Fake Store API](#integração-com-fake-store-api)
8. [Temas e Acessibilidade](#temas-e-acessibilidade)


## Stack Principal
- React 18 + TypeScript
- Ant Design 5
- Redux Toolkit para estado global (produtos customizados, carrinho e clientes)
- React Router DOM para navegação
- Fake Store API como fonte de dados externa

## Arquitetura e Pastas
- `src/components`: cabeçalho, rodapé e componentes compartilhados (ex.: troca de tema).
- `src/pages`: telas principais (Home, Products, Clients, etc).
- `src/redux`: store, hooks e slices (cart, products, clients).
- `src/contexts`: contextos de autenticação e tema.
- `src/services`: integrações externas. `fakeStoreApi.ts` expõe um singleton para chamadas REST, garantindo reutilização e ponto único de configuração.
- `src/types`: contratos compartilhados para Products, Users, CartItems.

## Pré-requisitos
- Node.js 18.x (ou versão LTS mais recente)
- npm 9.x (instalado junto com o Node)
- Acesso à internet para consumir a Fake Store API

## Como Executar
1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Acesse http://localhost:3000.

Para build de produção:
```bash
npm run build
```
Os artefatos serão gerados em `build/`.

## Scripts Disponíveis
- `npm start`: executa a aplicação em modo desenvolvimento.
- `npm test`: roda a suíte de testes configurada pelo Create React App.
- `npm run build`: gera o build otimizado de produção.
- `npm run eject`: expõe as configurações do CRA (irreversível, use apenas se necessário).

## Fluxos de Negócio
- **Produtos**: consulta dados remotos, permite cadastrar itens customizados, editar ou remover e adicioná-los ao carrinho.
- **Carrinho**: mantém estado global com quantidades, total e ações rápidas (limpar, checkout simulado).
- **Clientes**: carrega usuários da Fake Store, adapta dados para o domínio e permite CRUD local com persistência em `localStorage`.
- **Home**: destaca produtos populares e acessos rápidos.

## Integração com Fake Store API
- Todas as chamadas passam por `FakeStoreApi` (singleton em `src/services/fakeStoreApi.ts`), centralizando base URL, tratamento de erros e operações de caching local via Redux/localStorage.
- Endpoints utilizados:
  - `GET /products`
  - `GET /products/categories`
  - `GET /users`
- Em caso de falha, a aplicação mostra mensagens contextuais e tenta preservar dados localmente.

## Temas e Acessibilidade
- Suporte a modo claro/escuro via `ThemeContext`.
- Alternância de tema com ícones do Ant Design (Sun/Moon).
- Layout responsivo com ajustes específicos para cabeçalho, tabela de clientes e modal do carrinho.