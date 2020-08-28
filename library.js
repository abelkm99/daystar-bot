const sqlite3 = require('sqlite3').verbose();
var deasync = require('deasync');

const fs = require('fs');
const request = require('request');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

const Student_BOT_TOKEN = "1246402158:AAH38VOmbmZuAcdrPZyJcIfqhWkjpycDtYQ";
const BOT_TOKEN = "1148200034:AAHLSHmS04KGVihYnXerib16JRkchL6GiT0";

class databaseActions{
    constructor(){
        this.db = undefined;
    }
    initiateDatabase (){
        this.db = new sqlite3.Database('./database/bot.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                return console.error(err.message);
            }else{
                console.log("database connection opended");
            }
          });
    }




    closeDatabase (){
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
            });
    }


    print(){
        console.log(this.db);
    }

    /**
     * check if the same file can be found from the database
     * returns true or false
     */

    _exist (messageid){
    
        // initiate solution to null and look again until value is returened 
 
        let solution = null;
        
        var query='SELECT * FROM books WHERE MessageID=?;'
        this.db.all(query,[messageid],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        
        });  
        
        while(solution==null){
            deasync.runLoopOnce();
        }  
        return solution;
      }
    

      /**
       *  Does any file exist inside the books table inorder to delete a document
       */
      doesExist (teacherID,section,subject,type,fileURL){
    
        let solution = null;

        var query='SELECT * FROM books WHERE teacherID=? AND section=? AND subject=? AND type=? AND fileURL=?;'
    
        this.db.all(query,[teacherID,section,subject,type,fileURL],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        });
    
    
        while(solution==null){
            deasync.runLoopOnce();
        }  
        return solution!=0;
    }
    /**
     *  Delete a specific pdf from table first checks from the database if any file left
     */
    _deleteDoc (teacherID,grade,section,subject,type,fileURL){
        let sol = null;

        var query='DELETE FROM books WHERE TeacherID=? AND Grade=? AND Section=? AND Subject=? AND Type=? AND fileURL=?;'
        if(this.doesExist(teacherID,section,subject,type,fileURL)){
            this.db.run(query,[teacherID,grade,section,subject,type,fileURL],(err,rows)=>{
                if(err){
                  console.log(err);
                }
                
                sol = `Document ${fileURL} sucessfully deleted`;
              });
        }else{
            sol = "There is no Document with the given name";
        }
        
        while(sol==null){
            deasync.runLoopOnce();
        }
        return sol;
    }
     /**
     * this will print out all the document the teacher uploaded for specific class 
     * @param("teacher id",section)
     */
    _viewer (teacherID,grade,section,subject,type){
        let sol = null;
        
        var query='SELECT * FROM books WHERE TeacherID=? AND Grade=? AND Section=? AND Subject=? AND Type=? ORDER BY UploadedOn DESC;'
        
        this.db.all(query,[teacherID,grade,section,subject,type],(err,rows)=>{
        if(err){
            console.log(err);
        }
        sol = rows;
        })

        while(sol==null){
            deasync.runLoopOnce();
        }

        return sol;
    }
    /**
     * add book to the book table at the database
     * to specific column
     * @param(techerid,section,filepath)
     */

    _addBook (teacherID,grade,section,subject,type,fileurl,messageid){
        
        //add the data to the database
        var query = `INSERT INTO books(TeacherID,Grade,Section,Subject,Type,FileURL,UploadedOn,MessageID) VALUES (?,?,?,?,?,?,DATE('now'),?)`;
        this.db.run(query, [teacherID,grade,section,subject,type,fileurl,messageid], function(err) {
            if (err) {
            return console.log(err.message);
            }
            // get the last insert id   
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
        
        // close the database connection

    }
     /**
     * check is the teacher has accest to the databse
     * @param(useid)
     *  */  
    _hasAccess (TID){
        let  autenticate=null;

        var query='SELECT * FROM teachers WHERE Name=(?);'
        this.db.all(query,[TID],(err,rows)=>{
            if(err){
                console.log(err);
            }
            autenticate = rows;
            
        })
        
        while(autenticate==null){
            deasync.runLoopOnce();
        }
        return autenticate!=0;
    }

    /**
     * get available array of grades  for specific teachers
     * select from Teacher_Grades databse and joint it with teacher id and the available subjects
     */
    _getArray (id){
            var Grades = null;

          var query1="SELECT GradeID, Grades.Name FROM Teachers JOIN Teachers_Grades USING (TeacherID) JOIN Grades USING (GradeID) WHERE Teachers.Name=(?) ORDER BY Grades.Name ASC;"
          this.db.all(query1,[id],(err,rows)=>{
            if(err){
              console.log(err);
            }
            Grades = rows;
          })
      
          while(Grades==null){
              deasync.runLoopOnce();
          }

          return {Grades};
      }
      /**
       * get the available books for the students 
       */
    _fetchBook (grade,section,subject,type){
        let pdfs = null;
        var query = `SELECT books.FileURL FROM books WHERE Grade = ? AND Section = ? AND Subject=? AND Type=?;`
        this.db.all(query,[grade,section,subject,type],(err,rows)=>{
          if(err){
            console.log(err);
          }
          console.log(rows);
          pdfs = rows;
        })
    
        while(pdfs==null){
            deasync.runLoopOnce();
        }
        return pdfs;
    }
    /**
     * get all the available or allowed subject for the teacher
     * input is teacher id
     */
    
    _getAllowedSubjects  (TID){
        let solution = null;
        let list = [];

        var query="SELECT Subjects.Name FROM Teachers_Subjects JOIN Subjects USING (SubjectID) JOIN Teachers USING (TeacherID) WHERE Teachers.Name=?;"
        
        this.db.all(query,[TID],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        });
      
      
        while(solution==null){
            deasync.runLoopOnce();
        }
        solution.forEach((val)=>{
          list.push(val.Name);
        })
        return list;
      }
      /**
       * 
       * @param {*} studentID 
       */
      _isAlreadyUser (UserID){
    
        let solution = null;
       
        var query='SELECT * FROM BotUsers WHERE UserID=?;'
        this.db.all(query,[UserID],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        });
      
      
        while(solution==null){
            deasync.runLoopOnce();
        }  
    
        if(solution.length>0){
            return true;
        }
        else{
            return false
        }
      }
      /**
       * this one is for the students 
       * 
       */
      _insertUser (studentID){
          var query="INSERT INTO BotUsers(UserID) VALUES(?);"
          this.db.run(query,[studentID])
      }
      /**
       * 
       */
      _isSubscribed (UserID,Section){
    
        let solution = null;
       
        var query='SELECT * FROM Subscribers WHERE UserID=? AND Section=?;'
        this.db.all(query,[UserID,Section],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        });
      
      
        while(solution==null){
            deasync.runLoopOnce();
        }  
    
        if(solution.length>0){
            return true;
        }
        else{
            return false
        }
      }
      /**
       * unsecbscribe 
       */

      _unsubscribeToclass (UserID,Section){
          var query = `DELETE FROM Subscribers WHERE UserID=? AND Section=?;`
          this.db.run(query,[UserID,Section])
        
      }

      _subscribeToclass (UserID,Section){
          var query = `INSERT INTO Subscribers(UserID,Section) VALUES (?,?);`
          this.db.run(query,[UserID,Section])
      }
      /**
       * 
       */
      _getSubscribers  (section){
        let solution = null;
        let list = [];

        var query="SELECT Subscribers.UserID FROM Subscribers WHERE Section=?;"
        this.db.all(query,[section],function(err,rows){
            if(err){
                console.log(err);
            }
           solution =rows;
        });
      
      
        while(solution==null){
            deasync.runLoopOnce();
        }
        solution.forEach((val)=>{
          list.push(val.UserID);
        })
        return list;
      }
}

