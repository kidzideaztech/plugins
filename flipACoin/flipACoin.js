if(Meteor.isServer)
{
    
    _PluginFlipACoin = function (chatId) {
        
        check(chatId, String);
        
        if(Math.random() >= 0.5)
        {
            coin = "Tails";
        }
        else
        {
            coin = "Heads";
        }
        
        PluginAPI.sendChatMessage(chatId, "<br><small>Flipped a coin. It landed:</small><h1 style='margin: 0px;'>" + coin + "</h1>");
        
    }
    
}
