if(Meteor.isClient)
{
    Template["chat.pollInsert"].helpers({

        creator: function () {
            console.log(Template.instance().data);
            return Template.instance().data.pollCreator == Meteor.userId();
        }

    })

    Template["chat.pollInsert"].events({

        'click #cancelPoll': function (e,t) {
            console.log(Template.instance().data);
            Meteor.call("_cancelPollRequest", Template.instance().data._id);
        },

        'click #sendPoll': function (e,t) {
            question = $('#_pollQuestion' + Template.instance().data._id).val();
            responses = ["Yes", "No"];
            Meteor.call("_pollCreate", question, responses, Template.instance().data._id, Template.instance().data.chatId);

        },

    });

    Template["chat.poll"].helpers({

        poll: function (a) {
            a = Template.instance().data.pollId;
            Meteor.subscribe("_poll", a);
            poll = _PollsCollection.findOne({_id:a})
            return poll;
        },

        thisRepVotes: function () {
            pollId = Template.instance().data.pollId;
            // console.log(this);
            return _PollsCollection.findOne({_id:pollId}).votes[this.id].length;
        },

        voted: function () {
            userId = Meteor.userId();
            pollId = Template.instance().data.pollId;
            return _PollsCollection.findOne({_id:pollId}).voters.indexOf(userId) != -1;
        }
    });

    Template["chat.poll"].events({

        'click .response': function (e,t) {
            id = this.id;  
            Meteor.call("_pollVote", Template.instance().data.pollId, id)
        }

    });
}
