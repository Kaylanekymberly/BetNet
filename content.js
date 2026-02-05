// ========================================
// ESCUDO DIGITAL - Content Script
// Bloqueio de sites de apostas e vídeos relacionados
// ========================================

// ========================================
// BLOQUEIO GLOBAL DE CAPTURA 🔥
// Intercepta cliques ANTES do YouTube processar
// ========================================

document.addEventListener('click', (e) => {
  // Busca o link que o usuário tentou clicar
  const link = e.target.closest("a[href*='youtube.com/watch'], a[href*='/shorts/']");
  if (!link) return;

  // Busca o renderer (container do vídeo)
  const renderer = link.closest(
    'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-reel-item-renderer, ytd-compact-video-renderer'
  );

  // Se o vídeo está marcado como bloqueado, MATA o clique
  if (renderer && renderer.dataset.blocked === 'true') {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log('🛡️ Clique BLOQUEADO no capture global');
    return false;
  }
}, true); // 🔥 CAPTURE: true = pega o evento ANTES de qualquer outro listener

// ========================================
// CONSTANTES DE CONFIGURAÇÃO
// ========================================

const CONFIG = {
  // Estilos do bloqueio
  CARD: {
    SIZE: '150px', // Tamanho fixo do card
    BG_COLOR: '#1a1a2e',
    BORDER_COLOR: '#a855f7',
    BORDER_WIDTH: '2px',
    BORDER_RADIUS: '15px',
    SHADOW: '0 0 20px rgba(168, 85, 247, 0.4)'
  },
  
  // Estilos do backdrop
  BACKDROP: {
    BG_COLOR: 'rgba(0, 0, 0, 0.95)',
    Z_INDEX: 999998
  },
  
  // Z-index
  Z_INDEX: {
    BACKDROP: 999998,
    OVERLAY: 999999
  },
  
  // Cores do shield
  SHIELD: {
    GRADIENT_START: '#3b82f6',
    GRADIENT_END: '#60a5fa',
    GLOW: 'rgba(59, 130, 246, 0.6)'
  },
  
  // Intervalos de verificação
  CHECK_INTERVAL_MS: 2000,
  
  // Mensagens
  MESSAGES: {
    TITLE: 'Bloqueado',
    SUBTITLE: 'Conteúdo de apostas',
    BADGE: 'Escudo Digital'
  }
};

// ========================================
// LISTAS DE PALAVRAS-CHAVE
// ========================================

