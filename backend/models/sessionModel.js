import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";


const sessions= sequelize.define('Sessions',{
    session_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"user",
            key:"user_id"
        },
    },

    expires_at:{
        type:DataTypes.DATE,
        allowNull:false,
       
    },
    created_at:{
        type:DataTypes.DATE,
        allowNull:false,
   
    },
},{tableName:"sessions", timestamps:true})

sessions.belongsTo(User,{foreignKey:"user_id", onDelete:"CASCADE", onUpdate:"CASCADE"})
User.hasMany(sessions,{foreignKey:"session_id"})

export default sessions;
