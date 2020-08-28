

const BOT_TOKEN='1246402158:AAH38VOmbmZuAcdrPZyJcIfqhWkjpycDtYQ';
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const db = require('./library.js');

const { enter, leave } = Stage


const bot = new Telegraf(BOT_TOKEN); 


var options = {
  "📑 lecture":"lecture",
  "🏘 Assignment":"Assignment",
  '/Back_To_Home':'/Back_To_Home',
  };


var errorReturn = "🧐    Something is Wrong    🧐\n Please choose only from the keyboard \n  Press /start to Start Again  "
var subscribeEmoji ="⛩ subscribe or unsubscribe";

// let arrSection = ["Grade1_A","Grade1_B","Grade2_A","Grade2_B","Grade3_A","Grade3_B","Grade4_A","Grade4_B","Grade5_A","Grade5_B","Grade6_A","Grade6_B","Grade7_A","Grade7_B","Grade8_A","Grade8_B"]
arrSection ={
  '🅰 A':'A','🅱 B':'B',
  '/Back_To_Home':'/Back_To_Home',
  }

let arrGrades  =
{
"1️⃣ Grade 1":"Grade1","2️⃣ Grade 2":"Grade2",
"3️⃣ Grade 3":"Grade3","4️⃣ Grade 4":"Grade4",
"5️⃣ Grade 5":"Grade5","6️⃣ Grade 6":"Grade6",
"7️⃣ Grade 7":"Grade7","8️⃣ Grade 8":"Grade8",
'/Back_To_Home':'/Back_To_Home',
}

var subjects =
{
  "🔬 Science":'Science',"🇪🇹 Amharic":'Amharic',
  "📝 Math":"Math","🇬🇧 English":"English",
  "👨‍⚖️ civics":"civics","🇪🇬 AfanOromo":"AfanOromo",
  " 👨‍👩‍👧 SocialStudies":"SocialStudies",
  "🧬 Biology":"Biology","🧪 Chemistry":"Chemistry",
  "🔭 Physics":"Physics",
  '/Back_To_Home':'/Back_To_Home',
}

let GradeSubject =
{
"1️⃣ Grade 1":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English",'/Back_To_Home'],
"2️⃣ Grade 2":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English",'/Back_To_Home'],
"3️⃣ Grade 3":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English",'/Back_To_Home'],
"4️⃣ Grade 4":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English",'/Back_To_Home'],
"5️⃣ Grade 5":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English","👨‍⚖️ civics","🇪🇬 AfanOromo","👨‍👩‍👧 SocialStudies",'/Back_To_Home'],
"6️⃣ Grade 6":["🔬 Science","🇪🇹 Amharic","📝 Math","🇬🇧 English","👨‍⚖️ civics","🇪🇬 AfanOromo","👨‍👩‍👧 SocialStudies",'/Back_To_Home'],
"7️⃣ Grade 7":["🇪🇹 Amharic","📝 Math","🇬🇧 English","👨‍⚖️ civics","🇪🇬 AfanOromo","👨‍👩‍👧 SocialStudies","🧬 Biology","🧪 Chemistry","🔭 Physics",'/Back_To_Home'],
"8️⃣ Grade 8":["🇪🇹 Amharic","📝 Math","🇬🇧 English","👨‍⚖️ civics","🇪🇬 AfanOromo","👨‍👩‍👧 SocialStudies","🧬 Biology","🧪 Chemistry","🔭 Physics",'/Back_To_Home'],
}

let STATE={}
class StateInfo
{
  constructor()
  {
    this.pdfFileName=undefined
    this.pdfFiles=undefined;
  }
}


const _menuCreater = function (arrGrades) 
{
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
      // list.push([m.callbackButton('⛩  Back To Home','_homeBotton')])
      console.log(i);
      return m.keyboard(list).oneTime().resize();
  });
}


const _fileCreator = function (arrGrades) 
{
return  testMenu = Telegraf.Extra
  .markdown()
  .markup((m) => {
      let list = [];
      var i=0;
      list.push([m.callbackButton(subscribeEmoji,'dada')])
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
      // list.push([m.callbackButton('⛩  Back To Home','_homeBotton')])
      console.log(i);
      return m.keyboard(list).oneTime().resize();
  });
}

const _fileCreater = function (arrGrades) 
{
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
      // list.push([m.callbackButton('⛩  Back To Home','_homeBotton')])
      console.log(i);
      return m.inlineKeyboard(list);
  });
}