// Lista de palavras-chave relacionadas a apostas
const bettingKeywords = [
  // Nomes de jogos e plataformas
  'aposta', 'apostas', 'bets', 'betting',
  'cassino', 'casino', 'casinò',
  'blaze', 'blazer',
  'tiger', 'tigre', 'tigrinho',
  'fortune', 'fortuna',
  'rabbit', 'coelho',
  'mines', 'minas',
  'aviator', 'aviador', 'avião',
  'crash', 'spaceman',
  'double', 'roleta', 'roulette',
  'slot', 'slots', 'caça-níquel', 'caca niquel',
  
  // Sites específicos
  'bet365', 'betano', 'pixbet', 'sportingbet',
  'betfair', '1xbet', 'bwin', 'rivalo',
  'esportedasorte', 'esporte da sorte',
  'betway', 'pokerstars', '888sport',
  'novibet', 'parimatch', 'galera bet',
  'stake', 'bc.game', 'bc game',
  
  // Termos relacionados
  'palpite', 'palpites', 'tips', 'dica',
  'odd', 'odds', 'banca', 'bankroll',
  'saldo', 'depósito', 'deposito', 'saque',
  'greens', 'green', 'reds', 'red',
  'estratégia', 'estrategia', 'método', 'metodo',
  'sistema', 'técnica', 'tecnica',
  'martingale', 'fibonacci',
  
  // Frases e contextos
  'ganhar dinheiro', 'dinheiro fácil', 'dinheiro facil',
  'ganhar na bet', 'como ganhar',
  'renda extra', 'trabalhar em casa',
  'ficar rico', 'enriquecer',
  'paga mesmo', 'pagando', 'pagou',
  'saque imediato', 'saque rápido', 'saque rapido',
  'bônus', 'bonus', 'free bet', 'aposta grátis', 'aposta gratis',
  
  // Jogos específicos
  'fortune tiger', 'fortune rabbit', 'fortune ox',
  'fortune mouse', 'fortune dragon',
  'penalty shoot-out', 'penalty',
  'balloon', 'balão', 'balao',
  'plinko', 'dice', 'dados',
  'bacará', 'baccarat', 'bacara',
  'blackjack', 'poker', '21',
  
  // Plataformas e apps
  'plataforma nova', 'nova plataforma',
  'plataforma pagando', 'app pagando',
  'plataforma bet', 'site de aposta',
  'jogo de aposta', 'jogos de aposta',
  'casa de aposta', 'casas de aposta',
  
  // Termos técnicos
  'live bet', 'ao vivo', 'in-play',
  'pre-match', 'pré-jogo',
  'cashout', 'cash out',
  'over', 'under', 'handicap',
  'spread', 'parlay', 'acumulada',
  
  // Gírias e variações
  'jogo do', 'joguinho', 'jogar',
  'ta pagando', 'tá pagando', 'está pagando',
  'buga', 'bug', 'hack', 'robô', 'robo', 'bot',
  'script', 'sinais', 'sinal', 'grupo vip',
  
  // Jogos de azar
  'jogo de azar', 'jogos de azar',
  'gambling', 'gamble', 'gambler',
  'azar', 'sorte', 'lucky'
];

// Lista de exceções - conteúdo legítimo que NÃO deve ser bloqueado
const whitelistKeywords = [
  // Entretenimento e premiações
  'bet awards', 'bet+', 'bet hip hop', 'bet her',
  'black entertainment television',
  
  // Culinária
  'receita', 'receitas', 'cozinha', 'chef',
  'ingredientes', 'preparo', 'fazer',
  
  // Alfabeto e educação
  'alfabeto', 'letra', 'aprender',
  'educação', 'educacao', 'escola',
  
  // Tecnologia legítima
  'typescript', 'javascript', 'alphabet',
  'beta', 'beta version', 'versão beta',
  
  // Documentários e natureza
  'documentário', 'documentario',
  'natureza', 'wildlife', 'animal',
  
  // Esportes legítimos
  'treino', 'workout', 'fitness',
  'corrida', 'running', 'maratona'
];

// Lista de sites de apostas conhecidos
const bettingSites = [
  'bet365', 'betano', 'sportingbet', 'betfair', '1xbet',
  'bwin', 'rivalo', 'pixbet', 'esportedasorte', 'blaze',
  'betway', 'pokerstars', '888sport', 'novibet', 'parimatch',
  'stake', 'bc.game', 'f12bet', 'luva.bet', 'estrela.bet',
  'superbet', 'betmotion', 'betsson'
];

// ========================================
// FUNÇÕES AUXILIARES - VALIDAÇÃO
// ========================================

/**
 * Valida se o elemento é válido para bloqueio
 * @param {HTMLElement} element - Elemento a ser validado
 * @returns {boolean} - True se válido
 */
function isValidElement(element) {
  if (!element) {
    console.warn('Escudo Digital: Elemento inválido fornecido');
    return false;
  }
  
  if (!(element instanceof HTMLElement)) {
    console.warn('Escudo Digital: Não é um HTMLElement');
    return false;
  }
  
  return true;
}

/**
 * Verifica se o texto contém palavras-chave de apostas
 * @param {string} text - Texto a ser verificado
 * @returns {boolean} - True se contém palavras de apostas
 */
function containsBettingKeywords(text) {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase();
  
  // PRIMEIRO: Verificar se está na whitelist (conteúdo legítimo)
  const isWhitelisted = whitelistKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Se estiver na whitelist, NÃO bloquear
  if (isWhitelisted) return false;
  
  // DEPOIS: Verificar se contém palavras de apostas
  return bettingKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
}

