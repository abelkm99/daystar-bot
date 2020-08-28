const BOT_TOKEN = "1128780352:AAGarwljjpCYkK6BnkCn2xjKQ8yBj1K8DJs";


/**
 * import the  library;
 */

const fs = require('fs');
const request = require('request');
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const sqlite3 = require('sqlite3').verbose();
const db = require('./library.js');
const PDFDocument = require('pdfkit');


/* 

SELECT Teachers.Name,Grades.Name FROM Teachers JOIN Teachers_Grades USING (TeacherID) JOIN Grades USING (GradeID)
	WHERE Teachers.Name = "493027565";

*/

/**
 * create a class that contain all the user information 
 * initiate it when the user has an account;
 */


 var GradeSection = {"Grade1":["A","B"],"Grade2":["A","B"],"Grade3":["A","B"],"Grade4":["A","B"],"Grade5":["A","B"],"Grade6":["A","B"],"Grade7":["A","B"],"Grade8":["A","B"]}

 var GradeSubject = {
    "Grade1":["Science","Amharic","Math","English"],
    "Grade2":["Science","Amharic","Math","English"],
    "Grade3":["Science","Amharic","Math","English"],
    "Grade4":["Science","Amharic","Math","English"],
    "Grade5":["Science","Amharic","Math","English","civics","AfanOromo","SocialStudies"],
    "Grade6":["Science","Amharic","Math","English","civics","AfanOromo","SocialStudies"],
    "Grade7":["Amharic","Math","English","civics","AfanOromo","SocialStudies","Biology","Chemistry","Physics"],
    "Grade8":["Amharic","Math","English","civics","AfanOromo","SocialStudies","Biology","Chemistry","Physics"],
 }
var GradesTest = ["Grade1","Grade2","Grade3","Grade4","Grade5","Grade6","Grade7","Grade8"]
var options = ["lecture","Assignment","Announcment"];
var task = ["Upload Document","Delete Document"];
var subjects =  ["Science","Amharic","Math","English","civics","AfanOromo","SocialStudies","Biology","Chemistry","Physics"];

var gradeEmoji = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]


class information{

    

    constructor(){
        this.allowedGrades = undefined ;
        this.selectedGrade = undefined;
        this.sections = undefined;
        this.selectedSection = undefined;
        this.subjects = undefined;
        this.selectedSubject = undefined;
        this.selectedType = undefined;
        this.selectedTask = undefined;
        this.fileName = undefined;
        this.fileID = undefined;
        this.messageID = undefined;
        this.teacherID = undefined;
        this.pdfFiles = undefined;
        this.selectedPdf = undefined;
        this.fileIDS = [];
        this.namePDF = undefined;
    }
    getGrades() {
        var list = [];
        for(var i=0; i<this.allowedGrades.length;i++){
          list.push(this.allowedGrades[i].Name);
        }
        
        return list;
    }
    reset(){
        this.allowedGrades;
        this.selectedGrade;
        this.sections ;
        this.selectedSection;
        this.subjects;
        this.selectedSubject;
        this.selectedType;
        this.selectedTask;
        this.fileName;
        this.fileID;
        this.teacherID;
        this.pdfFiles = [] ;
        this.selectedPdf;
    }
}

const bot = new Telegraf(BOT_TOKEN)

var STATE = {};
var loggedin = {};

bot.action('_informationPage',(ctx)=>{
    ctx.reply("Welcome to Daystar international bot\n 👉 /start to upload a file\n 👉 /convert to create a PDF");
})

