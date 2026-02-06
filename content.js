/**
 * BetNet - Bloqueador de Conteúdo de Apostas no YouTube
 * Content Script para detectar e bloquear vídeos relacionados a apostas
 */

// Configurações
const CONFIG = {
  CHECK_INTERVAL_MS: 1000, // Verificar a cada 1 segundo
  KEYWORDS: [
    // Apostas gerais
    'bet', 'aposta', 'apostas', 'betting', 'casino', 'cassino',
    
    // Jogos específicos
    'blaze', 'fortune', 'tiger', 'slots', 'roleta', 'crash',
    'double', 'mines', 'aviator', 'spaceman', 'penalty',
    'tigrinho', 'jogo do tigre', 'jogo do foguete', 'joguinho',
    
    // Frases comuns
    'casa de apostas', 'bônus de apostas', 'ganhar dinheiro',
    'estratégia de aposta', 'como ganhar', 'dinheiro fácil',
    'renda extra', 'ganhos garantidos', 'método infalível',
    
    // Sites e plataformas
    'bet365', 'betano', 'sportingbet', 'pixbet', 'esporte da sorte',
    '1xbet', 'betfair', 'betway', 'betnacional', 'betmotion',
    'f12bet', 'novibet', 'parimatch', 'rivalo', 'estrela bet',
    
    // Variações e gírias
    'bets', 'aposto', 'apostador', 'green', 'red', 'odd',
    'stake', 'rollover', 'cashout', 'handicap', 'over', 'under',
    
    // Hashtags comuns
    '#bet', '#apostas', '#blaze', '#tiger', '#fortunetiger',
    '#aviator', '#crashgame', '#cassino', '#betting'
  ],
  BLOCKED_CHANNELS: [] // IDs de canais específicos (opcional)
};

// Estado
let blockedCount = 0;
let observer = null;

/**
 * Verifica se o texto contém palavras-chave de apostas
 */
function containsBetKeywords(text) {
  if (!text) return false;
  
  const normalizedText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  
  return CONFIG.KEYWORDS.some(keyword => {
    const normalizedKeyword = keyword.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return normalizedText.includes(normalizedKeyword);
  });
}

/**
 * Obtém o texto do elemento e seus filhos
 */
function getElementText(element) {
  const texts = [];
  
  // Título do vídeo (vários seletores para diferentes layouts)
  const titleSelectors = [
    '#video-title',
    'h3',
    '#title-link',
    'a#video-title-link',
    'yt-formatted-string.ytd-video-renderer',
    'span#video-title'
  ];
  
  titleSelectors.forEach(selector => {
    const title = element.querySelector(selector);
    if (title) texts.push(title.textContent || title.innerText || title.getAttribute('aria-label') || '');
  });
  
  // Nome do canal
  const channelSelectors = [
    '#channel-name',
    '.ytd-channel-name',
    '#text',
    'ytd-channel-name a',
    'yt-formatted-string.ytd-channel-name'
  ];
  
  channelSelectors.forEach(selector => {
    const channel = element.querySelector(selector);
    if (channel) texts.push(channel.textContent || channel.innerText || '');
  });
  
  // Descrição e snippet
  const descriptionSelectors = [
    '#description-text',
    'yt-formatted-string#description-text',
    '#snippet-text'
  ];
  
  descriptionSelectors.forEach(selector => {
    const desc = element.querySelector(selector);
    if (desc) texts.push(desc.textContent || desc.innerText || '');
  });
  
  // Hashtags e badges
  const badges = element.querySelectorAll('#hashtags a, .badge-style-type-live-now, .ytd-badge-supported-renderer');
  badges.forEach(badge => {
    texts.push(badge.textContent || badge.innerText || '');
  });
  
  // Meta info (views, data, etc) - às vezes contém info relevante
  const metaInfo = element.querySelector('#metadata-line, .ytd-video-meta-block');
  if (metaInfo) texts.push(metaInfo.textContent || metaInfo.innerText || '');
  
  return texts.join(' ');
}

/**
 * Cria overlay de bloqueio
 */
function createBlockOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'betnet-blocked-overlay';
  overlay.innerHTML = `
    <div class="betnet-blocked-content">
      <div class="betnet-shield-icon">🛡️</div>
      <h3>Conteúdo Bloqueado</h3>
      <p>Este vídeo contém conteúdo relacionado a apostas e foi bloqueado pelo BetNet.</p>
      <small>Protegendo você de conteúdo prejudicial</small>
    </div>
  `;
  
  return overlay;
}

/**
 * Bloqueia um elemento de vídeo
 */
