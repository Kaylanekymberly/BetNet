// ========================================
// ESCUDO DIGITAL - Content Script
// Bloqueio de sites de apostas e vídeos relacionados
// ========================================

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

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Verifica se o texto contém palavras-chave de apostas
 * @param {string} text - Texto a ser verificado
 * @returns {boolean} - True se contém palavras de apostas
 */
function containsBettingKeywords(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  
  // PRIMEIRO: Verificar se está na whitelist (conteúdo legítimo)
  const isWhitelisted = whitelistKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Se estiver na whitelist, NÃO bloquear
  if (isWhitelisted) return false;
  
  // DEPOIS: Verificar se contém palavras de apostas
  return bettingKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Bloqueia um elemento de vídeo com overlay
 * @param {HTMLElement} element - Elemento a ser bloqueado
 */
function blockElement(element) {
  if (element.dataset.blocked) return; // Já foi bloqueado
  
  element.dataset.blocked = 'true';
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  // Força o elemento e o contêiner do YouTube a perderem o arredondamento
  element.style.borderRadius = '0px !important';
  const thumb = element.querySelector('#thumbnail, ytd-thumbnail');
  if (thumb) {
    thumb.style.setProperty('border-radius', '0px', 'important');
  }
  // Criar overlay de bloqueio
  const overlay = document.createElement('div');
  overlay.className = 'escudo-digital-block';
  overlay.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: #000000 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
    border-radius: 0px !important;
    cursor: not-allowed !important;
    opacity: 1 !important;
    overflow: hidden !important;
    color: white !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Conteúdo do overlay
  overlay.innerHTML = `
    <div style="text-align: center; padding: 20px; max-width: 90%;">
      <div style="font-size: 48px; margin-bottom: 15px; line-height: 1;">🚫</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; line-height: 1.3; color: white;">Conteúdo Bloqueado</div>
      <div style="font-size: 14px; opacity: 0.9; line-height: 1.4; margin-bottom: 10px; color: white;">Este vídeo contém conteúdo relacionado a apostas</div>
      <div style="font-size: 12px; opacity: 0.7; line-height: 1.2; color: white;">Bloqueado por: Escudo Digital</div>
    </div>
  `;
  
  // Desabilitar interações
  element.style.pointerEvents = 'none';
  element.appendChild(overlay);
  
  // Notificar background script (se disponível)
  try {
    chrome.runtime.sendMessage({ type: 'videoBlocked' });
  } catch (e) {
    // Ignorar erro se background não estiver disponível
    console.log('Escudo Digital: Vídeo bloqueado');
  }
}

// ========================================
// BLOQUEIO DE VÍDEOS DO YOUTUBE
// ========================================

/**
 * Verifica e bloqueia vídeos do YouTube com conteúdo de apostas
 */
function checkAndBlockYouTubeVideos() {
  // Vídeos na página principal e resultados de busca
  const videoRenderers = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer');
  
  videoRenderers.forEach(renderer => {
    if (renderer.dataset.checked) return;
    renderer.dataset.checked = 'true';
    
    // Pegar título do vídeo
    const titleElement = renderer.querySelector('#video-title, .ytd-video-meta-block #video-title');
    const title = titleElement?.textContent || titleElement?.getAttribute('aria-label') || titleElement?.title || '';
    
    // Pegar descrição
    const descElement = renderer.querySelector('#description-text, .description-text, #metadata-line');
    const description = descElement?.textContent || '';
    
    // Pegar nome do canal
    const channelElement = renderer.querySelector('#channel-name, .ytd-channel-name a, #text.ytd-channel-name');
    const channelName = channelElement?.textContent || '';
    
    // Pegar badges e metadados extras
    const metadataElements = renderer.querySelectorAll('.badge-style-type-simple, .badge, #metadata');
    let metadata = '';
    metadataElements.forEach(el => metadata += el.textContent + ' ');
    
    // Combinar tudo
    const fullText = `${title} ${description} ${channelName} ${metadata}`;
    
    if (containsBettingKeywords(fullText)) {
      blockElement(renderer);
    }
  });
  
  // Shorts (vídeos curtos)
  const shorts = document.querySelectorAll('ytd-reel-item-renderer, ytd-rich-section-renderer, ytd-shorts, ytd-reel-video-renderer');
  
  shorts.forEach(short => {
    if (short.dataset.checked) return;
    short.dataset.checked = 'true';
    
    const titleElement = short.querySelector('#video-title, .reel-video-title, h3, .title');
    const title = titleElement?.textContent || titleElement?.getAttribute('aria-label') || '';
    
    const overlay = short.querySelector('#overlay-text, .overlay-text');
    const overlayText = overlay?.textContent || '';
    
    const fullText = `${title} ${overlayText}`;
    
    if (containsBettingKeywords(fullText)) {
      blockElement(short);
    }
  });
  
  // Vídeo sendo assistido (player)
  const videoTitle = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title, #title h1');
  const videoDescription = document.querySelector('#description-inline-expander, #description, ytd-text-inline-expander');
  const channelName = document.querySelector('#channel-name #text, ytd-channel-name #text');
  
  if (videoTitle) {
    const title = videoTitle.textContent || '';
    const description = videoDescription?.textContent || '';
    const channel = channelName?.textContent || '';
    const fullText = `${title} ${description} ${channel}`;
    
    if (containsBettingKeywords(fullText)) {
      // Bloquear o vídeo atual
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
}

// ========================================
// BLOQUEIO DE SITES DE APOSTAS
// ========================================

/**
 * Bloqueia sites de apostas inteiros
 */
function blockBettingSite() {
  const hostname = window.location.hostname.toLowerCase();
  const bettingSites = [
    'bet365', 'betano', 'sportingbet', 'betfair', '1xbet',
    'bwin', 'rivalo', 'pixbet', 'esportedasorte', 'blaze',
    'betway', 'pokerstars', '888sport', 'novibet', 'parimatch',
    'stake', 'bc.game', 'f12bet', 'luva.bet', 'estrela.bet',
    'superbet', 'betmotion', 'betsson'
  ];
  
  const isBettingSite = bettingSites.some(site => hostname.includes(site));
  
  if (isBettingSite) {
    // Notificar background script (se disponível)
    try {
      chrome.runtime.sendMessage({ type: 'siteBlocked' });
    } catch (e) {
      console.log('Escudo Digital: Site bloqueado');
    }
    
    // Redirecionar para a página de bloqueio
    window.location.href = chrome.runtime.getURL('blocked.html');
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Executar verificação inicial
if (window.location.hostname.includes('youtube.com')) {
  // Para YouTube
  checkAndBlockYouTubeVideos();
  
  // Observar mudanças na página (quando carrega mais vídeos)
  const observer = new MutationObserver(() => {
    checkAndBlockYouTubeVideos();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Verificar periodicamente (para Shorts que carregam dinamicamente)
  setInterval(checkAndBlockYouTubeVideos, 2000);
  
  console.log('Escudo Digital ativo no YouTube! 🛡️');
  
} else {
  // Para outros sites
  blockBettingSite();
}
overlay.style.cssText = `
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; /* Centraliza o quadrado no meio do vídeo */
    
    /* A MÁGICA PARA SER QUADRADO: */
    height: 100% !important;
    aspect-ratio: 1 / 1 !important; /* Força largura igual à altura */
    
    background: #000000 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
    border-radius: 0px !important;
    cursor: not-allowed !important;
    color: white !important;
    font-family: sans-serif !important;
  `;