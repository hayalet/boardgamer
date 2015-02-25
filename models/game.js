var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var GameSchema = new Schema({
    name: String,
    publisher: String,
    description: String,
    year: String,
    category: String,
    image: String,
    players: String,
    reviews: {
        author: String,
        review: String
    },
    description: String
});

mongoose.model('Game', GameSchema);