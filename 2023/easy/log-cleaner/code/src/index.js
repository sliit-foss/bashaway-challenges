const _fnName = (fn) => {
    let name = fn.name;
    while (1) {
        const replaced = name?.replace("bound", ""); 
        if (name.startsWith("bound") && replaced?.startsWith(" "))(name = replaced?.trim());
        else break;
    }
    if (!name) return "Unnamed function";
    if (name.startsWith(" ")) return name.slice(1);
    return name;
};

const _traced = (fn, loggable = {}, fnName) => {
    let startTime;
    const disableTracing = process.env.DISABLE_FUNCTION_TRACING === "true" || process.env.DISABLE_FUNCTION_TRACING === "1";
    if (!disableTracing) {
        fnName = fnName ?? _fnName(fn);
        console.info(`${fnName} execution initiated`, loggable);
        startTime = Date.now();
    } else {
        console.log("Tracing disabled");
    }
    const completionLog = () => {
        !disableTracing &&
            console.info(`${fnName} execution completed - execution_time : ${Date.now() - startTime}ms`, loggable);
    };
    const failureLog = (err) => {
        if (!disableTracing && !err.isLogged) {
            console.error(`${fnName} execution failed - error: ${err.message} - stack: ${err.stack}`);
            err.isLogged = true;
        } else {
            console.log("Tracing disabled",
                "error previously logged ? ", !!err.isLogged
            );
        }
        throw err;
    };
    try {
        const result = fn();
        if (result instanceof Promise) {
            return result
                .then((res) => {
                    completionLog();
                    return res;
                })
                .catch(failureLog);
        }
        completionLog();
        return result;
    } catch (err) {
        failureLog(err);
    }
};

const traced =
    (fn, loggable) =>
        (...params) =>
            _traced(fn.bind(this, ...params), loggable);

const trace = (fn, loggable) => _traced(fn, loggable);

module.exports = {
    traced,
    trace,
};

console.info("Hello World")