function blockVideoElement(element) {
  // Verificações de duplicação
  if (element.classList.contains('betnet-blocked')) {
    return; // Já bloqueado
  }
  
  if (element.querySelector('.betnet-blocked-overlay')) {
    return; // Já tem overlay
  }
  
  // Marca como bloqueado ANTES de adicionar overlay (previne race condition)
  element.classList.add('betnet-blocked');
  element.setAttribute('data-betnet-blocked', 'true');
  
  // Garante que o elemento pai tenha position relative
  const computedStyle = getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }
  
  // Adiciona overlay que ocupa 100% do vídeo
  const overlay = createBlockOverlay();
  
  // Para Shorts, ajusta o estilo do overlay
  if (element.matches('ytd-reel-item-renderer')) {
    overlay.querySelector('.betnet-blocked-content').style.width = '95%';
    overlay.querySelector('.betnet-shield-icon').style.fontSize = '32px';
  }
  
  element.appendChild(overlay);
  
  // Bloqueia todos os links dentro do elemento
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    link.style.pointerEvents = 'none';
    link.style.cursor = 'not-allowed';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { capture: true, passive: false });
  });
  
  // Bloqueia cliques no elemento inteiro
  element.style.pointerEvents = 'none';
  element.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { capture: true, passive: false });
  
  blockedCount++;
  console.log(`🛡️ BetNet: Vídeo bloqueado #${blockedCount}`, element.tagName);
  
  // Notifica o background script
  try {
    chrome.runtime.sendMessage({ type: 'VIDEO_BLOCKED' });
  } catch (e) {
    // Ignora erro se não conseguir enviar mensagem
  }
}

/**
 * Verifica e bloqueia vídeos na página inicial e busca
 */
function checkAndBlockYouTubeVideos() {
  // Seletores para diferentes tipos de vídeos no YouTube
  const videoSelectors = [
    'ytd-video-renderer',           // Resultados de busca
    'ytd-grid-video-renderer',      // Grade da página inicial
    'ytd-rich-item-renderer',       // Página inicial (novo layout)
    'ytd-compact-video-renderer',   // Sidebar de vídeos relacionados
    'ytd-playlist-video-renderer',  // Vídeos em playlists
    'ytd-reel-item-renderer'        // YouTube Shorts
  ];
  
  videoSelectors.forEach(selector => {
    const videos = document.querySelectorAll(`${selector}:not([data-betnet-blocked])`);
    
    videos.forEach(video => {
      // Dupla verificação para evitar processamento duplicado
      if (video.classList.contains('betnet-blocked') || video.hasAttribute('data-betnet-blocked')) {
        return;
      }
      
      const text = getElementText(video);
      
      if (containsBetKeywords(text)) {
        blockVideoElement(video);
      }
    });
  });
}

/**
 * Bloqueia Shorts na página /shorts
 */
function checkAndBlockShorts() {
  // Seletor específico para Shorts na página dedicada
  const shortsSelectors = [
    'ytd-reel-video-renderer',
    'ytd-shorts',
    '#shorts-container ytd-reel-item-renderer'
  ];
  
  shortsSelectors.forEach(selector => {
    const shorts = document.querySelectorAll(`${selector}:not([data-betnet-blocked])`);
    
    shorts.forEach(short => {
      if (short.classList.contains('betnet-blocked')) {
        return;
      }
      
      const text = getElementText(short);
      
      if (containsBetKeywords(text)) {
        blockVideoElement(short);
      }
    });
  });
}

/**
 * Bloqueia vídeo principal (quando assistindo)
 */
function blockMainVideo() {
  const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer, h1.ytd-watch-metadata');
  const channelName = document.querySelector('ytd-channel-name #text, #owner-name');
  
  if (!videoTitle) return;
  
  const text = (videoTitle.textContent || '') + ' ' + (channelName?.textContent || '');
  
  if (containsBetKeywords(text)) {
    // Bloqueia o player de vídeo
    const player = document.querySelector('#movie_player, .html5-video-player');
    if (player && !player.classList.contains('betnet-blocked')) {
      player.classList.add('betnet-blocked');
      
      // Para e remove o vídeo
      const video = player.querySelector('video');
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
      
      // Cria overlay que cobre todo o player
      const overlay = createBlockOverlay();
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '9999';
      overlay.style.borderRadius = '0';
      
      player.style.position = 'relative';
      player.appendChild(overlay);
      
      // Bloqueia controles
      const controls = player.querySelectorAll('.ytp-chrome-controls, .ytp-gradient-top, .ytp-gradient-bottom');
      controls.forEach(control => {
        control.style.display = 'none';
      });
      
      console.log('🛡️ BetNet: Vídeo principal bloqueado e pausado!');
      
      // Notifica o background script
      try {
        chrome.runtime.sendMessage({ type: 'VIDEO_BLOCKED' });
      } catch (e) {
        // Ignora erro
      }
    }
  }
}