bot.on('/cancel',ctx => {
  ctx.wizard.leave()
  ctx.reply(
    `Hey ${ctx.from.first_name}? you are using Daystar Students Bot, 
    You can get access to specific uploads by pressing 'Material'`,
    Markup.inlineKeyboard([
      //Markup.callbackButton("Auto 🔔", "subscribe"),
      Markup.callbackButton("Materials 🔕", "unsubscribe")
    ]).extra()
  );
})



function _pdfReturn(response){
    try{
        listOfPdf = [];
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


// bot.start(ctx => {
//   ctx.scene.enter('unsubscribe')
// });




bot.start(ctx => {
  // db.getDatabase()._insertUser(ctx.chat.id);
  ctx.reply(
    `Hey ${ctx.from.first_name}? you are using Daystar Students Bot, 
    You can get access to specific uploads by pressing 'Material'`,
    Markup.inlineKeyboard([
      Markup.callbackButton("Materials 🔕", "unsubscribe")
    ]).extra()
  );
});


///SUBSCRIBERS SCENE
const subscribe= new WizardScene(
"subscribe",
  ctx => 
  {
  //   auth=db._hasAccess(ctx.chat.id);
  //   if (auth==false)
  //   {
       ctx.reply("You are Subscribing What Grade Are You?",_menuCreater(arrGrades));
       return ctx.wizard.next();
  //   }
  //   else
  //   {
  //     ctx.reply('You are a subscribed user of this bot, to get custom file click /manual')
  //   }
  // 
  },
   ctx => 
   {
   ctx.wizard.state.grade = ctx.message.text; 
    ctx.reply(`Grade ${ctx.wizard.state.grade} What?`,_menuCreater(arrSection));
    return ctx.wizard.next();
  },
  ctx => 
  {
   ctx.wizard.state.section = ctx.message.text; 
    //db._subscribe(ctx.chat.id,ctx.wizard.state.grade,ctx.wizard.state.section)
    ctx.reply(`you are subscribed in ${ctx.wizard.state.grade}
     ${ctx.wizard.state.section} section. When Updates are available
      this bot will send you. If you want to get documents manually use 
      /manual.
       Thank You!!!`);
    return ctx.scene.leave()
  },
)




///UNSUBSCRIBERS SCENE
const unsubscribe= new WizardScene(
"unsubscribe",
  async ctx => 
  {
    let sent = await ctx.reply("Please Select Your Grade",_menuCreater(Object.keys(arrGrades)));
    
    ctx.wizard.state.id = sent["message_id"];
    return ctx.wizard.next();
  },
  async ctx => 
  {
    if (!Object.keys(arrGrades).includes(ctx.message.text))
    {
      ctx.reply(errorReturn);
      return; 
    }
    
    console.log("this is message");
    ctx.deleteMessage(ctx.wizard.state.id );
    ctx.deleteMessage();
    
    //await ctx.deleteMessage(ctx.wizard.id)
   ctx.wizard.state.grade = ctx.message.text; 
    let sent = await ctx.reply(`Please Select Your Section for ${ctx.wizard.state.grade} ?`,_menuCreater(Object.keys(arrSection)));
    ctx.wizard.state.id = sent["message_id"];
    return ctx.wizard.next();
  },
  async ctx => 
  {
    if(!Object.keys(arrSection).includes(ctx.message.text))
    {
      ctx.reply(errorReturn);
      return; 
    }
    console.log(ctx.wizard.state.id )
    ctx.deleteMessage(ctx.wizard.state.id );
    ctx.deleteMessage();
    
   ctx.wizard.state.section = ctx.message.text; 
   let sent =  ctx.reply('If you want to subscribe or unsubscribe press /subscribeorunsubcribe , what subject do you want to get?',_fileCreator(GradeSubject[ctx.wizard.state.grade]));
   ctx.wizard.state.id = sent["message_id"];
    return ctx.wizard.next();
  },
  async ctx => 
  {
    console.log(ctx.chat);
    if(ctx.message.text==subscribeEmoji)
    {
      console.log("here");
      if(db.getDatabase()._isSubscribed(ctx.chat.id,arrGrades[ctx.wizard.state.grade]+' '+arrSection[ctx.wizard.state.section]))
      {
        db.getDatabase()._unsubscribeToclass(ctx.chat.id,arrGrades[ctx.wizard.state.grade]+' '+arrSection[ctx.wizard.state.section])
        ctx.reply(`🛑        UNSUBSCRIBED        🛑\n\n❌You are not subscribed to ${arrGrades[ctx.wizard.state.grade]+' '+arrSection[ctx.wizard.state.section]} ❌\n\n ❗️❗️  You  Wont Get Any Notification  ❗️❗️`);
      }
      else
      {
        db.getDatabase()._subscribeToclass(ctx.chat.id,arrGrades[ctx.wizard.state.grade]+' '+arrSection[ctx.wizard.state.section])
        ctx.reply(`✅        SUBSCRIBED        ✅\n\n❇️You are now subscribed to ${arrGrades[ctx.wizard.state.grade]+' '+arrSection[ctx.wizard.state.section]}❇️\n\n 🔰 you will be able to get Notifications and Announcments 🔰`);
      }
        ctx.reply('Now select the subject');
        //var index = ;
        return ctx.wizard.selectStep[ctx.wizard.cursor]
    }
    else if (!Object.keys(subjects).includes(ctx.message.text))
    {
      ctx.reply(errorReturn);
      return; 
    } 
     ctx.deleteMessage(ctx.wizard.state.id );
    ctx.wizard.state.subs = ctx.message.text;
    let sent = ctx.reply(`what type of document do you want`,_menuCreater(Object.keys(options)))
    ctx.wizard.state.id = sent["message_id"];
    return ctx.wizard.next();
  },

  async ctx => 
  {
    if (!Object.keys(options).includes(ctx.message.text))
    {
      ctx.reply(errorReturn);
      return; 
    } 
     ctx.deleteMessage(ctx.wizard.state.id );
    ctx.wizard.state.document = ctx.message.text; 
    ctx.reply(`Wait For Document`);
    var user=new StateInfo();
    STATE[ctx.chat.id]=user;
    let tempGrade = arrGrades[ctx.wizard.state.grade];
    let tempsection = arrGrades[ctx.wizard.state.grade]+' '+ arrSection[ctx.wizard.state.section];
    let tempsubject = subjects[ctx.wizard.state.subs];
    let temptype = options[ctx.wizard.state.document];
    console.log(tempGrade)
    console.log(tempsection)
    console.log(tempsubject)
    console.log(temptype)
    
    let response= db.getDatabase()._fetchBook(tempGrade,tempsection,tempsubject,temptype);
    console.log("the responese is")  
    console.log(response)
     if (response.length>0)
     {
         ctx.wizard.state.files = _pdfReturn(response);
         STATE[ctx.chat.id].PdfFiles=ctx.wizard.state.files;
         console.log(ctx.wizard.state.files);
         ctx.reply("please choose the file",_fileCreater(ctx.wizard.state.files));
     }
     else
     {
       ctx.reply('No File Available')
     }
    
  },
  async (ctx)=>{
    ctx.reply("done");
    return ctx.wizard.leave();
  }
)

function _selectThePdf(callbackData,ctx) 
{
    try{
        var key = ctx.chat.id;
        var pdfList = STATE[key].PdfFiles;
        console.log("this is me...",pdfList)
        for(var i=0 ;i <pdfList.length; i++){
            if(callbackData == pdfList[i]){
                STATE[key].pdfFileName = pdfList[i];
                console.log(STATE[key].pdfFileName);
                console.log(i);
                return callbackData;
            }
    }
    }
    catch{
    }
  }
  bot.action(_selectThePdf,(ctx)=>{
    ctx.reply("press Get to get the pdf",_fileCreater(["Get"]));
})
bot.action("Get",(ctx)=>{
        var key = ctx.chat.id;
        var pdfName = STATE[key].pdfFileName;
        ctx.replyWithDocument({source:`./books/${STATE[key].pdfFileName}`,
        filename: `${pdfName}`
    })

})




const stage = new Stage([subscribe,unsubscribe],);
stage.command('cancel', (ctx) => {
    ctx.reply("Operation canceled");
    return ctx.scene.leave();
});
stage.command('Back_To_Home', (ctx) => {
  ctx.reply(
    `Hey ${ctx.from.first_name}? you are using Daystar Students Bot, 
    You can get access to specific uploads by pressing 'Material'`,
    Markup.inlineKeyboard([
      //Markup.callbackButton("Auto 🔔", "subscribe"),
      Markup.callbackButton("Materials 🔕", "unsubscribe")
    ]).extra()
  );
    return ctx.scene.leave();
});
// stage.command(unsub'back', (ctx) => {
//     ctx.reply("1 step back you are");
//     return ctx.wizard.back();
// });

bot.use(session());
bot.use(stage.middleware());


bot.action('subscribe',async (ctx)=>
{
  await console.log('sub')
  ctx.scene.enter('subscribe')
})
bot.action('unsubscribe',async (ctx)=>
{
  await console.log('unsub')
  ctx.scene.enter('unsubscribe')
})





bot.command('manual',async (ctx)=>
{
  await console.log('unsub')
  ctx.scene.enter('unsubscribe')
})


bot.launch(); 

