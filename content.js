// Lista de palavras proibidas relacionadas a apostas
const palavrasProibidas = [
  // Sites específicos
  'bet365', 'betano', 'betway', 'sportingbet', '1xbet', 'pixbet',
  'stake', 'rivalry', 'betfair', 'parimatch', 'f12bet',
  'blaze', 'esporte da sorte', 'mrjack', 'betmotion',
  
  // Jogos de cassino
  'aviator', 'fortune tiger', 'tigre da fortuna', 'tigrinho',
  'mines', 'spaceman', 'crash', 'double', 'roleta',
  'penalty', 'football studio', 'crazy time',
  
  // Termos de aposta
  'bet', 'aposta', 'apostas', 'bônus', 'bonus',
  'casa de aposta', 'odd', 'cotação', 'palpite',
  'ganhe dinheiro', 'renda extra', 'estratégia bet',
  
  // Termos de cassino
  'cassino', 'casino', 'slot', 'jackpot', 'caça-níquel',
  'jogo do bicho', 'galinha', 'coelho', 'touro'
];

// Sites que devem ser completamente bloqueados
const sitesProibidos = [
  'bet365.com', 'betano.com', 'betway.com', 'sportingbet.com',
  '1xbet.com', 'pixbet.com', 'stake.com', 'blaze.com',
  'betfair.com', 'rivalry.com', 'f12bet.com', 'parimatch.com',
  'esportesdasorte.com', 'mrjack.bet', 'betmotion.com',
  'pinnacle.com', 'bodog.com', 'betnacional.com'
];

// Verifica se o site atual está na lista de bloqueio
function verificarSiteProibido() {
  const hostAtual = window.location.hostname.toLowerCase();
  
  for (const site of sitesProibidos) {
    if (hostAtual.includes(site)) {
      bloquearSiteCompletamente();
      return true;
    }
  }
  return false;
}

// Bloqueia o site completamente
function bloquearSiteCompletamente() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      ">
        <h1 style="font-size: 3em; margin: 0 0 20px 0;">🚫 BetNet</h1>
        <h2 style="font-size: 1.5em; margin: 0 0 20px 0;">Site Bloqueado</h2>
        <p style="font-size: 1.2em; max-width: 500px; line-height: 1.6;">
          Este site de apostas foi bloqueado para sua proteção.
        </p>
        <p style="font-size: 1em; opacity: 0.8; margin-top: 30px;">
          Se você está lutando contra o vício em jogos de azar, procure ajuda profissional.
        </p>
        <div style="margin-top: 30px;">
          <a href="https://www.google.com" style="
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
          ">Ir para página segura</a>
        </div>
      </div>
    </div>
  `;
  
  window.stop();
}

// Verifica se o texto contém palavras proibidas
function contemConteudoProibido(texto) {
  if (!texto) return false;
  
  const textoLower = texto.toLowerCase().trim();
  
  // Lista de palavras que sozinhas já são suficientes
  const palavrasFortes = [
    'bet365', 'betano', 'blaze', '1xbet', 'pixbet',
    'aviator', 'fortune tiger', 'tigrinho', 'tigre da fortuna',
    'esporte da sorte', 'mrjack', 'betmotion', 'stake',
    'mines', 'spaceman', 'crash', 'double', 'roleta'
  ];
  
  // Verifica palavras fortes
  for (const palavra of palavrasFortes) {
    if (textoLower.includes(palavra)) {
      return true;
    }
  }
  
  // Palavras que precisam estar no contexto de apostas
  const palavrasContexto = ['bet', 'aposta', 'apostas', 'cassino', 'casino'];
  
  for (const palavra of palavrasContexto) {
    if (textoLower.includes(palavra)) {
      // Se tem "bet" ou "aposta" E qualquer outra palavra relacionada
      const temContexto = 
        textoLower.includes('ganhar') ||
        textoLower.includes('dinheiro') ||
        textoLower.includes('estratégia') ||
        textoLower.includes('bônus') ||
        textoLower.includes('bonus') ||
        textoLower.includes('jackpot') ||
        textoLower.includes('odd') ||
        textoLower.includes('palpite') ||
        textoLower.includes('jogo') ||
        textoLower.includes('slot');
      
      if (temContexto) return true;
      
      // OU se "bet" está repetido/junto com números (bet365, etc)
      if (palavra === 'bet' && (
        textoLower.match(/bet\s*\d/) || 
        textoLower.includes('betano') ||
        textoLower.split('bet').length > 2
      )) {
        return true;
      }
      
      // Bloqueia se "aposta" ou "apostas" aparecer sozinho
      if ((palavra === 'aposta' || palavra === 'apostas') && 
          textoLower.includes(palavra)) {
        return true;
      }
    }
  }
  
  return false;
}

// Cria overlay de bloqueio REAL (100% opaco)
function criarOverlayBloqueio() {
  const overlay = document.createElement('div');
  overlay.className = 'betnet-bloqueio-overlay';
  
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
    border-radius: 12px !important;
    cursor: not-allowed !important;
    opacity: 1 !important;
    overflow: hidden !important;
  `;
  
  overlay.innerHTML = `
    <div style="
      text-align: center;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      padding: 20px;
    ">
      <div style="
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        background: #dc2626;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      
      <div style="
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #ffffff;
      ">
        🚫 Conteúdo Bloqueado
      </div>
      
      <div style="
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
        max-width: 280px;
        line-height: 1.5;
        margin: 0 auto;
      ">
        Este vídeo foi identificado como inadequado
      </div>
      
      <div style="
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 12px;
      ">
        Motivo: Promoção de jogos de azar
      </div>
    </div>
  `;
  
  // Previne qualquer interação
  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  
  return overlay;
}

