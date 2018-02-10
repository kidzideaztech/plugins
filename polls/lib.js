_PollsCollection = new Mongo.Collection("_pollscollection");

Meteor.methods({
    
    _pollVote: function (pollId, id) {
        poll = _PollsCollection.findOne({_id:pollId});
        userId = Meteor.userId();
        if(poll.voters.indexOf(userId) == -1)
        {
            _PollsCollection.update({_id:poll._id}, {$addToSet:{["votes." + id]:"hey"}});
            _PollsCollection.update({_id:poll._id}, {$addToSet:{"voters":userId}});
        }
    },
    
    _pollCreate: function (question, responses, reqId, chatId) {
        Meteor.call("_cancelPollRequest", reqId); // Cancel the request, since it's been submitted
        
        if(question.charAt(question.length - 1) != "?") question = question + "?"; // Add a nice little question mark at the end
        
        resps = [];
        for(i=0;i<responses.length;i++) {
            resps.push({"id":i, "response":responses[i],})
        }
        
        votes = new Object();
        for(i=0;i<responses.length;i++) {
            votes[i] = [];
        }        
        
        username = Meteor.user().profile.username;

        poll = {
            "question":question,
            "responses":resps,
            "votes":votes,
            "voters":[],
            "creator":Meteor.userId(),
            "creatorUsername":username,
            "creationDate":new Date()
        }
        
        pollId = _PollsCollection.insert(poll);        

        Messages.insert({
            "sender":user._id,
            "senderName":user.profile.username,
            "nicetime":moment().format("h:mm:ss a, dddd, MMMM Do"),
            "time":new Date(),
            "flagged":false,     
            
            "chatId":chatId,
            
            "type":"chat.poll",
            "pollId":pollId,
            "pollCreator":Meteor.userId()
        });        
    },
    
    _cancelPollRequest: function (messageId) {
        message = Messages.findOne({_id:messageId});
        if(message.type === "chat.pollInsert" && message.sender === Meteor.userId()) Messages.remove({_id:message._id});
    }
    
})