// ========================================
// FUNÇÕES AUXILIARES - CRIAÇÃO DE ELEMENTOS
// ========================================

/**
 * Cria o HTML interno do card de bloqueio
 * Otimizado para 150x150px
 * @returns {string} - HTML do conteúdo
 */
function createBlockMessageHTML() {
  return `
    <div style="text-align: center; padding: 10px;">
      <!-- Shield Icon -->
      <svg width="40" height="40" viewBox="0 0 24 24" style="margin-bottom: 8px; filter: drop-shadow(0 0 8px ${CONFIG.SHIELD.GLOW});">
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${CONFIG.SHIELD.GRADIENT_START};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${CONFIG.SHIELD.GRADIENT_END};stop-opacity:1" />
          </linearGradient>
        </defs>
        <path fill="url(#shieldGradient)" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
      </svg>
      
      <div style="font-size: 14px; font-weight: 600; color: ${CONFIG.CARD.BORDER_COLOR}; margin-bottom: 4px; line-height: 1.2;">
        ${CONFIG.MESSAGES.TITLE}
      </div>
      
      <div style="font-size: 9px; color: rgba(255, 255, 255, 0.7); margin-bottom: 8px; line-height: 1.2;">
        ${CONFIG.MESSAGES.SUBTITLE}
      </div>
      
      <div style="font-size: 8px; padding: 3px 8px; background: rgba(168, 85, 247, 0.2); 
                  border-radius: 4px; color: rgba(255, 255, 255, 0.6); display: inline-block;">
        ${CONFIG.MESSAGES.BADGE}
      </div>
    </div>
  `;
}

/**
 * Cria o elemento backdrop (fundo escuro que cobre 100% do vídeo)
 * Usa FLEX para centralizar o card
 * @returns {HTMLElement} - Elemento backdrop
 */
function createBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: ${CONFIG.BACKDROP.BG_COLOR} !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: ${CONFIG.Z_INDEX.BACKDROP} !important;
    pointer-events: auto !important;
  `;
  
  // Accessibility
  backdrop.setAttribute('role', 'alert');
  backdrop.setAttribute('aria-live', 'polite');
  backdrop.setAttribute('aria-label', 'Conteúdo bloqueado por conter material de apostas');
  
  return backdrop;
}

/**
 * Cria o elemento overlay (card quadrado centralizado)
 * ✅ CORREÇÃO APLICADA: Adiciona max-width e max-height para travar o tamanho
 * ✅ CORREÇÃO APLICADA: Adiciona flex-shrink: 0 para evitar compressão
 * ✅ CORREÇÃO APLICADA: Adiciona margin: auto para centralização perfeita
 * @returns {HTMLElement} - Elemento overlay
 */
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'escudo-digital-block';
  
  // Aplicando as configurações do CONFIG
  overlay.style.cssText = `
    /* TRAVAS DE TAMANHO - Evita esticamento */
    width: ${CONFIG.CARD.SIZE} !important;
    height: ${CONFIG.CARD.SIZE} !important;
    min-width: ${CONFIG.CARD.SIZE} !important;
    min-height: ${CONFIG.CARD.SIZE} !important;
    max-width: ${CONFIG.CARD.SIZE} !important;
    max-height: ${CONFIG.CARD.SIZE} !important;
    flex-shrink: 0 !important;
    margin: auto !important;
    
    /* LAYOUT */
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    
    /* ESTILO VISUAL */
    background: ${CONFIG.CARD.BG_COLOR} !important;
    border: ${CONFIG.CARD.BORDER_WIDTH} solid ${CONFIG.CARD.BORDER_COLOR} !important;
    border-radius: ${CONFIG.CARD.BORDER_RADIUS} !important;
    box-shadow: ${CONFIG.CARD.SHADOW} !important;
    
    /* Z-INDEX */
    z-index: ${CONFIG.Z_INDEX.OVERLAY} !important;
    
    /* OVERFLOW */
    overflow: hidden !important;
  `;
  
  overlay.innerHTML = createBlockMessageHTML();
  
  return overlay;
}

// ========================================
// FUNÇÃO PRINCIPAL DE BLOQUEIO
// ========================================

/**
 * 🛡️ BLOQUEIO REAL - SEM FIRULAS
 * O overlay fica ACIMA do <a>, não dentro dele.
 * Isso é o que BLOQUEIA DE VERDADE.
 * 
 * @param {HTMLElement} item - Elemento do vídeo (ytd-video-renderer, etc)
 */
function blockElement(item) {
  if (!item || item.dataset.blocked) return;
  item.dataset.blocked = 'true';

  // O LINK REAL (onde o clique acontece)
  const link = item.querySelector('a#thumbnail');
  if (!link) return;

  // Container EXTERNO do link (o overlay vai ser IRMÃO do link)
  const wrapper = link.parentElement;
  wrapper.style.position = 'relative';

  // O BLOCKER (overlay que fica ACIMA do link)
  const blocker = document.createElement('div');
  blocker.className = 'shieldnet-blocker';
  blocker.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(6px);
    z-index: 99999;
    pointer-events: auto;
    cursor: not-allowed;
  `;

  // CANCELA O CLIQUE
  blocker.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
  });

  // VISUAL DO BLOQUEIO
  blocker.innerHTML = `
    <div style="
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        border: 2px solid #a855f7;
        border-radius: 14px;
        padding: 16px 20px;
        background: rgba(26, 26, 46, 0.95);
        text-align: center;
      ">
        <div style="font-size: 24px; margin-bottom: 4px;">🛡️</div>
        <strong style="font-size: 16px;">Bloqueado</strong><br>
        <span style="font-size: 13px; opacity: 0.8;">Conteúdo de apostas</span>
      </div>
    </div>
  `;

  // INSERE COMO IRMÃO DO LINK (não como filho!)
  wrapper.appendChild(blocker);

  // Notificar
  notifyBackgroundScript('videoBlocked');
  console.log('🛡️ Bloqueado:', item);
}

/**
 * Notifica o background script sobre eventos
 * @param {string} type - Tipo do evento
 */
function notifyBackgroundScript(type) {
  try {
    chrome.runtime.sendMessage({ type });
  } catch (e) {
    // Ignorar se background não disponível
    console.log(`Escudo Digital: ${type}`);
  }
}

// ========================================
// BLOQUEIO DE VÍDEOS DO YOUTUBE
// ========================================

/**
 * Extrai todo o texto relevante de um elemento de vídeo
 * @param {HTMLElement} renderer - Elemento do vídeo
 * @param {object} selectors - Seletores CSS para buscar
 * @returns {string} - Texto combinado
 */
function extractVideoText(renderer, selectors) {
  const texts = [];
  
  // Título
  const titleElement = renderer.querySelector(selectors.title);
  if (titleElement) {
    texts.push(
      titleElement.textContent || 
      titleElement.getAttribute('aria-label') || 
      titleElement.title || 
      ''
    );
  }
  
  // Descrição
  if (selectors.description) {
    const descElement = renderer.querySelector(selectors.description);
    if (descElement) texts.push(descElement.textContent || '');
  }
  
  // Canal
  if (selectors.channel) {
    const channelElement = renderer.querySelector(selectors.channel);
    if (channelElement) texts.push(channelElement.textContent || '');
  }
  
  // Metadados
  if (selectors.metadata) {
    const metadataElements = renderer.querySelectorAll(selectors.metadata);
    metadataElements.forEach(el => texts.push(el.textContent || ''));
  }
  
  return texts.join(' ');
}

/**
 * Verifica e bloqueia vídeos regulares do YouTube
 */