bot.command('start', (ctx) => {  
            var flag = false;
            console.log(db.getDatabase().print())
            try{
              if(loggedin[ctx.chat.id]==true){
                flag = true;
              }
              else if(db.getDatabase()._hasAccess(ctx.chat.id)){
                  console.log("did it just logged into hear")
                  flag = true;
              }

              if(flag == true){
                  ctx.reply(`Welcome ${ctx.chat.first_name}`);
                  console.log(bot);
                  var ChatState = new information();
                  ChatState.allowedGrades = db.getDatabase()._getArray(ctx.chat.id).Grades;
                  ChatState.teacherID = ctx.chat.id;
                  STATE[ctx.chat.id] = ChatState;
                  ctx.reply('👇🏽      Please Select Grade   👇🏽', db._menuCreaterBack(GradesTest,'_informationPage'));
            }else{
                ctx.reply(` ❌⭕️ dear ${ctx.chat.first_name} you dont have right to access this bot ❌⭕️`);
            }  
            }
            catch{
              
            }

  });
 
  
bot.action('_homeBotton', (ctx)=>{ 
    var flag = false;
    if(loggedin[ctx.chat.id]==true){
        flag = true;
    }
    else if(db.getDatabase()._hasAccess(ctx.chat.id)){
        console.log("did it just logged into hear")
        flag = true;
    }
   if(flag==true){
                ctx.reply(`Welcomback ${ctx.chat.first_name}`);
                  var ChatState = new information();
                  ChatState.allowedGrades = db.getDatabase()._getArray(ctx.chat.id).Grades;
                  ChatState.teacherID = ctx.chat.id;
                  STATE[ctx.chat.id] = ChatState;
                ctx.reply('👇🏽      Please Select Grade   👇🏽', db._menuCreaterBack(GradesTest,'_informationPage'));
    }else{
        ctx.reply(` ❌⭕️ dear ${ctx.chat.first_name} you dont have right to access this bot ❌⭕️`);
    }
  
})  



function _getGrades (callbackData,ctx) {
  console.log("the pressed botton is");
  console.log(ctx.update.callback_query.data);
  if(ctx.update.callback_query.data != '_exportPdf' && ctx.update.callback_query.data != '_convertPdf' ){
    try{
        var key = ctx.chat.id;
        console.log(STATE[key]);
        // var arrGrades = STATE[key].getGrades();
        var arrGrades = GradesTest;
        for(var i=0; i<arrGrades.length;i++){
            if (callbackData === arrGrades[i]){
                STATE[key].selectedGrade = arrGrades[i];
                return callbackData;
            }
        }
    }
    catch(err){
      console.log(err);
    }
  }
    
}



function _gradeSetionCreator(ctx,selectedGrade) {
    try{
        var list = [];
        var Match = GradeSection[selectedGrade];
        Match.forEach((section)=>{
            list.push(selectedGrade+" "+section);
        });
        STATE[ctx.chat.id].sections = list;
        return list;
    }
    catch(err){
        console.log(err);
    }
};

function _gradeLoader(ctx,_selectedSection) {

    try{
        ctx.reply(` 👉👉 please select the section for ${STATE[ctx.chat.id].selectedGrade} 👈👈`,db._menuCreater(_gradeSetionCreator(ctx,_selectedSection)));

    }
    catch(err){
        console.log(err);
    }

}


bot.action(_getGrades, (ctx)=>{ _gradeLoader(ctx,STATE[ctx.chat.id].selectedGrade)})

/**
 * 
 * @param {take grade as an input and return available subject to the user} callbackData 
 * @param {set the available subjects for that grade Sections} ctx 
 */

function _getSection(callbackData,ctx){
    try{
        var key = ctx.chat.id;
        // STATE[key].sectionsMenuState();
        var sections = STATE[key].sections;
        for(var i=0; i<sections.length; i++){
            if(callbackData === sections[i]){
                STATE[key].selectedSection = sections[i];
                return callbackData;
            }   
        }
    }
    catch(err){
        console.log(err);
    }
}

function _sectionSubjectCreator(ctx,selectedGrade) {
    try{
        var subjects  = GradeSubject[selectedGrade];
        // var allowedSubjects = db.getDatabase()._getAllowedSubjects(ctx.chat.id);
      var allowedSubjects = subjects;
        
        var localDict = {};
        for(var i=0; i<allowedSubjects.length;i++){
            localDict[allowedSubjects[i]] = true;
        }
        
        var list = [];
        subjects.forEach((subject)=>{
            if(localDict[subject] == true){
                list.push(subject);
            }
        })
        STATE[ctx.chat.id].subjects = list;
        return list;
    }
    catch(err){
        console.log(err);
    }
}


