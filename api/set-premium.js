const firebase = require('./firebase');

module.exports = async (req, res) => {
  try {
    const { userId, premium } = req.body;
    
    if (!userId) {
      return res.json({ success: false, error: 'No userId' });
    }
    
    // Сохраняем в Firebase
    await firebase.update(`users/${userId}`, {
      premium: premium || true,
      activatedAt: Date.now()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, error: error.message });
  }
};
