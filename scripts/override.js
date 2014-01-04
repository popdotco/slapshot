var ConsoleOverride = {

    /**
     * Stored console log messages.
     */
    messages: [],

    /**
     * Inintialize the override.
     */
    init: function() {
        this.overrideConsoleLog();
        this.bindWindowClose();
    },

    /**
     * Handle storing all console.log data in an array, already in string format.
     */
    overrideConsoleLog: function() {
        var that = this,
            exists = typeof console != 'undefined',
            _console = exists ? console.log : null;

        // new console log function
        console.log = function() {
            var msg;

            if (
                (Array.prototype.slice.call(arguments)).length == 1
                && typeof Array.prototype.slice.call(arguments)[0] == 'string'
            ) {
                msg = (Array.prototype.slice.call(arguments)).toString();
            } else {
                try {
                    msg = JSON.stringify(Array.prototype.slice.call(arguments));
                } catch (e) {
                    msg = Array.prototype.slice.call(arguments);
                }
            }

            that.messages.append(msg);

            if (_console) {
                _console.apply(console, arguments);
            }
        }
    },

    /**
     * Write to file when the window closes (or url changes, or refresh issued).
     */
    bindWindowClose: function() {
        var self = this;

        window.onbeforeunload = function() {
            self.savetoFile();
            return 'Saving console.log history to file: ' + filename;
        }
    },

    /**
     * Handle actual file save.
     */
    saveToFile: function() {
        var filename = window.location.hostname + '-' + window.location.pathname.replace('/', '_'),
            uriContent = "data:application/octet-stream," + encodeURIComponent(this.messages),
            newWindow;

        // add timestamp to filename
        filename += '-' + new Date().getTime() + '.log',

        // trigger new window for download
        newWindow = window.open(uriContent, filename);
    }

};

// run the console override when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ConsoleOverride.init();
});