function _sectionLoader(ctx,_selectedMenu_selectedSection) {
    try{
        ctx.reply(` 👉👉 Please select the subject for ${STATE[ctx.chat.id].selectedSection} 👈👈`,db._menuCreater(_sectionSubjectCreator(ctx,STATE[ctx.chat.id].selectedGrade)));

    }
    catch(err){
        console.log(err);
    }
    // console.log(_selectedMenu);
}

bot.action(_getSection, (ctx)=>{ _sectionLoader(ctx,STATE[ctx.chat.id].selectedSection)})
/**
 * 
 * @param {get the the subject and set the load the selected subject of the material and return it to the call back} callbackData 
 */
function _getSubject(callbackData,ctx){
    try{
        var key = ctx.chat.id
        console.log(key);
        var subjects = STATE[key].subjects;
        for(var i=0;i<subjects.length;i++){
            if(callbackData === subjects[i]){
                STATE[key].selectedSubject = subjects[i];
                return callbackData;
            }
        }
    }
    catch(err){
        console.log(err);
    }
}
function _subjectLoader(ctx,subject) {
   
      var key = ctx.chat.id;
      console.log("the selected subjects is");
      console.log(STATE[key].selectedSubject);
      return ctx.reply(` 👉👉 select the type of File for ${STATE[key].selectedSection}  ${STATE[key].selectedSubject} 👈👈`,db._menuCreater(options));

}

bot.action(_getSubject, (ctx)=>{ _subjectLoader(ctx,STATE[ctx.chat.id].selectedSubject)})

/**
 * 
 * @param {get the type of material and set it to the selected type} callbackData 
 * @param {then display the next tasks} ctx 
 */
function _getMaterialType(callbackData,ctx){
    try{
        for(var i=0;i<options.length;i++){
            if(callbackData === options[i]){
                STATE[ctx.chat.id].selectedType = options[i]
                return callbackData;
            }
        }
    }
    catch(err){
        console.log(err);
    }
}
function _taskLoader(ctx,selectedType) {
    console.log("the selected type is "+selectedType)
    try{
        var key = ctx.chat.id;
        if(selectedType =='Announcment'){
          return ctx.reply(` 👉👉 Send Announcment for ${STATE[key].selectedSection} ${STATE[key].selectedSubject} Students  👈👈 `, db._menuCreater(["send Anouncments"]));
        }else{
          return ctx.reply(` 👉👉 Do You Want To UPLOAD📤 or DELETE❌ ${STATE[key].selectedType} for  ${STATE[key].selectedSection } ${STATE[key].selectedSubject} Subkect 👈👈`,db._menuCreater(task));
        }
    }
    catch(err){
        console.log(err);
    }
}

bot.action(_getMaterialType, (ctx)=>{ _taskLoader(ctx,STATE[ctx.chat.id].selectedType)})

function _getTask(callbackData,ctx) {
    try{
        for(var i=0;i<task.length;i++){
            if(callbackData === task[i]){
                STATE[ctx.chat.id].selectedTask =task[i];
                return callbackData;
            }
        }
    }
    catch(err){
        console.log(err);
    }
  }

function _fileUploader(ctx) {
    try{
        var key = ctx.chat.id;
        return ctx.reply(`🌐 Upload ${STATE[key].selectedType} to ${STATE[key].selectedSection} ${STATE[key].selectedSubject} `,db._menuCreater(["start Upload"]))
    }
    catch(err){
        console.log(err);
    }
}

function _fileDelete(ctx) {
    try{
        var key = ctx.chat.id;
        return ctx.reply(`❌ Delete ${STATE[key].selectedType} to ${STATE[key].selectedSection} ${STATE[key].selectedSubject} `,db._menuCreater(["start Deleting"]))
    }
    catch(err){
        console.log(err);
    }
}

