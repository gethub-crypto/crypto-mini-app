const DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
const API_KEY = process.env.FIREBASE_API_KEY;

// Простые функции для работы с Firebase через REST API
const firebase = {
  // Получить данные
  async get(path) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${API_KEY}`);
      return await response.json();
    } catch (error) {
      console.error('Firebase get error:', error);
      return null;
    }
  },
  
  // Сохранить данные
  async set(path, data) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${API_KEY}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Firebase set error:', error);
      return null;
    }
  },
  
  // Обновить часть данных
  async update(path, data) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${API_KEY}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Firebase update error:', error);
      return null;
    }
  }
};

module.exports = firebase;
