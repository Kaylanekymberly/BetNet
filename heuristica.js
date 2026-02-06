/**
 * BetNet - Heurística de Contexto (Milestone 1.1)
 * Sistema de análise contextual para reduzir falsos positivos
 * 
 * @author Kaylane Kymberly
 * @version 2.0.0
 * @date 2026-01-15
 */

// =============================================================================
// CONFIGURAÇÃO DE CATEGORIAS E PESOS
// =============================================================================

const KEYWORD_CATEGORIES = {
  // Palavras que indicam promoção ativa de apostas (peso alto)
  PROMOTION: {
    weight: 3.0,
    keywords: [
      'aposta', 'apostas', 'bet', 'bets', 'betting',
      'casa de apostas', 'plataforma de apostas',
      'site de apostas', 'app de apostas'
    ]
  },
  
  // Palavras que indicam promessa de lucro fácil (peso alto)
  PROFIT_PROMISE: {
    weight: 2.5,
    keywords: [
      'ganhar dinheiro', 'dinheiro fácil', 'lucro garantido',
      'renda extra', 'ganhos', 'ganhei', 'lucrei',
      'método infalível', 'estratégia certeira',
      'multiplicar dinheiro', 'ficar rico'
    ]
  },
  
  // Jogos específicos de apostas (peso alto)
  GAMES: {
    weight: 2.5,
    keywords: [
      'tiger', 'tigrinho', 'fortune tiger',
      'aviator', 'spaceman', 'mines',
      'crash', 'double', 'roleta',
      'blaze', 'slots', 'penalty'
    ]
  },
  
  // Urgência e call-to-action (peso médio)
  URGENCY: {
    weight: 2.0,
    keywords: [
      'agora', 'hoje', 'última chance',
      'cadastre-se', 'cadastro', 'bônus',
      'promoção', 'desconto', 'grátis',
      'clique aqui', 'acesse', 'link na bio'
    ]
  },
  
  // Sites e marcas conhecidas (peso médio)
  BRANDS: {
    weight: 2.0,
    keywords: [
      'bet365', 'betano', 'pixbet', 'sportingbet',
      'esportesdasorte', 'esporte da sorte',
      '1xbet', 'betnacional', 'betfair'
    ]
  },
  
  // Termos financeiros neutros (peso baixo - contexto)
  FINANCIAL: {
    weight: 0.5,
    keywords: [
      'investimento', 'investir', 'finanças',
      'economia', 'mercado', 'ações'
    ]
  }
};

// Palavras que indicam conteúdo crítico/educativo (REDUZEM o score)
const EXCEPTION_KEYWORDS = {
  weight: -2.0,
  keywords: [
    'vício', 'vícios', 'perigo', 'perigos',
    'alerta', 'cuidado', 'risco', 'riscos',
    'problema', 'problemas', 'prejuízo',
    'endividamento', 'dívida', 'tratamento',
    'regulamentação', 'lei', 'proibido',
    'documentário', 'reportagem', 'investigação'
  ]
};

// =============================================================================
// SISTEMA DE SCORING CONTEXTUAL
// =============================================================================

/**
 * Calcula score contextual baseado em densidade lexical
 * @param {string} text - Texto completo do vídeo (título + descrição + canal)
 * @returns {Object} - Score e detalhes da análise
 */
function calculateContextualScore(text) {
  if (!text || text.trim().length === 0) {
    return { score: 0, details: {}, shouldBlock: false };
  }
  
  const normalizedText = normalizeText(text);
  const words = normalizedText.split(/\s+/);
  const totalWords = words.length;
  
  let score = 0;
  let matchedCategories = {};
  
  // Processar cada categoria
  for (const [categoryName, categoryData] of Object.entries(KEYWORD_CATEGORIES)) {
    const matches = countMatches(normalizedText, categoryData.keywords);
    
    if (matches > 0) {
      const categoryScore = matches * categoryData.weight;
      score += categoryScore;
      
      matchedCategories[categoryName] = {
        matches: matches,
        weight: categoryData.weight,
        contribution: categoryScore
      };
    }
  }
  
  // Processar exceções (conteúdo crítico/educativo)
  const exceptionMatches = countMatches(normalizedText, EXCEPTION_KEYWORDS.keywords);
  if (exceptionMatches > 0) {
    const exceptionPenalty = exceptionMatches * EXCEPTION_KEYWORDS.weight;
    score += exceptionPenalty; // Negativo, reduz o score
    
    matchedCategories['EXCEPTION'] = {
      matches: exceptionMatches,
      weight: EXCEPTION_KEYWORDS.weight,
      contribution: exceptionPenalty
    };
  }
  
  // Normalizar score pela densidade do texto
  const density = score / Math.max(totalWords, 10);
  
  // Decisão de bloqueio baseada em regras
  const shouldBlock = evaluateBlockingRules(score, density, matchedCategories);
  
  return {
    score: score,
    density: density,
    totalWords: totalWords,
    matchedCategories: matchedCategories,
    shouldBlock: shouldBlock,
    reason: getBlockingReason(matchedCategories, score)
  };
}

