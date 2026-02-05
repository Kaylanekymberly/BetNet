// ========================================
// ESCUDO DIGITAL - Content Script
// Bloqueio de sites de apostas e vídeos relacionados
// ========================================

// ========================================
// CONSTANTES DE CONFIGURAÇÃO
// ========================================

const CONFIG = {
  // Estilos do bloqueio
  CARD: {
    SIZE: '200px', // Um único valor para garantir quadrado perfeito
    BG_COLOR: 'linear-gradient(135deg, #1e1b2e 0%, #2a2440 100%)',
    BORDER_COLOR: '#8b5cf6',
    BORDER_WIDTH: '3px',
    BORDER_RADIUS: '20px',
    SHADOW: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)'
  },
  
  // Estilos do backdrop
  BACKDROP: {
    BG_COLOR: 'rgba(0, 0, 0, 0.95)',
    BLUR: '8px',
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
 * Sem padding externo - tudo centralizado via flex
 * @returns {string} - HTML do conteúdo
 */
function createBlockMessageHTML() {
  return `
    <div style="text-align: center;">
      <!-- Shield Icon -->
      <svg width="50" height="50" viewBox="0 0 24 24" style="margin-bottom: 10px; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6));">
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path fill="url(#shieldGradient)" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
      </svg>
      
      <div style="font-size: 18px; font-weight: 600; color: #a855f7; margin-bottom: 5px;">
        Bloqueado
      </div>
      
      <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7); margin-bottom: 10px;">
        Conteúdo de apostas
      </div>
      
      <div style="font-size: 9px; padding: 4px 8px; background: rgba(168, 85, 247, 0.2); 
                  border-radius: 4px; color: rgba(255, 255, 255, 0.6); display: inline-block;">
        Escudo Digital
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
    background: rgba(0, 0, 0, 0.95) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999998 !important;
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
 * TAMANHO FIXO 200x200px com travas para não encolher
 * @returns {HTMLElement} - Elemento overlay
 */
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'escudo-digital-block';
  overlay.style.cssText = `
    width: 200px !important;
    height: 200px !important;
    min-width: 200px !important;
    min-height: 200px !important;
    background: #1a1a2e !important;
    border: 3px solid #a855f7 !important;
    border-radius: 20px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.6) !important;
    z-index: 999999 !important;
  `;
  
  overlay.innerHTML = createBlockMessageHTML();
  
  return overlay;
}

/**
 * Remove e bloqueia interações com links no elemento
 * @param {HTMLElement} element - Elemento pai
 */
function disableElementInteractions(element) {
  // Bloquear todos os links
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    link.removeAttribute('href');
    link.style.pointerEvents = 'none';
    link.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  });
  
  // Bloquear cliques no elemento
  element.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  element.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
}

// ========================================
// FUNÇÃO PRINCIPAL DE BLOQUEIO
// ========================================

/**
 * Bloqueia um elemento de vídeo com overlay
 * 
 * ESTRUTURA DE DUAS CAMADAS:
 * 1. BACKDROP (100% do vídeo) - Apenas fundo escuro, SEM borda
 * 2. CARD (220x220px fixo) - Com borda roxa, centralizado dentro do backdrop
 * 
 * Por que essa estrutura?
 * - O backdrop usa display:flex para centralizar o card
 * - O card tem dimensões FIXAS para não esticar
 * - A borda fica PRESA ao card de 220px, não corre para os lados
 * 
 * @param {HTMLElement} element - Elemento a ser bloqueado
 */
function blockElement(element) {
  // Validações
  if (!isValidElement(element)) return;
  if (element.dataset.blocked) return; // Já bloqueado
  
  // Marcar como bloqueado
  element.dataset.blocked = 'true';
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  
  // CAMADA 1: Backdrop (fundo escuro 100% - sem borda)
  const backdrop = createBackdrop();
  
  // CAMADA 2: Card quadrado (220x220px - COM borda roxa)
  const overlay = createOverlay();
  
  // MONTAGEM: Card vai DENTRO do backdrop
  // O backdrop centraliza automaticamente via flex
  backdrop.appendChild(overlay);
  element.appendChild(backdrop);
  
  // Desabilitar interações
  element.style.pointerEvents = 'none';
  backdrop.style.pointerEvents = 'auto';
  disableElementInteractions(element);
  
  // Notificar background script
  notifyBackgroundScript('videoBlocked');
  
  console.log('Escudo Digital: Elemento bloqueado');
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
 */
function checkShorts() {
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
    .shorts-player
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
      blockElement(player);
      
      // Pausar o vídeo
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        video.style.display = 'none';
      }
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
 */
function initializeYouTube() {
  // Verificação inicial
  checkAndBlockYouTubeVideos();
  
  // Observar mudanças na página
  const observer = new MutationObserver(() => {
    checkAndBlockYouTubeVideos();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Verificação periódica (para conteúdo dinâmico)
  setInterval(checkAndBlockYouTubeVideos, CONFIG.CHECK_INTERVAL_MS);
  
  console.log('Escudo Digital ativo no YouTube! 🛡️');
}

/**
 * Ponto de entrada principal
 */
function initialize() {
  if (window.location.hostname.includes('youtube.com')) {
    initializeYouTube();
  } else {
    blockBettingSite();
  }
}

// Iniciar a extensão
initialize();