/**
 * Injeta CSS para os overlays
 */
function injectStyles() {
  if (document.getElementById('betnet-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'betnet-styles';
  style.textContent = `
    /* Overlay ocupa 100% do container do vídeo */
    .betnet-blocked-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1000 !important;
      border-radius: 12px;
      pointer-events: all !important;
      cursor: not-allowed !important;
    }
    
    /* Card centralizado proporcional (80% do overlay) */
    .betnet-blocked-content {
      text-align: center;
      color: white;
      padding: 16px;
      width: 85%;
      max-width: 300px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .betnet-shield-icon {
      font-size: 40px;
      margin-bottom: 8px;
      animation: pulse 2s infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .betnet-blocked-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .betnet-blocked-content p {
      margin: 0 0 4px 0;
      font-size: 11px;
      opacity: 0.95;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .betnet-blocked-content small {
      font-size: 9px;
      opacity: 0.85;
      margin-top: 4px;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    /* Remove interação do vídeo bloqueado */
    .betnet-blocked {
      pointer-events: none !important;
    }
    
    .betnet-blocked a {
      pointer-events: none !important;
      cursor: not-allowed !important;
    }
    
    /* Para thumbnails menores (sidebar, shorts) */
    ytd-compact-video-renderer .betnet-blocked-content,
    ytd-reel-item-renderer .betnet-blocked-content {
      padding: 8px;
      width: 90%;
    }
    
    ytd-compact-video-renderer .betnet-shield-icon,
    ytd-reel-item-renderer .betnet-shield-icon {
      font-size: 28px;
      margin-bottom: 4px;
    }
    
    ytd-compact-video-renderer .betnet-blocked-content h3,
    ytd-reel-item-renderer .betnet-blocked-content h3 {
      font-size: 11px;
      margin-bottom: 4px;
    }
    
    ytd-compact-video-renderer .betnet-blocked-content p,
    ytd-reel-item-renderer .betnet-blocked-content p {
      font-size: 9px;
    }
    
    ytd-compact-video-renderer .betnet-blocked-content small,
    ytd-reel-item-renderer .betnet-blocked-content small {
      font-size: 7px;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Inicializa o bloqueador no YouTube
 */
function initializeYouTube() {
  console.log('🛡️ BetNet: Escudo Digital ativo no YouTube!');
  
  // Injeta estilos
  injectStyles();
  
  // Verificação inicial
  checkAndBlockYouTubeVideos();
  checkAndBlockShorts();
  blockMainVideo();
  
  // Observar mudanças na página (navegação SPA do YouTube)
  observer = new MutationObserver(() => {
    checkAndBlockYouTubeVideos();
    checkAndBlockShorts();
    blockMainVideo();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Verificação periódica (para conteúdo dinâmico)
  setInterval(() => {
    checkAndBlockYouTubeVideos();
    checkAndBlockShorts();
    blockMainVideo();
  }, CONFIG.CHECK_INTERVAL_MS);
  
  // Log de estatísticas a cada minuto
  setInterval(() => {
    if (blockedCount > 0) {
      console.log(`📊 BetNet Stats: ${blockedCount} vídeos bloqueados nesta sessão`);
    }
  }, 60000);
}

/**
 * Bloqueia site inteiro (para sites de apostas)
 */
function blockBettingSite() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    ">
      <div style="text-align: center; color: white; max-width: 500px; padding: 40px;">
        <div style="font-size: 80px; margin-bottom: 24px;">🛡️</div>
        <h1 style="font-size: 32px; margin-bottom: 16px;">Site Bloqueado</h1>
        <p style="font-size: 18px; margin-bottom: 24px; opacity: 0.95;">
          Este site foi bloqueado pelo BetNet para sua proteção.
        </p>
        <p style="font-size: 14px; opacity: 0.8;">
          Sites de apostas podem causar dependência e prejuízos financeiros.
        </p>
      </div>
    </div>
  `;
  
  console.log('🛡️ BetNet: Site de apostas bloqueado!');
}

/**
 * Ponto de entrada principal
 */
function initialize() {
  const hostname = window.location.hostname;
  
  if (hostname.includes('youtube.com')) {
    initializeYouTube();
  } else {
    // Para outros sites, você pode adicionar lógica de bloqueio total
    // Exemplo: verificar se é um site de apostas conhecido
    const bettingSites = [
      'bet365', 'betano', 'sportingbet', 'pixbet', 
      'blaze', 'esportesdasorte', '1xbet'
    ];
    
    if (bettingSites.some(site => hostname.includes(site))) {
      blockBettingSite();
    }
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}