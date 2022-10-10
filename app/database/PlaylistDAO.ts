import { Picture } from"../models/Picture";
import { Caption } from "../models/Caption";
import { PicAlt } from "../models/PicAlt";
import * as mysql from "mysql";
import * as util from "util";

export class PlaylistDAO
{
    private host:string = "";
    private port:number = 3306;
    private username:string = "";
    private password:string = "";
    private schema:string = "PLAYLIST";
    private pool = this.initDbConnection();

    /**
     * Non-default constructor.
     *
     * @param host Database Hostname
     * @param username Database Username
     * @param password Database Password
     */
    constructor(host:string, port:number, username:string, password:string)
    {
        // Set all class properties
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.pool = this.initDbConnection();
    }

   /**
     * CRUD method to return all Artists.
     *
     * @param callback Callback function with an Array of type Artist.
     */
    public findCaption(callback: any)
    {
        // List of Artist to return
        let caption:Caption[] = [];

        // Get a pooled connection to the database, run the query to get all the distinct Artists, and return the List of Artists
        this.pool.getConnection(function(err:any, connection:any)
        {
            // Throw error if an error
            if (err) throw err

            // Run query
            connection.query('SELECT distinct CAPTION FROM PICTURE', function (err:any, rows:any, fields:any)
            {
                // Release connection in the pool
                connection.release();

                // Throw error if an error
                if (err) throw err

                for(let x=0;x < rows.length;++x)
                {
                    caption.push(new Caption(x, rows[x].CAPTION));
                }

                // Do a callback to return the results
                callback(caption);
            });

        });
     }

     /**
     * CRUD method to return all Captions for a caption associated.
     *
     * @param caption Name of the Caption to retrieve Memes for.
     * @param callback Callback function with an Array of type Meme.
     */
    public findMeme(caption:string, callback: any)
    {
         // List of Pictures to return
         let picture:Picture[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes for specific Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM PICTURE WHERE CAPTION=? ORDER BY ID, TITLE', [caption]);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let pictureId = result1[x].ID;
                let caption:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [pictureId]);
                for(let y=0;y < result2.length;++y)
                {
                    caption.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Caption to the list
                picture.push(new Picture(result1[x].ID, result1[x].NAME, result1[x].PicAlt));
            }

            // Do a callback to return the results
            callback(picture);
         });
    }

    /**
     * CRUD method to return all Memes.
     *
     * @param callback Callback function with an Array of type Meme.
     */
    public findAllPictures(callback: any)
    {
         // List of pictures to return
         let picture:Picture[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM PICTURE ORDER BY TITLE');
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let pictureId = result1[x].ID;
                let tracks:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [pictureId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Pic and its Captions to the list
                picture.push(new Picture(result1[x].ID, result1[x].NAME, result1[x].PicAlt));
            }

            // Do a callback to return the results
            callback(picture);
         });
    }

    /**
     * CRUD method to searches for all Memes by a wildard search in Artist.
     *
     * @param search wildcard Artist to search.
     * @param callback Callback function with an Array
     */
    public findPicturesByCaption(search:string, callback: any)
    {
         // List of Pics to return
         let picture:Picture[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Pics
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM PICTURE WHERE CAPTION LIKE ? ORDER BY TITLE", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query
                let pictureId = result1[x].ID;
                let captions:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [pictureId]);
                for(let y=0;y < result2.length;++y)
                {
                    captions.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Captions to the list
                picture.push(new Picture(result1[x].ID, result1[x].NAME, result1[x].PicAlt));
            }

            // Do a callback to return the results
            callback(picture);
         });
    }

        /**
     * CRUD method to searches by a wildcard search in Description.
     *
     * @param search wildcard Description to search for.
     * @param callback Callback function with an Array
     */
    public findPicturesByDescription(search:string, callback: any)
    {
         // List to return
         let picture:Picture[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM PICTURE WHERE NAME LIKE ? ORDER BY PICALT", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for
                let pictureId = result1[x].ID;
                let captions:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [pictureId]);
                for(let y=0;y < result2.length;++y)
                {
                    captions.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Captions to the list
                picture.push(new Picture(result1[x].ID, result1[x].NAME, result1[x].PICALT));
            }

            // Do a callback to return the results
            callback(picture);
         });
    }

    /**
     * CRUD method to return an Rank.
     *
     * @param pictureId
     * @param callback
     */
    public findRank(pictureId:number, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Pics
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM PICTURE WHERE ID=?', [pictureId]);
            if(result1.length != 1)
                callback(null);

            // Use Promisfy Util to make an async function and run query to get all Captions for this Pic
            let captions:Caption[] = [];
            let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [pictureId]);
            for(let y=0;y < result2.length;++y)
            {
                captions.push(new Caption(result2[y].ID, result2[y].TITLE));
            }

            // Create a Picture and its Captions for return
            let picture = new Picture(result1[0].ID, result1[0].NAME, result1[0].PICALT);

            // Do a callback to return the results
            callback(picture);
         });
    }

    /**
     * CRUD method to create a Picture.
     *
     * @param picture Meme to insert.
     * @param callback Callback function with -1 if an error else Pic ID created.
     */
    public create(picture:Picture, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and insert Picture
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('INSERT INTO PICTURE (NAME, PICALT) VALUES(?,?)', [picture.Name, picture.PicAlt]);
            if(result1.affectedRows != 1)
               callback(-1);

            // Use Promisfy Util to make an async function and run query to insert all Captions
            let captionId = result1.insertId;
            for(let y=0;y < picture.Name.length;++y)
            {
                let result2 = await connection.query('INSERT INTO CAPTION (ID, TITLE, CAPTION) VALUES(?,?,?)', [picture, picture.Name[y].toString]);
            }

            // Do a callback to return the results
            callback(captionId);
        });
    }

    /**
     * CRUD method to update a Picture.
     *
     * @param picture to update.
     * @param caption caption to update
     * @param callback Callback function with number of rows updated.
     */


     /**
     * CRUD method to delete an Picture.
     *
     * @param picture ID to delete.
     * @param callback Callback function with number of rows deleted.
     * */
    public delete(Id:number, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
           if (err) throw err;

            // Use Promisfy Util to make an async function and run query to delete
            let changes = 0;
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('DELETE FROM CAPTION WHERE ID=?', [Id]);
            changes = changes + result1.affectedRows;

            // Use Promisfy Util to make an async function and run query to delete Pics
            let result2 = await connection.query('DELETE FROM PICTURE WHERE ID=?', [Id]);
            changes = changes + result2.affectedRows;

            // Do a callback to return the results
            callback(changes);
        });
    }

    //* **************** Private Helper Methods **************** */

    /**
     * Private helper method to initialie a Database Connection
     */
    private initDbConnection():any
    {
        return mysql.createPool({host: this.host, port: this.port, user: this.username, password: this.password, database: this.schema, connectionLimit: 10});
    }
}
