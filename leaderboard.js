
PlayersList = new Mongo.Collection('players');


//client code


if(Meteor.isClient){

Template.leaderboard.helpers({

  player:function(){

    return PlayersList.find({}, {sort:{score: -1, name:1}});

  },

   btnMessage:function(){
    var activePlayer = Session.get('active');
    if(activePlayer == undefined){
    return "+";
  }else{
    return "+";
    
  }
},

//decide not to

/*  state:function(){
    var activePlayer = Session.get('active'); 
    if(activePlayer == undefined){
    return true;
  }else{
    return false;
    
  }*/

  //},

  'activeClass':function(){

    var activePlayer = Session.get('active');
    var playerId = this._id;
    if(activePlayer == playerId){
      return 'active';
    }
    
  },

  'selected':function(){

    //flag used to check if we have assigned points. If all players have 0 fallback message is returned

    var flag = PlayersList.find({score: {$gt: 0} }).fetch();

    if(flag == ""){
    return "all players have 0 points";
  }else{
    var name= PlayersList.findOne({}, {sort:{score: -1}});
     return "Current champion: "+name.name;
  }
    
  },

  'count':function(){
    return "Total Players:" + PlayersList.find().count();
  }


});

Template.leaderboard.events({

'click tr': function(){

 Session.set('active', this._id);
 score=this.score;
 
},

'click .increment':function(){
  Session.set('active',this._id);

var query = PlayersList.findOne({_id:Session.get('active')});
var creator = query.created_by;
var CurrentUserName = Meteor.user().username;

//console.log("Created by "+ creator + "CurrentUserName "+CurrentUserName); Test before CRUD operation

if(CurrentUserName == creator){
  PlayersList.update({_id:Session.get('active')}, { $inc: {score:5}});
}else{
  bootbox.alert("This Player was created by user: "+ creator+". You don't have permission to modify this entry ");
}


},

'click .delete':function(){
  Session.set('active',this._id);
  var query = PlayersList.findOne({_id:Session.get('active')});
  var creator = query.created_by;
  var CurrentUserName = Meteor.user().username;
if(CurrentUserName == creator){
  var name= PlayersList.findOne({_id:Session.get('active')}, {sort:{score: -1}});
 
    bootbox.confirm("You are about to remove "+"<strong><h1>Player: "+name.name+"</h1></strong><br> Are you sure that you want to continue?", function(confirmDelete) {

      if(confirmDelete == true){
        PlayersList.remove({_id:Session.get('active')});

      }
}); 
  }else{
    bootbox.alert("This Player was created by user: "+ creator+". You don't have permission to modify this entry ");
  }
  

},

'click .decrease':function(){
  Session.set('active',this._id);

  var query = PlayersList.findOne({_id:Session.get('active')});
  var creator = query.created_by;
  var CurrentUserName = Meteor.user().username;

if(CurrentUserName == creator){
  PlayersList.update({_id:Session.get('active')}, { $inc: {score:-5}});
}else{
  bootbox.alert("This Player was created by user: "+ creator+". You don't have permission to modify this entry ");
}


}


});

  Accounts.ui.config({

    passwordSignupFields: "USERNAME_ONLY"

  });

Template.addPlayerform.events({

'submit form':function(e){

  e.preventDefault();

  var PlayerName = e.target.playerName.value;
  var Playerscore = e.target.playerScore.value;
  var CurrentUserName = Meteor.user().username;

  
  PlayersList.insert({name:PlayerName, score:parseInt(Playerscore), created_by:CurrentUserName});

  e.target.playerName.value = ""; //crear form after submit
  e.target.playerScore.value = ""; //crear form after submit


}

});


}





//server code


if(Meteor.isServer){

console.log("only Server");


}





