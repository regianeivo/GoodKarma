import { createConnection, getConnection } from "typeorm";
import { Reply } from "../entities/reply";
import { Comment } from "../entities/comment";
import { Link } from "../entities/link";
import { Karma } from "../entities/karma";
import { User} from "../entities/user";

export async function createDbConnection() {

    // Read the database settings from the environment vairables
    const DATABASE_HOST = process.env.DATABASE_HOST;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    const DATABASE_USER = process.env.DATABASE_USER;
    const DATABASE_DB = process.env.DATABASE_DB;

    // Display the settings in the console so we can see if something is wrong
    console.log(
        `
            host: ${DATABASE_HOST}
            password: ${DATABASE_PASSWORD}
            user: ${DATABASE_USER}
            db: ${DATABASE_DB}
        `
    );

    // Open database connection
    await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: 5432,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: [
            User,
            Reply,
            Comment,
            Link,
            Karma
        ],
        // This setting will automatically create database tables in the database server
        synchronize: true
    });

}