// Bloqueia vídeo no YouTube
function bloquearVideoYouTube(videoElement) {
  if (videoElement.dataset.betnetBloqueado) return;
  
  // Marca como bloqueado
  videoElement.dataset.betnetBloqueado = 'true';
  
  // Para e esconde qualquer elemento de vídeo dentro
  const videos = videoElement.querySelectorAll('video');
  videos.forEach(v => {
    v.pause();
    v.src = '';
    v.load();
    v.style.display = 'none';
  });
  
  // Encontra o container do thumbnail (onde fica a imagem)
  const thumbnailContainer = videoElement.querySelector('ytd-thumbnail, #thumbnail, a#thumbnail');
  
  if (thumbnailContainer) {
    // Garante posicionamento relativo no container do thumbnail
    const computedStyle = window.getComputedStyle(thumbnailContainer);
    if (computedStyle.position === 'static') {
      thumbnailContainer.style.position = 'relative';
    }
    
    // Remove overlays antigos
    const overlaysAntigos = thumbnailContainer.querySelectorAll('.betnet-bloqueio-overlay');
    overlaysAntigos.forEach(o => o.remove());
    
    // Adiciona overlay APENAS no thumbnail
    const overlay = criarOverlayBloqueio();
    thumbnailContainer.appendChild(overlay);
    
    // Esconde a imagem original
    const imgs = thumbnailContainer.querySelectorAll('img');
    imgs.forEach(img => {
      img.style.opacity = '0';
      img.style.visibility = 'hidden';
    });
  } else {
    // Fallback: se não encontrar thumbnail, bloqueia o elemento inteiro
    const computedStyle = window.getComputedStyle(videoElement);
    if (computedStyle.position === 'static') {
      videoElement.style.position = 'relative';
    }
    
    const overlay = criarOverlayBloqueio();
    videoElement.appendChild(overlay);
  }
  
  // Remove TODOS os links
  const links = videoElement.querySelectorAll('a');
  links.forEach(link => {
    link.style.pointerEvents = 'none';
    link.onclick = (e) => { e.preventDefault(); return false; };
    link.removeAttribute('href');
  });
  
  console.log('🛡️ BetNet: Vídeo bloqueado -', videoElement);
}