bot.action(_getTask,(ctx)=>{
    var key = ctx.chat.id;
    var selectedTask = STATE[key].selectedTask; 
    if(selectedTask == task[0]){
        _fileUploader(ctx);
    }
    else{
        _fileDelete(ctx);
    }
} )


function _startUpload(callbackData,ctx) {
    try{
        if(callbackData === "start Upload"){
            return callbackData;
        }
    }
    catch(err){

    }
  }

const _fileDownload = function(_fileID,_fileName){
   try{
    console.log("hi");
    let _sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${_fileID}`;
    console.log(_sendUrl);
    request(_sendUrl, function(err, res, body) {
        let json = JSON.parse(body);
        var path = json.result.file_path
        const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${path}`
        console.log(url);
        downloadBooks(url,_fileName);
    });
   }
   catch{

   }
};
const downloadBooks = (url, dest, cb) => {
    try{
      let upload_path = `./books/${dest}`;
      const file = fs.createWriteStream(upload_path);
      const sendReq = request.get(url);
    
      // verify response code
      sendReq.on('response', (response) => {
          if (response.statusCode !== 200) {
              return cb('Response status was ' + response.statusCode);
          }
    
          sendReq.pipe(file);
      });
    
      // close() is async, call cb after close completes
      file.on('finish', () => file.close(cb));
    
      // check for request errorsconst fs = require('fs');
      sendReq.on('error', (err) => {
          fs.unlink(upload_path);
          return cb(err.message);
      });
    
      file.on('error', (err) => { // Handle errors
          fs.unlink(upload_path); // Delete the file async. (But we don't check the result)
          return cb(err.message);
      });
    }
    catch(err){
      console.log(err);
  }
};

const downloadImages = (url, dest, cb) => {
    try{
      let upload_path = `./local_images/${dest}`;
      const file = fs.createWriteStream(upload_path);
      const sendReq = request.get(url);
    
      // verify response code
      sendReq.on('response', (response) => {
          if (response.statusCode !== 200) {
              return cb('Response status was ' + response.statusCode);
          }
    
          sendReq.pipe(file);
      });
    
      // close() is async, call cb after close completes
      file.on('finish', () => file.close(cb));
    
      // check for request errorsconst fs = require('fs');
      sendReq.on('error', (err) => {
          fs.unlink(upload_path);
          return cb(err.message);
      });
    
      file.on('error', (err) => { // Handle errors
          fs.unlink(upload_path); // Delete the file async. (But we don't check the result)
          return cb(err.message);
      });
    }
    catch(err){
      console.log(err);
  }
  };

bot.action(_startUpload, (ctx)=>{
    
        
            var counter = 0;
             ctx.reply("Please upload a file")
             .then(
                 bot.on('document', async(ctx)=>{
                    
                    var key = ctx.chat.id;
                     console.log("the data recived")
                     STATE[key].fileID = ctx.message.document["file_id"];
                     STATE[key].fileName = ctx.message.document["file_name"];
                     STATE[key].messageID = ctx.message.message_id;
                     var _fileName = STATE[key].fileName;
                     var check_before = db.getDatabase()._exist(STATE[key].messageID);
                     if(check_before.length>0){
                         ctx.reply("the File name already exist please rename the file to diiffren name and press start Upload", db._menuCreater(["start Upload"]));
                     }
                     else{
                        _fileDownload(STATE[key].fileID,STATE[key].fileName);
                        var subscribers = db.getDatabase()._getSubscribers(STATE[key].selectedSection);
                        console.log(subscribers);
                       db.getDatabase()._addBook(STATE[key].teacherID,STATE[key].selectedGrade,STATE[key].selectedSection,
                                   STATE[key].selectedSubject,STATE[key].selectedType,_fileName,STATE[key].messageID);
                       ctx.reply("file hase been uploaded press upload to upload another document in this class",db._menuCreater(["start Upload"]));
                       db.sendNotification(subscribers,`🟣          Notification          🟣\n 👉📘new ${STATE[key].selectedType} has been uploaded for ${STATE[key].selectedSection} ${STATE[key].selectedSubject} students`);
                     }
                 })
     
             )
        
    
})




