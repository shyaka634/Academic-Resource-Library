import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";
import Subject from "./subjectsModel.js";

const resource= sequelize.define("Resource",{
    resource_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
       
    },

    file_url:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isUrl:true,
        },
    },

    uploaded_by:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"user",
            key:"user_id"
        },
    },
    subject_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"subject",
            key:"subject_id",
        },
    },

    created_at:{
        type:DataTypes.DATE,
        allowNull:false,
       
    },
},{tableName:"resources", timestamps:true})

resource.belongsTo(User,{foreignKey:"uploaded_by", onDelete:"CASCADE", onUpdate:"CASCADE"})
resource.belongsTo(Subject,{foreignKey:"subject_id", onDelete:"CASCADE", onUpdate:"CASCADE"})

User.hasMany(resource,{foreignKey:"resource_id"})
Subject.hasMany(resource,{foreignKey:"resource_id"})

export default resource;