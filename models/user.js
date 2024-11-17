import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from "bcryptjs";

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sexe: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  xp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  garentie: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}, {
  timestamps: true,
});

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