// Processa vídeos do YouTube
function processarVideosYouTube() {
  const seletores = [
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-playlist-video-renderer',
    'ytd-rich-item-renderer',
    'ytd-reel-item-renderer',
    'ytd-movie-renderer',
    'ytd-radio-renderer',
    'ytd-playlist-renderer',
    'ytd-channel-renderer',
    'ytd-video-preview'
  ];
  
  seletores.forEach(seletor => {
    const videos = document.querySelectorAll(seletor);
    
    videos.forEach(video => {
      if (video.dataset.betnetBloqueado) return;
      
      // Coleta informações do vídeo de múltiplas fontes
      const tituloElement = video.querySelector('#video-title, #video-title-link, h3, .title, yt-formatted-string[id="video-title"]');
      const titulo = tituloElement?.textContent?.trim() || tituloElement?.getAttribute('aria-label') || '';
      
      const descElement = video.querySelector('#description-text, .description, #description');
      const descricao = descElement?.textContent?.trim() || '';
      
      const canalElement = video.querySelector('#channel-name, .ytd-channel-name, #text, ytd-channel-name a');
      const canal = canalElement?.textContent?.trim() || '';
      
      // Pega também do aria-label se disponível
      const ariaLabel = video.getAttribute('aria-label') || '';
      
      const textoCompleto = `${titulo} ${descricao} ${canal} ${ariaLabel}`;
      
      // Debug para ver o que está sendo analisado
      if (textoCompleto.toLowerCase().includes('bet')) {
        console.log('🔍 BetNet analisando:', textoCompleto.substring(0, 100));
      }
      
      // Verifica e bloqueia se necessário
      if (contemConteudoProibido(textoCompleto)) {
        console.log('🚫 BetNet bloqueando:', titulo);
        bloquearVideoYouTube(video);
      }
    });
  });
}

// Processa Shorts do YouTube
function processarShortsYouTube() {
  const shorts = document.querySelectorAll('ytd-reel-item-renderer, ytd-shorts');
  
  shorts.forEach(short => {
    if (short.dataset.betnetBloqueado) return;
    
    const titulo = short.querySelector('#video-title')?.textContent?.trim() || '';
    
    if (contemConteudoProibido(titulo)) {
      bloquearVideoYouTube(short);
    }
  });
}

// Processa elementos em sites gerais
function processarElementosGerais() {
  const elementos = document.querySelectorAll('article, .ad, .advertisement, [class*="sponsor"], [class*="promo"]');
  
  elementos.forEach(el => {
    if (el.dataset.betnetBloqueado) return;
    
    const texto = el.textContent?.trim() || '';
    
    if (contemConteudoProibido(texto)) {
      el.dataset.betnetBloqueado = 'true';
      
      // Para vídeos dentro do elemento
      const videos = el.querySelectorAll('video');
      videos.forEach(v => {
        v.pause();
        v.src = '';
        v.load();
        v.style.display = 'none';
      });
      
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'static') {
        el.style.position = 'relative';
      }
      
      const overlay = criarOverlayBloqueio();
      el.appendChild(overlay);
    }
  });
}

// Remove vídeos player e garante que estão pausados
function removerVideosPlayer() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    const container = video.closest('[data-betnet-bloqueado="true"]');
    if (container) {
      video.pause();
      video.src = '';
      video.load();
      video.remove();
    }
  });
}

// Processa todos os elementos
function processar() {
  if (window.location.hostname.includes('youtube.com')) {
    processarVideosYouTube();
    processarShortsYouTube();
  } else {
    processarElementosGerais();
  }
  removerVideosPlayer();
}

// MutationObserver
const observer = new MutationObserver(() => {
  processar();
});

// Inicialização
function inicializar() {
  console.log('🛡️ BetNet: Proteção ativada');
  
  // Bloqueia site se estiver na lista
  if (verificarSiteProibido()) {
    return;
  }
  
  // Adiciona CSS global
  const style = document.createElement('style');
  style.textContent = `
    .betnet-bloqueio-overlay {
      animation: betnet-fadein 0.3s ease-out !important;
    }
    
    @keyframes betnet-fadein {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    [data-betnet-bloqueado="true"] {
      pointer-events: none !important;
      user-select: none !important;
    }
    
    [data-betnet-bloqueado="true"] * {
      pointer-events: none !important;
    }
    
    [data-betnet-bloqueado="true"] video {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  
  // Processamento inicial com delays
  setTimeout(processar, 500);
  setTimeout(processar, 1500);
  setTimeout(processar, 3000);
  
  // Observa mudanças no DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Verificação periódica
  setInterval(processar, 3000);
  
  // Processa ao rolar
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(processar, 300);
  });
}

// Aguarda carregamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}