var dbAction = new databaseActions();


dbAction.initiateDatabase();

exports.getDatabase = ()=>{
    return dbAction;
}

exports._menuCreater = function (arrGrades) {
    return  testMenu = Telegraf.Extra
    .markdown()
    .markup((m) => {
        let list = [];
        var i=0;
        for(i; i<arrGrades.length;i+=2){
          if(i+1<arrGrades.length){
            list.push([m.callbackButton(arrGrades[i],arrGrades[i]),
                     m.callbackButton(arrGrades[i+1],arrGrades[i+1])]);
          }else{
            break;
          }
        }
        if(i<arrGrades.length){
          list.push([m.callbackButton(arrGrades[i],arrGrades[i])]);
        }
        list.push([m.callbackButton('⛩  Back To Home','_homeBotton')])
        console.log(i);
        return m.inlineKeyboard(list);
    });
  }

  exports._menuCreaterBack = function (arrGrades,backState) {
    return  testMenu = Telegraf.Extra
    .markdown()
    .markup((m) => {
        let list = [];
        var i=0;
        for(i; i<arrGrades.length;i+=2){
          if(i+1<arrGrades.length){
            list.push([m.callbackButton(arrGrades[i],arrGrades[i]),
                     m.callbackButton(arrGrades[i+1],arrGrades[i+1])]);
          }else{
            break;
          }
        }
        if(i<arrGrades.length){
          list.push([m.callbackButton(arrGrades[i],arrGrades[i])]);
        }
        list.push([m.callbackButton('Done','_homeBotton'),
                    m.callbackButton('Back', backState)])
        console.log(i);
        return m.inlineKeyboard(list);
    });
  }

  exports._getURL = function(fileID){
    let sol = null;
    let _sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileID}`;
    request(_sendUrl, function(err, res, body) {
      let json = JSON.parse(body);
       path = json.result.file_path 
      sol = path;
       url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${sol}`
    });
    while(sol==null){
        deasync.runLoopOnce();
    }
    return {'URL':url,'path':sol};
  }


exports._fileUpload = function(_fileID,_fileName){
    console.log("hi");
    let _sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${_fileID}`;
    console.log(_sendUrl);
    request(_sendUrl, function(err, res, body) {
        let json = JSON.parse(body);
        path = json.result.file_path
        const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${path}`
        console.log(url);
        download(url,_fileName);
    });
  };

  exports._deleteFile = (filename)=>{
    var path = `./books/${filename}`;
    fs.unlinkSync(path,(err)=>{
      if(err){
        throw err;
      }
    })
  }


  exports.sendNotification = (chatIds,notification)=>{
    chatIds.forEach((studs)=>{
      axios
      .post(
        `https://api.telegram.org/bot${Student_BOT_TOKEN}/sendMessage`,
        {
          chat_id: studs,
          text: notification
        }
      )
    })
  }