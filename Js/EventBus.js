/* This file is released under the CeCILL-B V1 licence.*/

/**
 *	Light event bus
 *
 *	It use recents Dom CustomEvents.
 *	The window.top.* is the key of an use with iframes
 *
 *	@class EventBus
 */
var EventBus = {
	prefix: 'i15e.',
	/**
	 *	Add a new listener.
	 *
	 *	@method addListener
	 *	@param {String}	name The event name
	 *	@param {Function}	method The function to execute
	 *	@param {Object}	caller	An instance reference, given in parameter to method
	 *	@return {Function} The generated callback method (to use with removeListener)
	 */
	addListener: function(name, method, caller) {
		var callback = function(e) {
			// If the page still exist
			if (self !== null && document !== null)
				method(e.detail, caller, e);
		};
		window.top.addEventListener(this.prefix+name, callback);
		return callback;
	},
	/**
	 *	Remove a registered listener.
	 *
	 *	@method removeListener
	 *	@param {String} name The event name
	 *	@param {Function} callback The function returned by addListener.
	 */
	removeListener: function(name, callback) {
		window.top.removeEventListener(this.prefix+name, method);
	},
	/**
	 *	Send an event into the bus.
	 *
	 *	@method send
	 *	@param {String} name The event name
	 *	@param {Object} data Data to send with the event
	 */
	send: function(name, data) {
		var e = new CustomEvent(this.prefix+name, {detail: data});
		window.top.dispatchEvent(e);
	},
	/**
	 *	Send an event into the bus in a short delay.
	 *
	 *	It can be usefull for sending an event after the execution of all
	 *	currents events in the stack.
	 *
	 *	@method sendDelayed
	 *	@param {String} name The event name
	 *	@param {Object} data Data to send with the event
	 */
	sendDelayed: function(name, data) {
		window.setTimeout(function(){
			EventBus.send(name, data);
		}, 1);
	},
	/**
	 *	Add a list of listeners.
	 *
	 *	The list is a object, the keys are the name of the listeners, and the
	 *	values are functions.
	 *
	 *	@method addListeners
	 *	@param {Object} listeners The list of listeners
	 *	@param {Object}	caller	An instance reference, given in parameter to each method
	 *	@return {Array} The list of generated callback methods (to use with removeListener)
	 */
	addListeners: function(listeners, caller) {
		var r = [];
		for (var key in listeners)
			r.push(this.addListener(key, listeners[key], caller));
		return r;
	}
};
