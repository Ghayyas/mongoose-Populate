/// <reference path="typings/tsd.d.ts" />
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('Mongooose Connected.');
});
var Schema = mongoose.Schema;
var personSchema = new Schema({
    // _id: Number,
    name: String,
    age: Number,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});
var storySchema = new Schema({
    _creator: { type: String, ref: 'Person' },
    title: String,
    contributors: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    fans: [{ type: Number, ref: 'Person' }]
});
exports.Story = mongoose.model("Story", storySchema);
exports.Person = mongoose.model('Person', personSchema);
var ghayyas = new exports.Person({ name: "seef", age: 33 });
ghayyas.save(function (err) {
    if (err)
        return console.log("Goot Error", err);
    else {
        console.log('ghayyas', ghayyas);
        var story1 = new exports.Story({
            title: "One Upon a Time",
            _creator: ghayyas._id,
            contributors: ghayyas._id
        });
        exports.Story.findOne({ title: 'One Upon a Time' }, function (err, data) {
            if (err) {
                console.log("goot err", err);
            }
            else if (!data) {
                story1.save(function (err, s) {
                    if (err)
                        return console.log('error', err);
                    console.log('s', s);
                });
            }
            else {
                exports.Story.update({ $push: { contributors: ghayyas._id.toString() } }, function (e1, d1) {
                    console.log('s', e1 || 'd', d1);
                });
            }
        });
    }
});
exports.Story
    .find({ title: 'One Upon a Time' })
    .populate('contributors fans')
    .exec(function (err, story) {
    if (err)
        return console.log(err);
    for (var i = 0; i < story.length; i++) {
        var cd = story[i];
        var bc = cd.contributors;
        for (var j = 0; j < bc.length; j++) {
            console.log('Contributors Are', bc[j]._id, "fans");
        }
    }
    // prints "The creator is Aaron"
});
//     //console.log('server',s);
//     Person.findByIdAndUpdate(ghayyas._id.toString(), {$push: {contributors: s}}, function(e1, d1){
//       console.log('s',e1 || 'd',d1);
//     })
