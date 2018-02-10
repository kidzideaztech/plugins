if(Meteor.isClient)
{
    Template["chat.pollInsert"].onCreated(function () {
        Session.set("_chat.pollInsert-errorMessage-" + Template.instance().data._id, "");
        boxes = Session.get("_chat.polLInsert-boxes-" + Template.instance().data._id);
        if(!boxes)
        {
            Session.set("_chat.polLInsert-boxes-" + Template.instance().data._id, []);
        }
    });
    
    Template["chat.pollInsert"].helpers({

        creator: function () {
            return Template.instance().data.pollCreator == Meteor.userId();
        },
        
        boxes: function () {
            return Session.get("_chat.polLInsert-boxes-" + Template.instance().data._id);
        },
        
        errorMessage: function () {
            return Session.get("_chat.pollInsert-errorMessage-" + Template.instance().data._id);
        }

    })

    Template["chat.pollInsert"].events({
        
        'keyup #pollResponseAdd': function (e,t) {
            if(e.which == 13)
            {
                val = $('#pollResponseAdd').val();
                $('#pollResponseAdd').val("");
                boxes = Session.get("_chat.polLInsert-boxes-" + Template.instance().data._id);
                boxes.push(val);
                Session.set("_chat.polLInsert-boxes-" + Template.instance().data._id, boxes);
            }
        },
        
        'click .removeResponse': function (e,t) {
            boxes = Session.get("_chat.polLInsert-boxes-" + Template.instance().data._id);
            boxes.splice($(e.currentTarget).attr("id"), 1);
            Session.set("_chat.polLInsert-boxes-" + Template.instance().data._id, boxes);
        },

        'click #cancelPoll': function (e,t) {
            Meteor.call("_cancelPollRequest", Template.instance().data._id);
        },

        'keydown': function (e,t) {
            Session.set("_chat.pollInsert-errorMessage-" + Template.instance().data._id);  
        },

        'click #sendPoll': function (e,t) {
            question = $('#_pollQuestion' + Template.instance().data._id).val();
            responses = Session.get("_chat.polLInsert-boxes-" + Template.instance().data._id);
            if(question.length < 3)
            {
                Session.set("_chat.pollInsert-errorMessage-" + Template.instance().data._id, "Enter a question");
            }
            else if(responses.length < 2)
            {
                Session.set("_chat.pollInsert-errorMessage-" + Template.instance().data._id, "Add at least 2 responses");
            }
            else
            {
                Meteor.call("_pollCreate", question, responses, Template.instance().data._id, Template.instance().data.chatId);
            }
        },

    });

    Template["chat.poll"].helpers({

        poll: function (a) {
            Meteor.subscribe("_poll", Template.instance().data.pollId);
            return _PollsCollection.findOne({_id:Template.instance().data.pollId});
        },

        thisRepVotes: function () {
            return _PollsCollection.findOne({_id:Template.instance().data.pollId}).votes[this.id].length;
        },

        voted: function () {
            return _PollsCollection.findOne({_id:Template.instance().data.pollId}).voters.indexOf(Meteor.userId()) != -1;
        }
    });

    Template["chat.poll"].events({

        'click .response': function (e,t) {
            Meteor.call("_pollVote", Template.instance().data.pollId, this.id)
        }

    });
}
