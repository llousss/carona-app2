# Registro de Alterações (Changelog) - Vamo Junto

Este documento acompanha as principais implementações, alterações e correções feitas no aplicativo.

## [Início do Acompanhamento] - Estado Atual do App

### Adicionado
- **Configuração do Ambiente**: Projeto rodando no Emulador com `npx expo start`.
- **Tela do Motorista (`src/screens/DriverHome.js`)**: 
  - Mapa em tela cheia implementado com `react-native-maps`.
  - Painel inferior (usando `KeyboardAvoidingView`) com dois campos de texto (Origem e Destino) controlados via `useState`.
  - Botão de ação incluído.
- **Navegação (`src/navigation/index.js`)**:
  - Tela `DriverHome` importada e incluída no `<Stack.Navigator>`.
  - Tela `UserTypeSelection.js` ajustada para redirecionar corretamente para a tela do motorista.

### Modificado/Corrigido
- **`app.json`**: 
  - Conflitos de dependências resolvidos.
  - Plugin `expo-router` removido.
  - `web.output` alterado de `static` para `single`.
  - Configuração `typedRoutes` removida para consolidar a navegação via `@react-navigation`.
- **Implementação Completa da Tela do Motorista (`src/screens/DriverHome.js`)**:
  - **Novo Padrão Visual (Uber-like):** Adoção completa do padrão visual escuro (`#0B0B0F`), incluindo a "timeline" visual de rotas (bolinha, linha, quadrado) idêntica à tela de busca do passageiro.
  - **BottomSheet:** Formulários migrados para a gaveta deslizante (`@gorhom/bottom-sheet`), garantindo que o mapa seja a parte principal da tela com os controles não-intrusivos acima.
  - **Funcionalidades do Mapa (Waze-style):** Adicionado modo GPS com um botão "Centralizar em mim" (track da posição atual via `expo-location`).
  - **Agendamento de Corridas:** Adicionada a dependência `@react-native-community/datetimepicker` permitindo ao motorista selecionar entre "Sair Agora" e "Agendar Rota" com a exibição de data e hora nativas.
  - **Modo "Buscar Passageiros":** Novo Switch para ativar/desativar a escuta de passageiros. Quando ativado, uma "badge" pulsante exibe que a carona está visível e buscando matches no sistema.
  - **Mock de Match de Caronas:** Simulação integrada que desenha uma rota no mapa ao confirmar viagem e simula um alerta (modal) de encontro de passageiro compatível.
  - **Autocomplete de Endereços:** Migração da inteligência da tela de passageiros para o motorista, integrando `expo-location` para busca e decodificação de endereços ao digitar (com debounce pattern), e seleção de locais via lista no BottomSheet.

- **Design System de Autenticação e Perfis (CommunitRide):**
  - **`Login.js` & `Register.js`**: Refatoração completa adotando o guideline "CommunitRide". Fundo ultra-escuro (`#111111`), painéis em card, inputs em bloco, botões na cor Verde Vibrante (`#22C55E`) e botões sociais unificados.
  - **`UserTypeSelection.js`**: Redesign total focado em UI moderno (estilo Uber). Remoção do botão "Confirmar", substituído por Cards de Ação Direta verticais para "Motorista" (Verde) e "Passageiro" (Azul). Adicionado Bottom Navigation Bar simulado.
