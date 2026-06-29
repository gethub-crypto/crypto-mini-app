const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const type = req.query.type || 'free';
    
    if (type === 'free') {
      // Бесплатные криптовалюты
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd,eur,rub&include_24hr_change=true&include_24hr_vol=true'
      );
      return res.json({ success: true, data: response.data });
    }
    
    if (type === 'premium') {
      // Премиум - топ-20 криптовалют
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'
      );
      return res.json({ success: true, data: response.data });
    }
    
    if (type === 'search') {
      // Поиск криптовалюты
      const query = req.query.q;
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );
      return res.json({ success: true, data: response.data });
    }
    
    res.json({ success: false, error: 'Invalid type' });
  } catch (error) {
    console.error('Crypto API error:', error);
    res.status(500).json({ success: false, error: 'API error' });
  }
};
