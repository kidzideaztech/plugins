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
