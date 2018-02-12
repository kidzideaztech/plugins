_PollsCollection = new Mongo.Collection("_pollscollection");

Meteor.methods({
    
    _pollVote: function (pollId, id) {
        if(Meteor.user() && Clad.level1())
        {
            poll = _PollsCollection.findOne({_id:pollId});
            userId = Meteor.userId();
            if(poll.voters.indexOf(userId) == -1)
            {
                _PollsCollection.update({_id:poll._id}, {$addToSet:{["votes." + id]:Meteor.userId()}});
                _PollsCollection.update({_id:poll._id}, {$addToSet:{"voters":userId}});
            }
        }
    },
    
    _pollCreate: function (question, responses, reqId, chatId) {
        if(Meteor.user() && Clad.level1())
        {
            Meteor.call("_cancelPollRequest", reqId); // Cancel the request, since it's been submitted

            user = Meteor.user();
            
            if(question.charAt(question.length - 1) != "?") question = question + "?"; // Add a nice little question mark at the end

            resps = [];
            for(i=0;i<responses.length;i++) {
                resps.push({"id":i, "response":responses[i],})
            }

            votes = new Object();
            for(i=0;i<responses.length;i++) {
                votes[i] = [];
            }        

            if(Meteor.user().profile && Meteor.user().profile.username)username = Meteor.user().profile.username;
            else username = Meteor.user().emails[0].address;

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
                "senderName":username,
                "nicetime":moment().format("h:mm:ss a, dddd, MMMM Do"),
                "time":new Date(),
                "flagged":false,     

                "chatId":chatId,

                "type":"chat.poll",
                "pollId":pollId,
                "pollCreator":Meteor.userId()
            });        
        }
    },
    
    _cancelPollRequest: function (messageId) {
        if(Meteor.user() && Clad.level1())
        {        
            message = Messages.findOne({_id:messageId});
            if(message.type === "chat.pollInsert" && message.sender === Meteor.userId()) Messages.remove({_id:message._id});
        }
    }
    
})
