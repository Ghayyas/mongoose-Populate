/// <reference path="typings/tsd.d.ts" />


import express  = require('express');
import mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open',function(){
    console.log('Mongooose Connected.');
});

 let Schema =  mongoose.Schema;

var personSchema = new Schema({
   // _id: Number,
    name : String,
    age: Number,
    stories: [{type: Schema.Types.ObjectId, ref: 'Story'}]
});

let storySchema = new Schema({
    _creator: {type: String, ref :'Person'},
    title: String,
    contributors: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    fans: [{type: Number, ref: 'Person'}]
});

export interface IPerson extends mongoose.Document{
   // _id: Number,
    name: String,
    age: Number,
    length: Number,
    stories : IStory
}

export interface IStory extends mongoose.Document{
    //_id: String,
     _creator : IPerson,
     title: String,
     contributors: IPerson,
     fans : Number
}

export let Story: mongoose.Model <IStory> = mongoose.model <IStory> ("Story", storySchema);

export let Person: mongoose.Model <IPerson> = mongoose.model <IPerson> ('Person', personSchema);

let ghayyas = new Person({ name : "seef", age: 33});

ghayyas.save((err)=>{
    if(err) return console.log("Goot Error",err);
    else{
    console.log('ghayyas', ghayyas);
 let story1 = new Story({
      title: "One Upon a Time",
      _creator: ghayyas._id,
      contributors: ghayyas._id
    });
   
Story.findOne({title: 'One Upon a Time'},(err,data)=>{
    if(err){
        console.log("goot err" ,err);
    }
    else if(!data){
    story1.save((err,s: IStory)=>{
        if (err) return console.log('error', err);
        console.log('s', s);    
    })
}
else{
     Story.update({$push: {contributors:ghayyas._id.toString()}}, function(e1, d1){
                
              console.log('s',e1 || 'd',d1);

            })    
      }
    
     })
    }
}); 
 
 

                 
         Story
            .find({ title: 'One Upon a Time' })
            .populate('contributors fans')
            .exec(function (err, story) {
            if (err) return console.log(err);
            for(var i = 0; i < story.length; i++){
                let cd = story[i];
                let bc = cd.contributors
                for(var j = 0; j < bc.length ; j++){
                  console.log('Contributors Are', bc[j]._id, "fans");        
           }
                
            }
            
            
            // prints "The creator is Aaron"
            });
            
        //     //console.log('server',s);
        //     Person.findByIdAndUpdate(ghayyas._id.toString(), {$push: {contributors: s}}, function(e1, d1){
                
        //       console.log('s',e1 || 'd',d1);

        //     })
            
            

 

