#  BetNet: Escudo Digital & Psicologia Reversa

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.1.0-orange.svg)](https://github.com/Kaylanekymberly/BetNet)

O **BetNet** é uma extensão de navegador desenvolvida para mitigar os impactos da "Lógica do Lucro" sobre a saúde mental financeira. Utilizando algoritmos de detecção de palavras-chave e bloqueio funcional de interface, o projeto atua como uma barreira técnica contra o estímulo desenfreado ao mercado de apostas (bets).

---

##  A Filosofia

Baseado no conceito de **Psicologia Reversa das Finanças**, este projeto inverte a lógica do consumo imediato. Enquanto o sistema induz ao risco, o BetNet protege a vulnerabilidade, tratando o patrimônio como um ativo de autocuidado e paz de espírito.

> *"O maior risco sistêmico atual é a fragilidade emocional diante do endividamento por jogos. Este projeto é a minha contribuição técnica para garantir que o investidor mantenha o controle emocional, o primeiro passo para qualquer estratégia financeira sólida."*

---

##  Problema que Resolvemos

O mercado de apostas online explodiu no Brasil, com influenciadores e publicidade massiva bombardeando usuários vulneráveis com promessas de "dinheiro fácil". Os resultados são devastadores:

- **Endividamento crescente** entre jovens adultos
- **Vício em jogos de azar** disfarçado de entretenimento
- **Perda de controle financeiro** e deterioração da saúde mental
- **Impacto em investimentos** de longo prazo e poupança familiar

O BetNet é uma ferramenta de **autodefesa digital** que coloca você de volta no controle.

---

##  Funcionalidades Atuais

###  Bloqueio Inteligente no YouTube
- **Detecção em Tempo Real:** Identifica vídeos relacionados a apostas em Home, Busca, Shorts e vídeos relacionados
- **Overlay de Proteção:** Card compacto (150x150px) que bloqueia visualmente o conteúdo prejudicial
- **Prevenção de Cliques:** Desativa links e impede acesso acidental ao conteúdo

###  Interrupção de Fluxo
- **Pausa Automática:** Videos na página `/watch` são automaticamente pausados e removidos
- **Bloqueio de Áudio:** Remove a fonte do vídeo para evitar consumo passivo de conteúdo indutor
- **Proteção de Controles:** Oculta controles do player para impedir reprodução manual

###  Filtro Avançado de Conteúdo
- **50+ Palavras-Chave:** Lista abrangente incluindo gírias, hashtags e termos técnicos
- **Detecção de Hashtags:** Identifica tags escondidas em títulos e descrições
- **Multi-Idioma:** Suporte para português e inglês
- **Atualização Dinâmica:** Sistema de regras que evolui com novos padrões

###  Bloqueio de Sites
- **Redirect Automático:** Sites de apostas conhecidos são redirecionados para página de aviso
- **Lista Configurável:** Suporte para adicionar novos domínios maliciosos
- **Notificação Clara:** Página de bloqueio explica o motivo e oferece recursos de ajuda

---

##  Tecnologias Utilizadas

```
 Stack Técnico
├── JavaScript (Vanilla)
│   ├── MutationObserver API (monitoramento de DOM dinâmico)
│   ├── Event Delegation (performance otimizada)
│   └── Debouncing/Throttling (controle de execução)
├── Chrome Extension API
│   ├── Content Scripts (injeção de lógica)
│   ├── Background Service Workers (gerenciamento de estado)
│   └── Declarative Net Request (bloqueio de rede)
├── CSS3
│   ├── Flexbox & Grid (layout responsivo)
│   ├── Animations (feedback visual)
│   └── Custom Properties (temas configuráveis)
└── Manifest V3
    └── Última versão do padrão Chrome Extensions
```

###  Arquitetura

```
BetNet/
├── manifest.json          # Configuração da extensão
├── content.js            # Script principal de detecção e bloqueio
├── background.js         # Service worker para gerenciamento
├── rules.json           # Regras declarativas de bloqueio
├── popup.html           # Interface de controle do usuário
├── blocked.html         # Página de bloqueio de sites
└── icons/              # Assets visuais
```

---

## Visão Profissional (CPA-20)

Como **profissional certificada CPA-20**, entendo profundamente a importância da educação financeira e da proteção do investidor. Este projeto nasce da observação de um problema sistêmico:

###  Análise de Risco
- **Risco Comportamental:** Apostas exploram vieses cognitivos (falácia do jogador, ilusão de controle)
- **Risco de Liquidez:** Dinheiro desviado de investimentos para jogos de soma negativa
- **Risco Regulatório:** Mercado ainda pouco regulamentado no Brasil

###  Solução Técnica
O BetNet não é censura, é **proteção proativa**. Assim como um firewall protege contra malware, esta extensão protege contra estímulos financeiramente predatórios.

---

##  Instalação

### Método 1: Chrome Web Store (Em Breve)
```bash
# Aguardando aprovação na Chrome Web Store
```

### Método 2: Instalação Manual (Desenvolvedor)

1. **Clone o repositório:**
```bash
git clone https://github.com/Kaylanekymberly/BetNet.git
cd BetNet
```

2. **Abra o Chrome e acesse:**
```
chrome://extensions/
```

3. **Ative o "Modo do desenvolvedor"** (canto superior direito)

4. **Clique em "Carregar sem compactação"**

5. **Selecione a pasta do BetNet**

6. **Pronto!** O escudo  aparecerá na barra de extensões

---

##  Como Usar

### Uso Básico
1. **Navegue normalmente** no YouTube ou outros sites
2. **Conteúdo prejudicial é bloqueado automaticamente**
3. **Veja estatísticas** de bloqueios no ícone da extensão

### Configuração Avançada
- Clique no ícone do BetNet na barra de extensões
- Acesse configurações para:
  -  Adicionar palavras-chave personalizadas
  -  Gerenciar lista de sites bloqueados
  -  Ver estatísticas detalhadas
  -  Exportar relatórios

---

##  Estatísticas de Impacto

```
 Métricas de Proteção
├── Vídeos Bloqueados: Contador em tempo real
├── Sites Interceptados: Lista de tentativas de acesso
├── Tempo Protegido: Horas economizadas de exposição
└── Economia Estimada: Cálculo baseado em padrões de consumo
```

---

##  Roadmap

Veja nosso [ROADMAP.md](ROADMAP.md) completo para conhecer os próximos passos do projeto.

### Próximas Features
-   IA de detecção de imagem (OCR em banners)
-   Dashboard de saúde financeira
-   Suporte para Firefox e Edge
-   Expansão para Instagram e TikTok
-   Mensagens de Psicologia Reversa

---

##  Contribuindo

Contribuições são **muito bem-vindas**! Este é um projeto de impacto social e sua ajuda pode proteger milhares de pessoas.


##  Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License - Você pode:
 Usar comercialmente
 Modificar
 Distribuir
 Uso privado

Condições:
 Manter o aviso de copyright
 Incluir a licença em cópias
```

---

##  Autora

**Kaylane Kymberly**
-  Certificação CPA-20 (ANBIMA)
-  Especialista em Educação Financeira
-  Pesquisadora em Psicologia Financeira

### Conecte-se
- GitHub: [@Kaylanekymberly](https://github.com/Kaylanekymberly)
- LinkedIn: https://www.linkedin.com/in/kaylane-kimberly-09a6ba25b/
- Email: kaylanekymberly123@gmail.com

---

##  Agradecimentos

Este projeto é dedicado a todas as pessoas que lutam contra o vício em jogos de azar e trabalham para reconstruir sua saúde financeira.

> *"A verdadeira riqueza não está em ganhar mais, mas em proteger melhor."*

---

##  Aviso Legal

O BetNet é uma ferramenta de **proteção e educação**. Não substitui aconselhamento profissional financeiro ou psicológico. Se você ou alguém que conhece está lutando contra vício em jogos, procure ajuda profissional:

-  **CVV:** 188 (apoio emocional)
-  **CAPS:** Centros de Atenção Psicossocial
-  **Jogadores Anônimos:** [www.jogadoresanonimos.com.br](http://www.jogadoresanonimos.com.br)

---

<div align="center">

**Feito com 💜 e consciência financeira**

⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!

[⬆ Voltar ao topo](#-betnet-escudo-digital--psicologia-reversa)

</div>
