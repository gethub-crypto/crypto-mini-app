const firebase = require('./firebase');

module.exports = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.json({ premium: false });
    }
    
    // Получаем данные из Firebase
    const userData = await firebase.get(`users/${userId}`);
    
    const isPremium = userData?.premium || false;
    
    res.json({ 
      premium: isPremium,
      features: isPremium ? ['all_coins', 'analytics', 'alerts'] : ['free_coins']
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ premium: false });
  }
};
