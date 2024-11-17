import sequelize from './config/database.js';// Adjust the path as necessary

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Use `force: true` to drop and recreate the tables
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close(); // Close the connection when done
  }
};

syncDatabase();