function _deletePdf(callbackData,ctx){
  try{
    console.log("got here");
    var key = ctx.chat.id
    var pdfFiles = STATE[key].pdfFiles;
    for(var i=0;i<pdfFiles.length;i++){
        if(callbackData === pdfFiles[i]){
            STATE[key].selectedPdf = pdfFiles[i];
            console.log("got "+pdfFiles[i]);
            return callbackData;
        }
    }
  }
  catch(err){
    console.log(err);
}
}



function _pdfReturn(response){
    try{
        var listOfPdf = [];
        response.forEach((row)=>{
            listOfPdf.push(row.FileURL);
        })

        // console.log(listOfPdf);
        return listOfPdf;
    }
    catch(err){
        console.log(err);
    }
}


function _startDelete(callbackData,ctx){
    try{
      if(callbackData === "start Deleting"){
        return callbackData;
      }
    }
    catch(err){
        console.log(err);
    }
}

bot.action(_startDelete, (ctx)=>{
    try{
      var key = ctx.chat.id;
      console.log("you are deleting");
      let response = db.getDatabase()._viewer(key,STATE[key].selectedGrade,STATE[key].selectedSection,STATE[key].selectedSubject,STATE[key].selectedType);
      if(response.length<1){
          ctx.reply("There is No File left to Delete under this class", db._menuCreater([]));
      }else{
          STATE[key].pdfFiles = _pdfReturn(response);
          console.log(STATE[key].pdfFiles);
          ctx.reply("please choose the file to be deleted",db._menuCreater(STATE[key].pdfFiles));
      }
    }
    catch(err){
        console.log(err);
    }
})





function _pdfDelete(ctx,selectedPdf){
    try{
        var key = ctx.chat.id;
        db._deleteFile(selectedPdf);
        db.getDatabase()._deleteDoc(key,STATE[key].selectedGrade,STATE[key].selectedSection,STATE[key].selectedSubject,STATE[key].selectedType,selectedPdf);
        console.log("file has beend deleted");
        let response = db.getDatabase()._viewer(key,STATE[key].selectedGrade,STATE[key].selectedSection,STATE[key].selectedSubject,STATE[key].selectedType);
        if(response.length<1){
            ctx.reply("there is no file left", db._menuCreater([]));
        }else{
            var pdfFiles = _pdfReturn(response);
            ctx.reply("File has been deleted successfullt",db._menuCreater(pdfFiles));
        }
    }
    catch(err){
        console.log(err);
    }
    
}


bot.action(_deletePdf , (ctx)=>{_pdfDelete(ctx,STATE[ctx.chat.id].selectedPdf)})



bot.action("send Anouncments", (ctx)=>{
  try{
    var key = ctx.chat.id
    ctx.reply("please send your announcment")
    .then(

      bot.on('text', async(ctx)=>{
        console.log("about to show the subs")
        var subscribers = db.getDatabase()._getSubscribers(STATE[key].selectedSection);
        console.log(subscribers);
        db.sendNotification(subscribers,`new Announcment  for ${STATE[key].selWWectedSection} ${STATE[key].selectedSubject} students \n 🟣             ${ctx.message.text}`);
          ctx.reply("announcment has been sent press send Anouncments to send another Anouncments ",db._menuCreater(["send Anouncments"]));

      })

    )
  }catch{
    
  }
  // ctx.reply("walla")
})


var photos = [];
var flag = true;