function checkRegularVideos() {
  const videoRenderers = document.querySelectorAll(
    'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer'
  );
  
  videoRenderers.forEach(renderer => {
    if (renderer.dataset.checked) return;
    renderer.dataset.checked = 'true';
    
    const text = extractVideoText(renderer, {
      title: '#video-title, .ytd-video-meta-block #video-title',
      description: '#description-text, .description-text, #metadata-line',
      channel: '#channel-name, .ytd-channel-name a, #text.ytd-channel-name',
      metadata: '.badge-style-type-simple, .badge, #metadata'
    });
    
    if (containsBettingKeywords(text)) {
      blockElement(renderer);
    }
  });
}

/**
 * Verifica e bloqueia Shorts do YouTube
 * 🎯 BUSCA REFINADA: Foca nos containers de shorts E nos players internos
 */
function checkShorts() {
  // Buscar containers de shorts
  const shorts = document.querySelectorAll(`
    ytd-reel-item-renderer,
    ytd-reel-video-renderer, 
    ytd-shorts,
    ytd-rich-section-renderer,
    #shorts-container ytd-reel-item-renderer,
    ytd-reel-shelf-renderer ytd-reel-item-renderer,
    [is-shorts] ytd-reel-item-renderer,
    yt-shorts-video-renderer,
    #player-shorts-container,
    .shorts-player,
    #shorts-player
  `.trim());
  
  shorts.forEach(short => {
    if (short.dataset.checked) return;
    short.dataset.checked = 'true';
    
    const text = extractVideoText(short, {
      title: '#video-title, .reel-video-title, h3, .title, yt-formatted-string#video-title, #text.ytd-reel-video-renderer',
      description: '#overlay-text, .overlay-text, #metadata',
      channel: '#channel-name, ytd-channel-name, .channel-name'
    });
    
    if (containsBettingKeywords(text)) {
      blockElement(short);
    }
  });
}

/**
 * Verifica e bloqueia o vídeo atualmente sendo assistido
 */
