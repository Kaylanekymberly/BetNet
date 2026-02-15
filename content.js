// ========================================
// ESCUDO DIGITAL - DEBUG EXTREMO
// ========================================

console.log('🔥🔥🔥 ESCUDO DIGITAL CARREGADO 🔥🔥🔥');
console.log('🔥 URL:', window.location.href);
console.log('🔥 Hostname:', window.location.hostname);

// ========================================
// PALAVRAS-CHAVE (SIMPLIFICADO PARA TESTE)
// ========================================

const bettingKeywords = [
  'aposta', 'apostas', 'bet', 'bets',
  'tiger', 'tigre', 'tigrinho',
  'fortune', 'blaze', 'cassino',
  'aviator', 'crash', 'mines'
];

const whitelistKeywords = [
  'bet awards', 'alphabet', 'beta'
];

// ========================================
// DETECÇÃO
// ========================================

function containsBettingKeywords(text) {
  if (!text || typeof text !== 'string') {
    console.log('⚠️ Texto inválido:', text);
    return false;
  }
  
  const lowerText = text.toLowerCase();
  
  // Whitelist
  const isWhitelisted = whitelistKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  if (isWhitelisted) {
    console.log('✅ WHITELISTED:', text.substring(0, 50));
    return false;
  }
  
  // Verificar apostas
  const found = bettingKeywords.find(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  if (found) {
    console.log('🎯 DETECTADO palavra:', found, '| texto:', text.substring(0, 60));
    return true;
  }
  
  return false;
}

function extractVideoText(renderer) {
  console.log('📝 Extraindo texto de:', renderer.tagName);
  
  const texts = [];
  
  // Tentar extrair título de TODAS as formas possíveis
  const title1 = renderer.querySelector('#video-title');
  const title2 = renderer.querySelector('yt-formatted-string#video-title');
  const title3 = renderer.querySelector('h3');
  const title4 = renderer.querySelector('.title');
  
  console.log('  - #video-title:', title1?.textContent?.substring(0, 40));
  console.log('  - yt-formatted-string:', title2?.textContent?.substring(0, 40));
  console.log('  - h3:', title3?.textContent?.substring(0, 40));
  console.log('  - .title:', title4?.textContent?.substring(0, 40));
  
  [title1, title2, title3, title4].forEach(el => {
    if (el) {
      const text = el.textContent || el.getAttribute('aria-label') || el.title || '';
      if (text.trim()) texts.push(text);
    }
  });
  
  // Canal
  const channel = renderer.querySelector('#channel-name, ytd-channel-name, .channel-name');
  if (channel) {
    console.log('  - Canal:', channel.textContent?.substring(0, 40));
    texts.push(channel.textContent || '');
  }
  
  const fullText = texts.join(' ');
  console.log('  ➡️ Texto completo:', fullText.substring(0, 100));
  
  return fullText;
}

// ========================================
// BLOQUEIO
// ========================================

let blockedCount = 0;

function nukeElement(item) {
  const title = item.querySelector('#video-title, h3, .title')?.textContent?.trim()?.substring(0, 60) || 'Sem título';
  
  console.warn('💀💀💀 DESTRUINDO AGORA:', title);
  console.log('💀 Elemento:', item);
  console.log('💀 Parent:', item.parentElement);
  
  try {
    item.remove();
    blockedCount++;
    console.log('✅ REMOVIDO! Total bloqueado:', blockedCount);
  } catch (e) {
    console.error('❌ ERRO AO REMOVER:', e);
  }
}

// ========================================
// SCAN
// ========================================

function scanAndDestroy() {
  console.log('🔍 ============ INICIANDO SCAN ============');
  
  // Listar TODOS os elementos de vídeo que existem
  const allVideos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer');
  console.log('📊 Total de vídeos encontrados na página:', allVideos.length);
  
  if (allVideos.length === 0) {
    console.warn('⚠️ NENHUM VÍDEO ENCONTRADO! Possíveis causas:');
    console.log('   1. Página ainda carregando');
    console.log('   2. YouTube mudou os seletores');
    console.log('   3. Você não está em uma página de vídeos');
    
    // Mostrar o que TEM na página
    console.log('🔍 Elementos ytd- na página:');
    document.querySelectorAll('[class*="ytd-"]').forEach(el => {
      console.log('   -', el.tagName, el.className);
    });
  }
  
  allVideos.forEach((renderer, index) => {
    console.log(`\n📹 Vídeo ${index + 1}/${allVideos.length}`);
    console.log('   Tipo:', renderer.tagName);
    console.log('   Já processado?', renderer.dataset.scanned);
    
    if (renderer.dataset.scanned) {
      console.log('   ⏭️ Pulando (já foi verificado)');
      return;
    }
    
    renderer.dataset.scanned = 'true';
    
    const text = extractVideoText(renderer);
    
    if (!text || text.trim().length === 0) {
      console.warn('   ⚠️ Texto vazio! Não há como verificar');
      return;
    }
    
    const shouldBlock = containsBettingKeywords(text);
    console.log('   🎲 Deve bloquear?', shouldBlock);
    
    if (shouldBlock) {
      nukeElement(renderer);
    } else {
      console.log('   ✅ Vídeo legítimo - mantido');
    }
  });
  
  console.log('🔍 ============ SCAN COMPLETO ============\n');
}

function checkCurrentVideo() {
  console.log('🎬 Verificando vídeo atual (player)...');
  
  const videoTitle = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title, #title h1');
  
  if (!videoTitle) {
    console.log('   ⚠️ Não encontrou título do vídeo (não está em /watch?)');
    return;
  }
  
  const title = videoTitle.textContent || '';
  console.log('   📺 Título do vídeo:', title.substring(0, 80));
  
  if (containsBettingKeywords(title)) {
    console.warn('   💀 VÍDEO ATUAL É DE APOSTAS - BLOQUEANDO PLAYER');
    
    const player = document.querySelector('#movie_player, .html5-video-player');
    
    if (player && !player.dataset.nuked) {
      player.dataset.nuked = 'true';
      
      const video = player.querySelector('video');
      if (video) {
        video.pause();
        video.src = '';
      }
      
      player.style.position = 'relative';
      const blocker = document.createElement('div');
      blocker.style.cssText = `
        position: absolute;
        inset: 0;
        background: black;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-family: system-ui;
      `;
      blocker.textContent = '🛡️ BLOQUEADO - Conteúdo de Apostas';
      player.appendChild(blocker);
      
      console.log('   ✅ Player bloqueado!');
    }
  } else {
    console.log('   ✅ Vídeo atual é legítimo');
  }
}

// ========================================
// INIT
// ========================================

function init() {
  console.log('\n🚀🚀🚀 INICIANDO ESCUDO DIGITAL 🚀🚀🚀');
  console.log('🚀 readyState:', document.readyState);
  console.log('🚀 body existe?', !!document.body);
  
  if (!window.location.hostname.includes('youtube.com')) {
    console.log('❌ Não é YouTube - encerrando');
    return;
  }
  
  console.log('✅ É YouTube - continuando...');
  
  // Aguardar body carregar
  if (!document.body) {
    console.log('⏳ Body ainda não existe, aguardando...');
    setTimeout(init, 100);
    return;
  }
  
  console.log('✅ Body carregado - iniciando scan');
  
  // Scan inicial
  setTimeout(() => {
    console.log('\n⏰ SCAN INICIAL (1s após carregar)');
    scanAndDestroy();
    checkCurrentVideo();
  }, 1000);
  
  // Scan a cada 3 segundos
  setInterval(() => {
    console.log('\n⏰ SCAN PERIÓDICO');
    scanAndDestroy();
    checkCurrentVideo();
  }, 3000);
  
  // Observer
  console.log('👀 Iniciando MutationObserver...');
  const observer = new MutationObserver(() => {
    console.log('🔔 DOM mudou - verificando...');
    scanAndDestroy();
    checkCurrentVideo();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('✅ Observer ativo!');
  
  // Status a cada 10s
  setInterval(() => {
    console.log(`\n📊 STATUS: ${blockedCount} vídeos bloqueados até agora`);
  }, 10000);
}

// ========================================
// START
// ========================================

console.log('🎬 Executando script...');

if (document.readyState === 'loading') {
  console.log('📄 Document ainda carregando - aguardando DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('📄 Document já carregado - executando agora');
  init();
}

console.log('🎬 Script registrado!\n');