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
        Meteor.call("_cancelPollRequest", reqId);
        
        if(question.charAt(question.length - 1) != "?") 
        {
            question = question + "?";
        }
        
        resps = [];
        
        for(i=0;i<responses.length;i++) {
            resps.push({
                "id":i,
                "response":responses[i],
            })
        }
        
        votes = new Object();
        for(i=0;i<responses.length;i++) {
            votes[i] = [];
        }        
        
        if(!Meteor.user().profile || !Meteor.user().profile.username) username = "NO_USERNAME";
        else username = Meteor.user().profile.username;

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
    
    _pollRequest: function (chatId) {
        Messages.insert({
            "type":"chat.insertPoll",
            "sender":Meteor.userId()
        })
    },
    
    _cancelPollRequest: function (messageId) {
        message = Messages.findOne({_id:messageId});
        if(message.type == "chat.pollInsert")
        {
            Messages.remove({_id:message._id});
        }
    }
    
})
