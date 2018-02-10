if(Meteor.isServer)
{
    Meteor.publish("_poll", function (pollId) {
        return _PollsCollection.find({_id:pollId});
    })
    
    // Clear polls older then 30 days
    now = new Date(),
    hourAgo = new Date(now.getTime() - (
        1000 * // Miliseconds
        60 *  // Seconds
        60 * // Minutes
        24 * // Hours
        30 * // Days
        1
        )
    );
    toRemove = Messages.find({"time": { "$lte": hourAgo }}).fetch();
    _PollsCollection.find({"creationDate": { "$lte": hourAgo }}).fetch();
    
}
