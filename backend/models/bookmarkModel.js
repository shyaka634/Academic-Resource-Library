import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";
import Resource from "./resoucesModel.js";

const bookmark= sequelize.define("Bookmark",{
    bookmark_id:{
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
            key:"user_id",
        },
    },

    resource_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"resources",
            type:"resource_id",
        }
    },

    created_at:{
        type:DataTypes.DATE,
        allowNull:false,
       
    },
},{tableName:"bookmark", timestamps:true})

bookmark.belongsTo(User,{foreignKey:"user_id", onDelete:"CASCADE", onUpdate:"CASCADE"})
bookmark.belongsTo(Resource,{foreignKey:"resource_id", onDelete:"CASCADE", onUpdate:"CASCADE"})

User.hasMany(bookmark,{foreignKey:"bookmark_id"})
Resource.hasMany(bookmark,{foreignKey:"bookmark_id"})

export default bookmark;