
var listeners = {};

var event = function (channel, event) {
    channel = listeners[channel] || (listeners[channel] = {});
    return channel[event] || (channel[event] = {on: [], once: []});
};

/**
 * Registers an event listner for the specified channel
 * @param ch channel name
 * @param e event name
 * @param done event callback
 */
module.exports.on = function (ch, e, done) {
    event(ch, e).on.push(done);
};

module.exports.once = function (ch, e, done) {
    event(ch, e).once.push(done);
};

module.exports.off = function (ch, e, done) {
    var arr = event(ch, e);
    var idx = arr.on.indexOf(done);
    if (idx !== -1) {
        arr.on.splice(idx, 1);
    }
    idx = arr.once.indexOf(done);
    if (idx !== -1) {
        arr.once.splice(idx, 1);
    }
};

/**
 * Emits the specified event on the specified channel
 * @param ch channel name
 * @param e event name
 * @param data event data
 */
module.exports.emit = function (ch, e, data) {
    var o = event(ch, e);
    var args = Array.prototype.slice.call(arguments, 2);
    o.on.forEach(function (done) {
        done.apply(done, args);
    });
    o.once.forEach(function (done) {
        done.apply(done, args);
    });
    o.once = [];
};