/**
 * Conta quantas vezes palavras-chave aparecem no texto
 */
function countMatches(text, keywords) {
  let count = 0;
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  
  return count;
}

/**
 * Avalia se deve bloquear baseado em múltiplas regras
 */
function evaluateBlockingRules(score, density, categories) {
  // Regra 1: Score absoluto muito alto (promoção óbvia)
  if (score >= 8.0) {
    return true;
  }
  
  // Regra 2: Combinação de categorias críticas
  const hasPromotion = categories.PROMOTION?.matches > 0;
  const hasProfitPromise = categories.PROFIT_PROMISE?.matches > 0;
  const hasGames = categories.GAMES?.matches > 0;
  const hasBrands = categories.BRANDS?.matches > 0;
  
  // Promoção + Lucro + Jogo/Marca = BLOQUEAR
  if (hasPromotion && hasProfitPromise && (hasGames || hasBrands)) {
    return true;
  }
  
  // Regra 3: Alta densidade lexical (texto curto com muitas keywords)
  if (density > 0.3 && score >= 5.0) {
    return true;
  }
  
  // Regra 4: Marca + Call-to-action
  if (hasBrands && categories.URGENCY?.matches >= 2) {
    return true;
  }
  
  // Regra 5: Exceções fortes (conteúdo educativo/crítico)
  if (categories.EXCEPTION?.matches >= 3) {
    return false; // NÃO bloquear
  }
  
  // Regra padrão: score moderado
  return score >= 6.0;
}

/**
 * Gera explicação legível do motivo do bloqueio
 */
function getBlockingReason(categories, score) {
  const reasons = [];
  
  if (categories.PROMOTION) {
    reasons.push(`Promoção de apostas detectada`);
  }
  if (categories.PROFIT_PROMISE) {
    reasons.push(`Promessa de lucro fácil`);
  }
  if (categories.GAMES) {
    reasons.push(`Jogos de apostas mencionados`);
  }
  if (categories.BRANDS) {
    reasons.push(`Sites de apostas citados`);
  }
  if (categories.EXCEPTION) {
    reasons.push(`Conteúdo crítico/educativo (exceção)`);
  }
  
  if (reasons.length === 0) {
    return `Score geral: ${score.toFixed(2)}`;
  }
  
  return reasons.join(', ');
}

/**
 * Normaliza texto para análise
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
}

/**
 * Escapa caracteres especiais para regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =============================================================================
// SISTEMA DE WHITELIST INTELIGENTE
// =============================================================================

const VERIFIED_CHANNELS = {
  news: [
    // Canais de notícias verificados
    'UCu3bHFJNmqyfO4pHRcf6sfA', // Globo News (exemplo)
    'UCd8FKeXLBFtaupSyL_e4CeA'  // CNN Brasil (exemplo)
  ],
  educational: [
    // Canais educativos sobre finanças
  ]
};

/**
 * Verifica se canal está na whitelist
 */
function isChannelWhitelisted(channelId) {
  const allWhitelisted = [
    ...VERIFIED_CHANNELS.news,
    ...VERIFIED_CHANNELS.educational
  ];
  
  return allWhitelisted.includes(channelId);
}

/**
 * Verifica padrões de conteúdo educativo
 */
function isEducationalContent(text, description) {
  // Conteúdo educativo geralmente tem descrições longas
  if (description && description.length > 500) {
    const educationalMarkers = [
      'neste vídeo', 'nesta aula', 'vamos aprender',
      'curso', 'tutorial educativo', 'série educativa'
    ];
    
    const normalizedDesc = normalizeText(description);
    return educationalMarkers.some(marker => normalizedDesc.includes(marker));
  }
  
  return false;
}

// =============================================================================
// INTEGRAÇÃO COM SISTEMA EXISTENTE
// =============================================================================

/**
 * Função principal: substitui containsBetKeywords()
 * @param {string} text - Texto do vídeo
 * @param {Object} metadata - Metadados opcionais (channelId, description, etc)
 * @returns {boolean} - true se deve bloquear
 */
function shouldBlockContent(text, metadata = {}) {
  // Verificar whitelist primeiro
  if (metadata.channelId && isChannelWhitelisted(metadata.channelId)) {
    console.log('🟢 BetNet: Canal na whitelist, permitindo');
    return false;
  }
  
  // Verificar se é conteúdo educativo
  if (isEducationalContent(text, metadata.description)) {
    console.log('🟢 BetNet: Conteúdo educativo detectado, permitindo');
    return false;
  }
  
  // Análise contextual completa
  const analysis = calculateContextualScore(text);
  
  // Log detalhado para debug
  if (analysis.shouldBlock) {
    console.log('🔴 BetNet: BLOQUEADO', {
      score: analysis.score.toFixed(2),
      density: analysis.density.toFixed(3),
      reason: analysis.reason,
      categories: analysis.matchedCategories
    });
  }
  
  return analysis.shouldBlock;
}

// =============================================================================
// EXPORTAÇÃO
// =============================================================================

// Para uso no content.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shouldBlockContent,
    calculateContextualScore,
    isChannelWhitelisted
  };
}