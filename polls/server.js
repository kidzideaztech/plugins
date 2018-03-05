if(Meteor.isServer)
{
    Meteor.publish("_poll", function (pollId) {
        check(pollId, String);
        return _PollsCollection.find({_id:pollId});
    });
    
    // Clear polls older then 30 days
    now = new Date(),
    timeToRemove = new Date(now.getTime() - (
        1000 * // Miliseconds
        60 *  // Seconds
        60 * // Minutes
        24 * // Hours
        30 // Days
        )
    );
    _PollsCollection.find({"creationDate": {"$lte":timeToRemove}}).fetch();
    
}
