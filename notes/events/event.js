/**
 Event Emitters are built into Node, and are for pub-sub, a pattern where a publisher will emit events, which subscribers can listen and react to. In Node jargon, publishers are called Event Emitters, and they emit events, while subscribers are called listeners, and they react to the events.
*/

// Require events to start using them
const EventEmitter = require('events').EventEmitter;
// Dogs have events to publish, or emit
class Dog extends EventEmitter {}
class Food {}
let myDog = new Dog();

// When myDog is chewing, run the following function (listener)
myDog.on('chew', (item) => {
  if (item instanceof Food) {
    console.log('Good dog');
  } else {
    console.log(`Time to buy another ${item}`);
  }
});

myDog.emit('chew', 'shoe'); // Will result in console.log('Time to buy another shoe')
const bacon = new Food();
myDog.emit('chew', bacon); // Will result in console.log('Good dog')

// In the above example, the dog is the publisher/EventEmitter, while the function that checks the item was the subscriber/listener. You can make more listeners too:

// There can also be multiple listeners for a single event, and even remove listeners:
myDog.on('chew', takeADeepBreathe);
myDog.on('chew', calmDown);
// Undo the previous line with the next one:
myDog.removeListener('chew', calmDown);
// If you want to listen to a event only once, you can use:
myDog.once('chew', pet); // Which will remove the listener automatically without race conditions.

//  Get the names of the events that are subscribed to
const EventEmitter = require("events");
class MyEmitter extends EventEmitter{}
var emitter = new MyEmitter();
emitter
.on("message", function(){ //listen for message event
    console.log("a message was emitted!");
})
.on("message", function(){ //listen for message event
    console.log("this is not the right message");
})
.on("data", function(){ //listen for data event
    console.log("a data just occurred!!");
});
console.log(emitter.eventNames()); //=> ["message","data"]
emitter.removeAllListeners("data");//=> removeAllListeners to data event
console.log(emitter.eventNames()); //=> ["message"]
// Get the number of listeners registered to listen for a specific event
console.log(emitter.listenerCount("message")) // => 1