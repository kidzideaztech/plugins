# Plugins

## What are plugins?
Plugins are "apps" that work entirely inside chat messages. The possibilitys are endless, because you're not just limited to text. Plugins have full control over what happens inside the chat bubble.

## What are some plugins you have?
Glad you asked

#### Polls
Create a poll, everyone in a chat may vote on it. It is left very open ended, with no security at the moment. Anyone can see who voted, what the question was, and what the responses were. We may add more security in the future.

#### Stickers
Stickers are like emojis, but bigger, and taking up a whole message

#### Flip A Coin
Disclaimer: Doesn't actually have coins... yet.

## How does a plugin become created?

1. Plugin code is written
   Plugin must adhere to the Plugin Requirements
   
2. Pull Request is filed
   A pull request must be filed for the plugin. The pull request should contain in it's description the plugins "calling card", and the function or method it calls. See requirements for calling cards under Plugin Requirements.

3. We check the code to make sure it meets the Plugin Requirements

4. We test the code to make sure it works

5. If approved, plugin is merged. Plugins are seperate from the KidzIdeazTECH code, but they are heavily cached, meaning it will take a while for it to appear on KidzIdeazTECH unless a refresh is manually triggered.

## "Calling Card"
The calling card is the function triggered when the user sends a specific word between colons (e.g. :stickers:). Here's an example:

> if(message == ":stickers:") _StickersPlugin.activate(chatId);

No "work" should be done inside the Calling Card, it should simply trigger the plugin's code.

## Plugin Requirements
### Plugins must not interact with native code, methods, or collections
Plugins must not interact with any of the native's apps collections directly, they must only use the PluginAPI.
Plugins must not interact with any of the native's apps server methods, they must only use the PluginAPI.
Plugins must not interact with any of the native's apps functions, other then the PluginAPI functions.

### Calling Cards must be short, and only call the plugins code
Calling Cards may only call either a Meteor Method setup **inside the plugins code** or a function defined **inside the plugins code**.

Calling Cards may only be 1 line long. Everything should take place inside the plugin code, the calling card just activates it

### Classes and IDs of HTML elements, as well as names of functions and variables must be namespaced
All classes, IDs, and names MUST begin with "_Plugins<PluginName". E.g. "_PluginsFlipACoin"
