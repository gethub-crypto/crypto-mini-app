const DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
const DATABASE_SECRET = process.env.FIREBASE_SECRET;

const firebase = {
  async get(path) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${DATABASE_SECRET}`);
      return await response.json();
    } catch (error) {
      console.error('Firebase get error:', error);
      return null;
    }
  },
  
  async set(path, data) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${DATABASE_SECRET}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Firebase set error:', error);
      return null;
    }
  },
  
  async update(path, data) {
    try {
      const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${DATABASE_SECRET}`, {
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