bot.command('convert',  (ctx)=>{
        var data = new information();
        STATE[ctx.chat.id] = data; 
        ctx.reply(" 🔴              🏞➡️➡️📖 \n              Image To Pdf Converter  \n              Please Upload a Photo",
        Markup.inlineKeyboard(
                        [Markup.callbackButton('Done','_homeBotton',hide=flag)],
                    ).extra()
        )
        .then(
            console.log(ctx.message),
            bot.on('photo',async (ctx)=>{
              
              var key = ctx.chat.id;
              
              STATE[key].fileIDS.length = 0;
              var fid = ctx.message.photo.slice(-1)[0].file_id+ctx.chat.id;
              photos.push(fid);
              STATE[key].fileIDS.push(db._getURL(ctx.message.photo.slice(-1)[0].file_id));
              console.log(STATE[key].fileIDS)
              console.log(photos);
               ctx.reply("📤 Upload More  Photos  📤\n Press Done when you finish",
                  Markup.inlineKeyboard(
                                  [Markup.callbackButton('✅ Done','_convertPdf')],
                              ).extra()
                  )
              

            })
        )
    }
)


bot.action('_convertPdf', (ctx)=>{
    try{
        var key = ctx.chat.id;
        var downphotosloadUrls = STATE[key].fileIDS;
        ctx.reply("please enter the file name for your PDF")
        .then(
          bot.on('text',async (ctx)=>{
            
            
            downphotosloadUrls.forEach((data)=>{
                var fname = ctx.chat.id+data["path"].slice(7);
                console.log(fname);
                downloadImages(data["URL"],fname);
            })
            
            
            STATE[key].namePDF = ctx.message.text; 
            console.log(STATE[key].namePDF);
            ctx.reply("processing Images ",
            Markup.inlineKeyboard(
              [Markup.callbackButton('📕 Export 📕','_exportPdf')],
            ).extra()
            )    
          })
        )
        
    }
    catch(err){
        console.log(err);
    }
})


bot.action('_exportPdf', (ctx)=>{
  try{
    ctx.reply("exporting image");
    _convertSend(ctx);
  }
  catch(err){
    console.log(err);
  }
})




const _convertSend = (ctx)=>{

    try{
        var data =[];
    console.log("starting to do");

    fs.readdirSync('./local_images/').forEach(file => {
        console.log(file.slice(0,9)==ctx.chat.id);
        if(file.slice(0,9)==ctx.chat.id){
          data.push(file);
        }
    });

    console.log("finished");

    console.log(`the file for ${ctx.chat.id} is`, data)
    const pdf = new PDFDocument;
    pdf.pipe(fs.createWriteStream(`./local_pdfs/${ctx.chat.id}.pdf`));
    for(var i=0; i<data.length;i++){
      pdf.image(`./local_images/`+data[i],7, 7, {width: 600})
      pdf.addPage()
    }
    pdf.end();
    _sendbackPdf(ctx);
    _deleteUsed(ctx,data);
    
    var key = ctx.chat.id;
      
      //clean the states 
    STATE[key].fileIDS = [];
    STATE[key].namePDF
    ctx.reply("Converting complited press home when you get the file",
            Markup.inlineKeyboard(
                [Markup.callbackButton(' 🏠 Home','_informationPage')],
            ).extra()
          );
    }
    catch(err){
        console.log(err);
    }

}

const _sendbackPdf = (ctx)=>{
   try{
        ctx.replyWithDocument({source:`./local_pdfs/${ctx.chat.id}.pdf`,
        filename:STATE[ctx.chat.id].namePDF
    })
     
   }
   catch{

   }
}
const _deleteUsed = (ctx,photolists)=>{
    try{
        for(var i=0;i<photolists.length;i++){
            fs.unlink(`./local_images/`+photolists[i], function(err) {
              if (err) {
                throw err
              } else {
                console.log("Successfully deleted the file.")
              }
            })
          }
          fs.unlink(`./local_pdfs/${ctx.chat.id}.pdf`, function(err) {
          
          
            if (err) {            
            throw err

        } else {
            console.log("Successfully deleted the file.")
          }
        })
    }
    catch(err){
        console.log(err);
    }

}

bot.launch();




