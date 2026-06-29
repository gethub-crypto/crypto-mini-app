// В реальном приложении - база данных
// Сейчас заглушка с localStorage API Vercel
const users = new Map();

module.exports = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.json({ premium: false });
    }
    
    // Заглушка - все четные ID получают премиум
    const isPremium = parseInt(userId) % 2 === 0;
    
    res.json({ 
      premium: isPremium,
      features: isPremium ? ['all_coins', 'analytics', 'alerts'] : ['free_coins']
    });
  } catch (error) {
    res.json({ premium: false });
  }
};