function checkCurrentVideo() {
  const videoTitle = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title, #title h1');
  const videoDescription = document.querySelector('#description-inline-expander, #description, ytd-text-inline-expander');
  const channelName = document.querySelector('#channel-name #text, ytd-channel-name #text');
  
  if (!videoTitle) return;
  
  const title = videoTitle.textContent || '';
  const description = videoDescription?.textContent || '';
  const channel = channelName?.textContent || '';
  const fullText = `${title} ${description} ${channel}`;
  
  if (containsBettingKeywords(fullText)) {
    const player = document.querySelector('#movie_player, .html5-video-player');
    
    if (player && !player.dataset.blocked) {
      player.dataset.blocked = 'true';
      player.style.position = 'relative';

      // BLOCKER para o player aberto
      const blocker = document.createElement('div');
      blocker.className = 'shieldnet-player-blocker';
      blocker.style.cssText = `
        position: absolute;
        inset: 0;
        background: black;
        z-index: 99999;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      blocker.innerHTML = `
        <div style="
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        ">
          <div style="
            border: 2px solid #a855f7;
            border-radius: 16px;
            padding: 24px 32px;
            background: rgba(26, 26, 46, 0.95);
          ">
            <div style="font-size: 48px; margin-bottom: 12px;">🛡️</div>
            <strong style="font-size: 24px; display: block; margin-bottom: 8px;">Conteúdo Bloqueado</strong>
            <span style="font-size: 16px; opacity: 0.8;">Este vídeo contém conteúdo relacionado a apostas</span>
          </div>
        </div>
      `;

      player.appendChild(blocker);
      
      // 🔥 MATAR O VÍDEO COMPLETAMENTE
      const video = player.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
        video.src = ''; // 🔥 Limpa a source
        video.load();   // 🔥 Força reload vazio (impede autoplay/preload)
      }

      notifyBackgroundScript('videoBlocked');
      console.log('🛡️ Player bloqueado e vídeo morto');
    }
  }
}

/**
 * Verifica e bloqueia todos os tipos de vídeos do YouTube
 */
function checkAndBlockYouTubeVideos() {
  checkRegularVideos();
  checkShorts();
  checkCurrentVideo();
}

// ========================================
// BLOQUEIO DE SITES DE APOSTAS
// ========================================

/**
 * Verifica se o site atual é um site de apostas
 * @returns {boolean} - True se for site de apostas
 */
function isBettingSite() {
  const hostname = window.location.hostname.toLowerCase();
  return bettingSites.some(site => hostname.includes(site));
}

/**
 * Bloqueia sites de apostas inteiros
 */
function blockBettingSite() {
  if (!isBettingSite()) return;
  
  // Notificar background script
  notifyBackgroundScript('siteBlocked');
  
  // Redirecionar para a página de bloqueio
  window.location.href = chrome.runtime.getURL('blocked.html');
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Inicializa o monitoramento do YouTube
 * ✅ Proteção contra interval duplicado
 */
let youtubeInterval = null;
let youtubeObserver = null;

function initializeYouTube() {
  // Evitar inicialização duplicada
  if (youtubeInterval) {
    console.log('🛡️ Escudo Digital já está ativo no YouTube');
    return;
  }

  // Verificação inicial
  checkAndBlockYouTubeVideos();
  
  // Observar mudanças na página (para SPA do YouTube)
  if (!youtubeObserver) {
    youtubeObserver = new MutationObserver(() => {
      checkAndBlockYouTubeVideos();
    });
    
    youtubeObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Verificação periódica (para conteúdo dinâmico)
  youtubeInterval = setInterval(checkAndBlockYouTubeVideos, CONFIG.CHECK_INTERVAL_MS);
  
  console.log('🛡️ Escudo Digital ativo no YouTube!');
}

/**
 * Ponto de entrada principal
 */
function initialize() {
  console.log('🛡️ Escudo Digital iniciando...');
  
  if (window.location.hostname.includes('youtube.com')) {
    initializeYouTube();
  } else {
    blockBettingSite();
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Aguardar o DOM estar pronto antes de iniciar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM já está pronto
  initialize();
}
// content.js - VERSÃO FINAL (SEM FIRULAS)

const KEYWORDS = [
  'podcast', 'cortes', 'flow', 'podpah', 'inteligência', 
  'venus', 'lindomar', 'debate', 'react', 'reagindo'
];

// 🎯 FUNÇÃO DE VERIFICAÇÃO (RÁPIDA E DIRETA)
function shouldBlock(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return KEYWORDS.some(kw => lower.includes(kw));
}

// 🔥 MARCAR ELEMENTOS BLOQUEADOS
function markBlockedVideos() {
  const selectors = [
    'ytd-video-renderer',
    'ytd-grid-video-renderer', 
    'ytd-rich-item-renderer',
    'ytd-reel-item-renderer'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(`${selector}:not([data-checked])`).forEach(item => {
      item.dataset.checked = 'true';
      
      const title = item.querySelector('#video-title, h3, .title')?.textContent || '';
      const channel = item.querySelector('#channel-name, .ytd-channel-name')?.textContent || '';
      
      if (shouldBlock(title) || shouldBlock(channel)) {
        item.dataset.blocked = 'true';
        item.style.opacity = '0.3';
        item.style.pointerEvents = 'none';
        console.log('🛡️ Bloqueado:', { title, channel });
      }
    });
  });
}

// 🔥 KILLER DE EVENTOS (ANTES DO CLICK)
const KILL_EVENTS = (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  const renderer = link.closest(
    'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-reel-item-renderer'
  );

  if (renderer?.dataset.blocked === 'true') {
    console.warn('🛡️ BLOQUEIO REAL ATIVADO');
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  }
};

//  REGISTRAR NOS EVENTOS CERTOS
['pointerdown', 'mousedown', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, KILL_EVENTS, true);
});

//  OBSERVAR MUDANÇAS
const observer = new MutationObserver(() => markBlockedVideos());
observer.observe(document.body, { childList: true, subtree: true });

//  EXECUÇÃO INICIAL
markBlockedVideos();