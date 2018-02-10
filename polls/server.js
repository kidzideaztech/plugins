if(Meteor.isServer)
{
    Meteor.publish("_poll", function (pollId) {
        return _PollsCollection.find({_id:pollId});
    })
}
