const Logger = (() => {
    const isDebug = true; // set false for production

    function timestamp() {
        return new Date().toLocaleTimeString();
    }

    function log(level, message, ...args) {
        if (!isDebug) return;
        const color = {
            info: "color: dodgerblue",
            warn: "color: orange",
            error: "color: red",
            debug: "color: gray"
        }[level] || "color: white";
        console.log(`%c[${timestamp()}] [${level.toUpperCase()}]`, color, message, ...args);
    }

    return {
        info: (msg, ...args) => log("info", msg, ...args),
        warn: (msg, ...args) => log("warn", msg, ...args),
        error: (msg, ...args) => log("error", msg, ...args),
        debug: (msg, ...args) => log("debug", msg, ...args),
    };
})();