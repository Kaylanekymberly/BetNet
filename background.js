// Service Worker para a extensão BetNet

// Inicializa o storage com valores padrão
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedCount: 0,
    filteredCount: 0,
    protectionEnabled: true
  });
  
  console.log('🛡️ BetNet: Extensão instalada com sucesso!');
});

// Lista de sites proibidos (mesmo do content.js para consistência)
const sitesProibidos = [
  'bet365.com', 'betano.com', 'betway.com', 'sportingbet.com',
  '1xbet.com', 'pixbet.com', 'stake.com', 'blaze.com',
  'betfair.com', 'rivalry.com', 'f12bet.com', 'parimatch.com',
  'esportesdasorte.com', 'mrjack.bet', 'betmotion.com',
  'pinnacle.com', 'bodog.com', 'betnacional.com'
];

// Monitora navegação e bloqueia sites proibidos
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Apenas frame principal
  
  const url = new URL(details.url);
  const hostname = url.hostname.toLowerCase();
  
  // Verifica se o site está na lista de bloqueio
  for (const site of sitesProibidos) {
    if (hostname.includes(site)) {
      // Incrementa contador
      chrome.storage.local.get(['blockedCount'], (result) => {
        chrome.storage.local.set({
          blockedCount: (result.blockedCount || 0) + 1
        });
      });
      
      // Redireciona para página de bloqueio
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('blocked.html')
      });
      
      return;
    }
  }
});

// Escuta mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contentFiltered') {
    // Incrementa contador de conteúdos filtrados
    chrome.storage.local.get(['filteredCount'], (result) => {
      chrome.storage.local.set({
        filteredCount: (result.filteredCount || 0) + 1
      });
    });
    sendResponse({ success: true });
  }
  
  if (request.action === 'getProtectionStatus') {
    chrome.storage.local.get(['protectionEnabled'], (result) => {
      sendResponse({ enabled: result.protectionEnabled !== false });
    });
    return true;
  }
});

// Atualiza ícone baseado no status
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.protectionEnabled) {
    const enabled = changes.protectionEnabled.newValue;
    
    chrome.action.setIcon({
      path: enabled ? {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      } : {
        "16": "icons/icon16-disabled.png",
        "48": "icons/icon48-disabled.png",
        "128": "icons/icon128-disabled.png"
      }
    });
  }
});

// Limpa estatísticas diariamente (opcional)
chrome.alarms.create('resetStats', { periodInMinutes: 1440 }); // 24 horas

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetStats') {
    chrome.storage.local.set({
      blockedCount: 0,
      filteredCount: 0
    });
    console.log('🛡️ BetNet: Estatísticas resetadas');
  }
});
const sitesBloqueados = [
  "*://*.bet365.com/*",
  "*://*.betano.com/*",
  "*://*.blaze.com/*",
  "*://*.pixbet.com/*",
  "*://*.sportingbet.com/*"
];

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) { // Garante que bloqueia a aba principal, não anúncios pequenos
    chrome.tabs.update(details.tabId, {
      url: "https://seusite.com/ajuda.html" // Sua página de suporte/bloqueio
    });
  }
}, { url: [{ hostContains: "bet" }, { hostContains: "casino" }, { hostContains: "slot" }] });