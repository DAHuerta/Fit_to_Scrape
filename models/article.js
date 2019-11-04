var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema;({
 
    title: {
        type: String,
        required: true    
    },

    link: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    saved: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        default: "Saved Article"
    },

    created: {
        type: Date,
        default: Date.now
    }

});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;