import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const user= sequelize.define("User",{
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    created_at:{
        type:DataTypes.DATE,
        allowNull:false,
    },
},{tableName:"user", timestamps:true})

export default user;