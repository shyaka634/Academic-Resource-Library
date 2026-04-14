import { Sequelize } from "sequelize";

const sequelize= new Sequelize('school_library','root','',{
    host:"localhost",
    dialect:'mysql',
    
});

export async function connectDb(){
    try {
        sequelize.authenticate();
        console.log("Connected yo db successfully");
    } catch (error) {
        console.error("error occured when connecting to db",error);
    }
}

export default sequelize;