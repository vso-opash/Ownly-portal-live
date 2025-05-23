(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else {
        var g;
        if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this }
        g.io = f() } })(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e) }, l, l.exports, e, t, n, r) }
            return n[o].exports }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s }({
        1: [function(_dereq_, module, exports) { module.exports = _dereq_("./lib/") }, { "./lib/": 2 }],
        2: [function(_dereq_, module, exports) { module.exports = _dereq_("./socket");
            module.exports.parser = _dereq_("engine.io-parser") }, { "./socket": 3, "engine.io-parser": 19 }],
        3: [function(_dereq_, module, exports) {
            (function(global) {
                var transports = _dereq_("./transports");
                var Emitter = _dereq_("component-emitter");
                var debug = _dereq_("debug")("engine.io-client:socket");
                var index = _dereq_("indexof");
                var parser = _dereq_("engine.io-parser");
                var parseuri = _dereq_("parseuri");
                var parsejson = _dereq_("parsejson");
                var parseqs = _dereq_("parseqs");
                module.exports = Socket;

                function noop() {}

                function Socket(uri, opts) {
                    if (!(this instanceof Socket)) return new Socket(uri, opts);
                    opts = opts || {};
                    if (uri && "object" == typeof uri) { opts = uri;
                        uri = null }
                    if (uri) { uri = parseuri(uri);
                        opts.hostname = uri.host;
                        opts.secure = uri.protocol == "https" || uri.protocol == "wss";
                        opts.port = uri.port;
                        if (uri.query) opts.query = uri.query } else if (opts.host) { opts.hostname = parseuri(opts.host).host }
                    this.secure = null != opts.secure ? opts.secure : global.location && "https:" == location.protocol;
                    if (opts.hostname && !opts.port) { opts.port = this.secure ? "443" : "80" }
                    this.agent = opts.agent || false;
                    this.hostname = opts.hostname || (global.location ? location.hostname : "localhost");
                    this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80);
                    this.query = opts.query || {};
                    if ("string" == typeof this.query) this.query = parseqs.decode(this.query);
                    this.upgrade = false !== opts.upgrade;
                    this.path = (opts.path || "/engine.io").replace(/\/$/, "") + "/";
                    this.forceJSONP = !!opts.forceJSONP;
                    this.jsonp = false !== opts.jsonp;
                    this.forceBase64 = !!opts.forceBase64;
                    this.enablesXDR = !!opts.enablesXDR;
                    this.timestampParam = opts.timestampParam || "t";
                    this.timestampRequests = opts.timestampRequests;
                    this.transports = opts.transports || ["polling", "websocket"];
                    this.readyState = "";
                    this.writeBuffer = [];
                    this.policyPort = opts.policyPort || 843;
                    this.rememberUpgrade = opts.rememberUpgrade || false;
                    this.binaryType = null;
                    this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
                    this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;
                    if (true === this.perMessageDeflate) this.perMessageDeflate = {};
                    if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) { this.perMessageDeflate.threshold = 1024 }
                    this.pfx = opts.pfx || null;
                    this.key = opts.key || null;
                    this.passphrase = opts.passphrase || null;
                    this.cert = opts.cert || null;
                    this.ca = opts.ca || null;
                    this.ciphers = opts.ciphers || null;
                    this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;
                    var freeGlobal = typeof global == "object" && global;
                    if (freeGlobal.global === freeGlobal) {
                        if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) { this.extraHeaders = opts.extraHeaders } }
                    this.open() }
                Socket.priorWebsocketSuccess = false;
                Emitter(Socket.prototype);
                Socket.protocol = parser.protocol;
                Socket.Socket = Socket;
                Socket.Transport = _dereq_("./transport");
                Socket.transports = _dereq_("./transports");
                Socket.parser = _dereq_("engine.io-parser");
                Socket.prototype.createTransport = function(name) { debug('creating transport "%s"', name);
                    var query = clone(this.query);
                    query.EIO = parser.protocol;
                    query.transport = name;
                    if (this.id) query.sid = this.id;
                    var transport = new transports[name]({ agent: this.agent, hostname: this.hostname, port: this.port, secure: this.secure, path: this.path, query: query, forceJSONP: this.forceJSONP, jsonp: this.jsonp, forceBase64: this.forceBase64, enablesXDR: this.enablesXDR, timestampRequests: this.timestampRequests, timestampParam: this.timestampParam, policyPort: this.policyPort, socket: this, pfx: this.pfx, key: this.key, passphrase: this.passphrase, cert: this.cert, ca: this.ca, ciphers: this.ciphers, rejectUnauthorized: this.rejectUnauthorized, perMessageDeflate: this.perMessageDeflate, extraHeaders: this.extraHeaders });
                    return transport };

                function clone(obj) {
                    var o = {};
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) { o[i] = obj[i] } }
                    return o }
                Socket.prototype.open = function() {
                    var transport;
                    if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) { transport = "websocket" } else if (0 === this.transports.length) {
                        var self = this;
                        setTimeout(function() { self.emit("error", "No transports available") }, 0);
                        return } else { transport = this.transports[0] }
                    this.readyState = "opening";
                    try { transport = this.createTransport(transport) } catch (e) { this.transports.shift();
                        this.open();
                        return }
                    transport.open();
                    this.setTransport(transport) };
                Socket.prototype.setTransport = function(transport) { debug("setting transport %s", transport.name);
                    var self = this;
                    if (this.transport) { debug("clearing existing transport %s", this.transport.name);
                        this.transport.removeAllListeners() }
                    this.transport = transport;
                    transport.on("drain", function() { self.onDrain() }).on("packet", function(packet) { self.onPacket(packet) }).on("error", function(e) { self.onError(e) }).on("close", function() { self.onClose("transport close") }) };
                Socket.prototype.probe = function(name) { debug('probing transport "%s"', name);
                    var transport = this.createTransport(name, { probe: 1 }),
                        failed = false,
                        self = this;
                    Socket.priorWebsocketSuccess = false;

                    function onTransportOpen() {
                        if (self.onlyBinaryUpgrades) {
                            var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                            failed = failed || upgradeLosesBinary }
                        if (failed) return;
                        debug('probe transport "%s" opened', name);
                        transport.send([{ type: "ping", data: "probe" }]);
                        transport.once("packet", function(msg) {
                            if (failed) return;
                            if ("pong" == msg.type && "probe" == msg.data) { debug('probe transport "%s" pong', name);
                                self.upgrading = true;
                                self.emit("upgrading", transport);
                                if (!transport) return;
                                Socket.priorWebsocketSuccess = "websocket" == transport.name;
                                debug('pausing current transport "%s"', self.transport.name);
                                self.transport.pause(function() {
                                    if (failed) return;
                                    if ("closed" == self.readyState) return;
                                    debug("changing transport and sending upgrade packet");
                                    cleanup();
                                    self.setTransport(transport);
                                    transport.send([{ type: "upgrade" }]);
                                    self.emit("upgrade", transport);
                                    transport = null;
                                    self.upgrading = false;
                                    self.flush() }) } else { debug('probe transport "%s" failed', name);
                                var err = new Error("probe error");
                                err.transport = transport.name;
                                self.emit("upgradeError", err) } }) }

                    function freezeTransport() {
                        if (failed) return;
                        failed = true;
                        cleanup();
                        transport.close();
                        transport = null }

                    function onerror(err) {
                        var error = new Error("probe error: " + err);
                        error.transport = transport.name;
                        freezeTransport();
                        debug('probe transport "%s" failed because of error: %s', name, err);
                        self.emit("upgradeError", error) }

                    function onTransportClose() { onerror("transport closed") }

                    function onclose() { onerror("socket closed") }

                    function onupgrade(to) {
                        if (transport && to.name != transport.name) { debug('"%s" works - aborting "%s"', to.name, transport.name);
                            freezeTransport() } }

                    function cleanup() { transport.removeListener("open", onTransportOpen);
                        transport.removeListener("error", onerror);
                        transport.removeListener("close", onTransportClose);
                        self.removeListener("close", onclose);
                        self.removeListener("upgrading", onupgrade) }
                    transport.once("open", onTransportOpen);
                    transport.once("error", onerror);
                    transport.once("close", onTransportClose);
                    this.once("close", onclose);
                    this.once("upgrading", onupgrade);
                    transport.open() };
                Socket.prototype.onOpen = function() { debug("socket open");
                    this.readyState = "open";
                    Socket.priorWebsocketSuccess = "websocket" == this.transport.name;
                    this.emit("open");
                    this.flush();
                    if ("open" == this.readyState && this.upgrade && this.transport.pause) { debug("starting upgrade probes");
                        for (var i = 0, l = this.upgrades.length; i < l; i++) { this.probe(this.upgrades[i]) } } };
                Socket.prototype.onPacket = function(packet) {
                    if ("opening" == this.readyState || "open" == this.readyState) { debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
                        this.emit("packet", packet);
                        this.emit("heartbeat");
                        switch (packet.type) {
                            case "open":
                                this.onHandshake(parsejson(packet.data));
                                break;
                            case "pong":
                                this.setPing();
                                this.emit("pong");
                                break;
                            case "error":
                                var err = new Error("server error");
                                err.code = packet.data;
                                this.onError(err);
                                break;
                            case "message":
                                this.emit("data", packet.data);
                                this.emit("message", packet.data);
                                break } } else { debug('packet received with socket readyState "%s"', this.readyState) } };
                Socket.prototype.onHandshake = function(data) { this.emit("handshake", data);
                    this.id = data.sid;
                    this.transport.query.sid = data.sid;
                    this.upgrades = this.filterUpgrades(data.upgrades);
                    this.pingInterval = data.pingInterval;
                    this.pingTimeout = data.pingTimeout;
                    this.onOpen();
                    if ("closed" == this.readyState) return;
                    this.setPing();
                    this.removeListener("heartbeat", this.onHeartbeat);
                    this.on("heartbeat", this.onHeartbeat) };
                Socket.prototype.onHeartbeat = function(timeout) { clearTimeout(this.pingTimeoutTimer);
                    var self = this;
                    self.pingTimeoutTimer = setTimeout(function() {
                        if ("closed" == self.readyState) return;
                        self.onClose("ping timeout") }, timeout || self.pingInterval + self.pingTimeout) };
                Socket.prototype.setPing = function() {
                    var self = this;
                    clearTimeout(self.pingIntervalTimer);
                    self.pingIntervalTimer = setTimeout(function() { debug("writing ping packet - expecting pong within %sms", self.pingTimeout);
                        self.ping();
                        self.onHeartbeat(self.pingTimeout) }, self.pingInterval) };
                Socket.prototype.ping = function() {
                    var self = this;
                    this.sendPacket("ping", function() { self.emit("ping") }) };
                Socket.prototype.onDrain = function() { this.writeBuffer.splice(0, this.prevBufferLen);
                    this.prevBufferLen = 0;
                    if (0 === this.writeBuffer.length) { this.emit("drain") } else { this.flush() } };
                Socket.prototype.flush = function() {
                    if ("closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) { debug("flushing %d packets in socket", this.writeBuffer.length);
                        this.transport.send(this.writeBuffer);
                        this.prevBufferLen = this.writeBuffer.length;
                        this.emit("flush") } };
                Socket.prototype.write = Socket.prototype.send = function(msg, options, fn) { this.sendPacket("message", msg, options, fn);
                    return this };
                Socket.prototype.sendPacket = function(type, data, options, fn) {
                    if ("function" == typeof data) { fn = data;
                        data = undefined }
                    if ("function" == typeof options) { fn = options;
                        options = null }
                    if ("closing" == this.readyState || "closed" == this.readyState) {
                        return }
                    options = options || {};
                    options.compress = false !== options.compress;
                    var packet = { type: type, data: data, options: options };
                    this.emit("packetCreate", packet);
                    this.writeBuffer.push(packet);
                    if (fn) this.once("flush", fn);
                    this.flush() };
                Socket.prototype.close = function() {
                    if ("opening" == this.readyState || "open" == this.readyState) { this.readyState = "closing";
                        var self = this;
                        if (this.writeBuffer.length) { this.once("drain", function() {
                                if (this.upgrading) { waitForUpgrade() } else { close() } }) } else if (this.upgrading) { waitForUpgrade() } else { close() } }

                    function close() { self.onClose("forced close");
                        debug("socket closing - telling transport to close");
                        self.transport.close() }

                    function cleanupAndClose() { self.removeListener("upgrade", cleanupAndClose);
                        self.removeListener("upgradeError", cleanupAndClose);
                        close() }

                    function waitForUpgrade() { self.once("upgrade", cleanupAndClose);
                        self.once("upgradeError", cleanupAndClose) }
                    return this };
                Socket.prototype.onError = function(err) { debug("socket error %j", err);
                    Socket.priorWebsocketSuccess = false;
                    this.emit("error", err);
                    this.onClose("transport error", err) };
                Socket.prototype.onClose = function(reason, desc) {
                    if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) { debug('socket close with reason: "%s"', reason);
                        var self = this;
                        clearTimeout(this.pingIntervalTimer);
                        clearTimeout(this.pingTimeoutTimer);
                        this.transport.removeAllListeners("close");
                        this.transport.close();
                        this.transport.removeAllListeners();
                        this.readyState = "closed";
                        this.id = null;
                        this.emit("close", reason, desc);
                        self.writeBuffer = [];
                        self.prevBufferLen = 0 } };
                Socket.prototype.filterUpgrades = function(upgrades) {
                    var filteredUpgrades = [];
                    for (var i = 0, j = upgrades.length; i < j; i++) {
                        if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]) }
                    return filteredUpgrades } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./transport": 4, "./transports": 5, "component-emitter": 15, debug: 17, "engine.io-parser": 19, indexof: 23, parsejson: 26, parseqs: 27, parseuri: 28 }],
        4: [function(_dereq_, module, exports) {
            var parser = _dereq_("engine.io-parser");
            var Emitter = _dereq_("component-emitter");
            module.exports = Transport;

            function Transport(opts) { this.path = opts.path;
                this.hostname = opts.hostname;
                this.port = opts.port;
                this.secure = opts.secure;
                this.query = opts.query;
                this.timestampParam = opts.timestampParam;
                this.timestampRequests = opts.timestampRequests;
                this.readyState = "";
                this.agent = opts.agent || false;
                this.socket = opts.socket;
                this.enablesXDR = opts.enablesXDR;
                this.pfx = opts.pfx;
                this.key = opts.key;
                this.passphrase = opts.passphrase;
                this.cert = opts.cert;
                this.ca = opts.ca;
                this.ciphers = opts.ciphers;
                this.rejectUnauthorized = opts.rejectUnauthorized;
                this.extraHeaders = opts.extraHeaders }
            Emitter(Transport.prototype);
            Transport.prototype.onError = function(msg, desc) {
                var err = new Error(msg);
                err.type = "TransportError";
                err.description = desc;
                this.emit("error", err);
                return this };
            Transport.prototype.open = function() {
                if ("closed" == this.readyState || "" == this.readyState) { this.readyState = "opening";
                    this.doOpen() }
                return this };
            Transport.prototype.close = function() {
                if ("opening" == this.readyState || "open" == this.readyState) { this.doClose();
                    this.onClose() }
                return this };
            Transport.prototype.send = function(packets) {
                if ("open" == this.readyState) { this.write(packets) } else {
                    throw new Error("Transport not open") } };
            Transport.prototype.onOpen = function() { this.readyState = "open";
                this.writable = true;
                this.emit("open") };
            Transport.prototype.onData = function(data) {
                var packet = parser.decodePacket(data, this.socket.binaryType);
                this.onPacket(packet) };
            Transport.prototype.onPacket = function(packet) { this.emit("packet", packet) };
            Transport.prototype.onClose = function() { this.readyState = "closed";
                this.emit("close") } }, { "component-emitter": 15, "engine.io-parser": 19 }],
        5: [function(_dereq_, module, exports) {
            (function(global) {
                var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
                var XHR = _dereq_("./polling-xhr");
                var JSONP = _dereq_("./polling-jsonp");
                var websocket = _dereq_("./websocket");
                exports.polling = polling;
                exports.websocket = websocket;

                function polling(opts) {
                    var xhr;
                    var xd = false;
                    var xs = false;
                    var jsonp = false !== opts.jsonp;
                    if (global.location) {
                        var isSSL = "https:" == location.protocol;
                        var port = location.port;
                        if (!port) { port = isSSL ? 443 : 80 }
                        xd = opts.hostname != location.hostname || port != opts.port;
                        xs = opts.secure != isSSL }
                    opts.xdomain = xd;
                    opts.xscheme = xs;
                    xhr = new XMLHttpRequest(opts);
                    if ("open" in xhr && !opts.forceJSONP) {
                        return new XHR(opts) } else {
                        if (!jsonp) throw new Error("JSONP disabled");
                        return new JSONP(opts) } } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./polling-jsonp": 6, "./polling-xhr": 7, "./websocket": 9, "xmlhttprequest-ssl": 10 }],
        6: [function(_dereq_, module, exports) {
            (function(global) {
                var Polling = _dereq_("./polling");
                var inherit = _dereq_("component-inherit");
                module.exports = JSONPPolling;
                var rNewline = /\n/g;
                var rEscapedNewline = /\\n/g;
                var callbacks;
                var index = 0;

                function empty() {}

                function JSONPPolling(opts) { Polling.call(this, opts);
                    this.query = this.query || {};
                    if (!callbacks) {
                        if (!global.___eio) global.___eio = [];
                        callbacks = global.___eio }
                    this.index = callbacks.length;
                    var self = this;
                    callbacks.push(function(msg) { self.onData(msg) });
                    this.query.j = this.index;
                    if (global.document && global.addEventListener) { global.addEventListener("beforeunload", function() {
                            if (self.script) self.script.onerror = empty }, false) } }
                inherit(JSONPPolling, Polling);
                JSONPPolling.prototype.supportsBinary = false;
                JSONPPolling.prototype.doClose = function() {
                    if (this.script) { this.script.parentNode.removeChild(this.script);
                        this.script = null }
                    if (this.form) { this.form.parentNode.removeChild(this.form);
                        this.form = null;
                        this.iframe = null }
                    Polling.prototype.doClose.call(this) };
                JSONPPolling.prototype.doPoll = function() {
                    var self = this;
                    var script = document.createElement("script");
                    if (this.script) { this.script.parentNode.removeChild(this.script);
                        this.script = null }
                    script.async = true;
                    script.src = this.uri();
                    script.onerror = function(e) { self.onError("jsonp poll error", e) };
                    var insertAt = document.getElementsByTagName("script")[0];
                    if (insertAt) { insertAt.parentNode.insertBefore(script, insertAt) } else {
                        (document.head || document.body).appendChild(script) }
                    this.script = script;
                    var isUAgecko = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                    if (isUAgecko) { setTimeout(function() {
                            var iframe = document.createElement("iframe");
                            document.body.appendChild(iframe);
                            document.body.removeChild(iframe) }, 100) } };
                JSONPPolling.prototype.doWrite = function(data, fn) {
                    var self = this;
                    if (!this.form) {
                        var form = document.createElement("form");
                        var area = document.createElement("textarea");
                        var id = this.iframeId = "eio_iframe_" + this.index;
                        var iframe;
                        form.className = "socketio";
                        form.style.position = "absolute";
                        form.style.top = "-1000px";
                        form.style.left = "-1000px";
                        form.target = id;
                        form.method = "POST";
                        form.setAttribute("accept-charset", "utf-8");
                        area.name = "d";
                        form.appendChild(area);
                        document.body.appendChild(form);
                        this.form = form;
                        this.area = area }
                    this.form.action = this.uri();

                    function complete() { initIframe();
                        fn() }

                    function initIframe() {
                        if (self.iframe) {
                            try { self.form.removeChild(self.iframe) } catch (e) { self.onError("jsonp polling iframe removal error", e) } }
                        try {
                            var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
                            iframe = document.createElement(html) } catch (e) { iframe = document.createElement("iframe");
                            iframe.name = self.iframeId;
                            iframe.src = "javascript:0" }
                        iframe.id = self.iframeId;
                        self.form.appendChild(iframe);
                        self.iframe = iframe }
                    initIframe();
                    data = data.replace(rEscapedNewline, "\\\n");
                    this.area.value = data.replace(rNewline, "\\n");
                    try { this.form.submit() } catch (e) {}
                    if (this.iframe.attachEvent) { this.iframe.onreadystatechange = function() {
                            if (self.iframe.readyState == "complete") { complete() } } } else { this.iframe.onload = complete } } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./polling": 8, "component-inherit": 16 }],
        7: [function(_dereq_, module, exports) {
            (function(global) {
                var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
                var Polling = _dereq_("./polling");
                var Emitter = _dereq_("component-emitter");
                var inherit = _dereq_("component-inherit");
                var debug = _dereq_("debug")("engine.io-client:polling-xhr");
                module.exports = XHR;
                module.exports.Request = Request;

                function empty() {}

                function XHR(opts) { Polling.call(this, opts);
                    if (global.location) {
                        var isSSL = "https:" == location.protocol;
                        var port = location.port;
                        if (!port) { port = isSSL ? 443 : 80 }
                        this.xd = opts.hostname != global.location.hostname || port != opts.port;
                        this.xs = opts.secure != isSSL } else { this.extraHeaders = opts.extraHeaders } }
                inherit(XHR, Polling);
                XHR.prototype.supportsBinary = true;
                XHR.prototype.request = function(opts) { opts = opts || {};
                    opts.uri = this.uri();
                    opts.xd = this.xd;
                    opts.xs = this.xs;
                    opts.agent = this.agent || false;
                    opts.supportsBinary = this.supportsBinary;
                    opts.enablesXDR = this.enablesXDR;
                    opts.pfx = this.pfx;
                    opts.key = this.key;
                    opts.passphrase = this.passphrase;
                    opts.cert = this.cert;
                    opts.ca = this.ca;
                    opts.ciphers = this.ciphers;
                    opts.rejectUnauthorized = this.rejectUnauthorized;
                    opts.extraHeaders = this.extraHeaders;
                    return new Request(opts) };
                XHR.prototype.doWrite = function(data, fn) {
                    var isBinary = typeof data !== "string" && data !== undefined;
                    var req = this.request({ method: "POST", data: data, isBinary: isBinary });
                    var self = this;
                    req.on("success", fn);
                    req.on("error", function(err) { self.onError("xhr post error", err) });
                    this.sendXhr = req };
                XHR.prototype.doPoll = function() { debug("xhr poll");
                    var req = this.request();
                    var self = this;
                    req.on("data", function(data) { self.onData(data) });
                    req.on("error", function(err) { self.onError("xhr poll error", err) });
                    this.pollXhr = req };

                function Request(opts) { this.method = opts.method || "GET";
                    this.uri = opts.uri;
                    this.xd = !!opts.xd;
                    this.xs = !!opts.xs;
                    this.async = false !== opts.async;
                    this.data = undefined != opts.data ? opts.data : null;
                    this.agent = opts.agent;
                    this.isBinary = opts.isBinary;
                    this.supportsBinary = opts.supportsBinary;
                    this.enablesXDR = opts.enablesXDR;
                    this.pfx = opts.pfx;
                    this.key = opts.key;
                    this.passphrase = opts.passphrase;
                    this.cert = opts.cert;
                    this.ca = opts.ca;
                    this.ciphers = opts.ciphers;
                    this.rejectUnauthorized = opts.rejectUnauthorized;
                    this.extraHeaders = opts.extraHeaders;
                    this.create() }
                Emitter(Request.prototype);
                Request.prototype.create = function() {
                    var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };
                    opts.pfx = this.pfx;
                    opts.key = this.key;
                    opts.passphrase = this.passphrase;
                    opts.cert = this.cert;
                    opts.ca = this.ca;
                    opts.ciphers = this.ciphers;
                    opts.rejectUnauthorized = this.rejectUnauthorized;
                    var xhr = this.xhr = new XMLHttpRequest(opts);
                    var self = this;
                    try { debug("xhr open %s: %s", this.method, this.uri);
                        xhr.open(this.method, this.uri, this.async);
                        try {
                            if (this.extraHeaders) { xhr.setDisableHeaderCheck(true);
                                for (var i in this.extraHeaders) {
                                    if (this.extraHeaders.hasOwnProperty(i)) { xhr.setRequestHeader(i, this.extraHeaders[i]) } } } } catch (e) {}
                        if (this.supportsBinary) { xhr.responseType = "arraybuffer" }
                        if ("POST" == this.method) {
                            try {
                                if (this.isBinary) { xhr.setRequestHeader("Content-type", "application/octet-stream") } else { xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8") } } catch (e) {} }
                        if ("withCredentials" in xhr) { xhr.withCredentials = true }
                        if (this.hasXDR()) { xhr.onload = function() { self.onLoad() };
                            xhr.onerror = function() { self.onError(xhr.responseText) } } else { xhr.onreadystatechange = function() {
                                if (4 != xhr.readyState) return;
                                if (200 == xhr.status || 1223 == xhr.status) { self.onLoad() } else { setTimeout(function() { self.onError(xhr.status) }, 0) } } }
                        debug("xhr data %s", this.data);
                        xhr.send(this.data) } catch (e) { setTimeout(function() { self.onError(e) }, 0);
                        return }
                    if (global.document) { this.index = Request.requestsCount++;
                        Request.requests[this.index] = this } };
                Request.prototype.onSuccess = function() { this.emit("success");
                    this.cleanup() };
                Request.prototype.onData = function(data) { this.emit("data", data);
                    this.onSuccess() };
                Request.prototype.onError = function(err) { this.emit("error", err);
                    this.cleanup(true) };
                Request.prototype.cleanup = function(fromError) {
                    if ("undefined" == typeof this.xhr || null === this.xhr) {
                        return }
                    if (this.hasXDR()) { this.xhr.onload = this.xhr.onerror = empty } else { this.xhr.onreadystatechange = empty }
                    if (fromError) {
                        try { this.xhr.abort() } catch (e) {} }
                    if (global.document) { delete Request.requests[this.index] }
                    this.xhr = null };
                Request.prototype.onLoad = function() {
                    var data;
                    try {
                        var contentType;
                        try { contentType = this.xhr.getResponseHeader("Content-Type").split(";")[0] } catch (e) {}
                        if (contentType === "application/octet-stream") { data = this.xhr.response } else {
                            if (!this.supportsBinary) { data = this.xhr.responseText } else {
                                try { data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response)) } catch (e) {
                                    var ui8Arr = new Uint8Array(this.xhr.response);
                                    var dataArray = [];
                                    for (var idx = 0, length = ui8Arr.length; idx < length; idx++) { dataArray.push(ui8Arr[idx]) }
                                    data = String.fromCharCode.apply(null, dataArray) } } } } catch (e) { this.onError(e) }
                    if (null != data) { this.onData(data) } };
                Request.prototype.hasXDR = function() {
                    return "undefined" !== typeof global.XDomainRequest && !this.xs && this.enablesXDR };
                Request.prototype.abort = function() { this.cleanup() };
                if (global.document) { Request.requestsCount = 0;
                    Request.requests = {};
                    if (global.attachEvent) { global.attachEvent("onunload", unloadHandler) } else if (global.addEventListener) { global.addEventListener("beforeunload", unloadHandler, false) } }

                function unloadHandler() {
                    for (var i in Request.requests) {
                        if (Request.requests.hasOwnProperty(i)) { Request.requests[i].abort() } } } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./polling": 8, "component-emitter": 15, "component-inherit": 16, debug: 17, "xmlhttprequest-ssl": 10 }],
        8: [function(_dereq_, module, exports) {
            var Transport = _dereq_("../transport");
            var parseqs = _dereq_("parseqs");
            var parser = _dereq_("engine.io-parser");
            var inherit = _dereq_("component-inherit");
            var yeast = _dereq_("yeast");
            var debug = _dereq_("debug")("engine.io-client:polling");
            module.exports = Polling;
            var hasXHR2 = function() {
                var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
                var xhr = new XMLHttpRequest({ xdomain: false });
                return null != xhr.responseType }();

            function Polling(opts) {
                var forceBase64 = opts && opts.forceBase64;
                if (!hasXHR2 || forceBase64) { this.supportsBinary = false }
                Transport.call(this, opts) }
            inherit(Polling, Transport);
            Polling.prototype.name = "polling";
            Polling.prototype.doOpen = function() { this.poll() };
            Polling.prototype.pause = function(onPause) {
                var pending = 0;
                var self = this;
                this.readyState = "pausing";

                function pause() { debug("paused");
                    self.readyState = "paused";
                    onPause() }
                if (this.polling || !this.writable) {
                    var total = 0;
                    if (this.polling) { debug("we are currently polling - waiting to pause");
                        total++;
                        this.once("pollComplete", function() { debug("pre-pause polling complete");--total || pause() }) }
                    if (!this.writable) { debug("we are currently writing - waiting to pause");
                        total++;
                        this.once("drain", function() { debug("pre-pause writing complete");--total || pause() }) } } else { pause() } };
            Polling.prototype.poll = function() { debug("polling");
                this.polling = true;
                this.doPoll();
                this.emit("poll") };
            Polling.prototype.onData = function(data) {
                var self = this;
                debug("polling got data %s", data);
                var callback = function(packet, index, total) {
                    if ("opening" == self.readyState) { self.onOpen() }
                    if ("close" == packet.type) { self.onClose();
                        return false }
                    self.onPacket(packet) };
                parser.decodePayload(data, this.socket.binaryType, callback);
                if ("closed" != this.readyState) { this.polling = false;
                    this.emit("pollComplete");
                    if ("open" == this.readyState) { this.poll() } else { debug('ignoring poll - transport state "%s"', this.readyState) } } };
            Polling.prototype.doClose = function() {
                var self = this;

                function close() { debug("writing close packet");
                    self.write([{ type: "close" }]) }
                if ("open" == this.readyState) { debug("transport open - closing");
                    close() } else { debug("transport not open - deferring close");
                    this.once("open", close) } };
            Polling.prototype.write = function(packets) {
                var self = this;
                this.writable = false;
                var callbackfn = function() { self.writable = true;
                    self.emit("drain") };
                var self = this;
                parser.encodePayload(packets, this.supportsBinary, function(data) { self.doWrite(data, callbackfn) }) };
            Polling.prototype.uri = function() {
                var query = this.query || {};
                var schema = this.secure ? "https" : "http";
                var port = "";
                if (false !== this.timestampRequests) { query[this.timestampParam] = yeast() }
                if (!this.supportsBinary && !query.sid) { query.b64 = 1 }
                query = parseqs.encode(query);
                if (this.port && ("https" == schema && this.port != 443 || "http" == schema && this.port != 80)) { port = ":" + this.port }
                if (query.length) { query = "?" + query }
                var ipv6 = this.hostname.indexOf(":") !== -1;
                return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query } }, { "../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, "xmlhttprequest-ssl": 10, yeast: 30 }],
        9: [function(_dereq_, module, exports) {
            (function(global) {
                var Transport = _dereq_("../transport");
                var parser = _dereq_("engine.io-parser");
                var parseqs = _dereq_("parseqs");
                var inherit = _dereq_("component-inherit");
                var yeast = _dereq_("yeast");
                var debug = _dereq_("debug")("engine.io-client:websocket");
                var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
                var WebSocket = BrowserWebSocket;
                if (!WebSocket && typeof window === "undefined") {
                    try { WebSocket = _dereq_("ws") } catch (e) {} }
                module.exports = WS;

                function WS(opts) {
                    var forceBase64 = opts && opts.forceBase64;
                    if (forceBase64) { this.supportsBinary = false }
                    this.perMessageDeflate = opts.perMessageDeflate;
                    Transport.call(this, opts) }
                inherit(WS, Transport);
                WS.prototype.name = "websocket";
                WS.prototype.supportsBinary = true;
                WS.prototype.doOpen = function() {
                    if (!this.check()) {
                        return }
                    var self = this;
                    var uri = this.uri();
                    var protocols = void 0;
                    var opts = { agent: this.agent, perMessageDeflate: this.perMessageDeflate };
                    opts.pfx = this.pfx;
                    opts.key = this.key;
                    opts.passphrase = this.passphrase;
                    opts.cert = this.cert;
                    opts.ca = this.ca;
                    opts.ciphers = this.ciphers;
                    opts.rejectUnauthorized = this.rejectUnauthorized;
                    if (this.extraHeaders) { opts.headers = this.extraHeaders }
                    this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);
                    if (this.ws.binaryType === undefined) { this.supportsBinary = false }
                    if (this.ws.supports && this.ws.supports.binary) { this.supportsBinary = true;
                        this.ws.binaryType = "buffer" } else { this.ws.binaryType = "arraybuffer" }
                    this.addEventListeners() };
                WS.prototype.addEventListeners = function() {
                    var self = this;
                    this.ws.onopen = function() { self.onOpen() };
                    this.ws.onclose = function() { self.onClose() };
                    this.ws.onmessage = function(ev) { self.onData(ev.data) };
                    this.ws.onerror = function(e) { self.onError("websocket error", e) } };
                if ("undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)) { WS.prototype.onData = function(data) {
                        var self = this;
                        setTimeout(function() { Transport.prototype.onData.call(self, data) }, 0) } }
                WS.prototype.write = function(packets) {
                    var self = this;
                    this.writable = false;
                    var total = packets.length;
                    for (var i = 0, l = total; i < l; i++) {
                        (function(packet) { parser.encodePacket(packet, self.supportsBinary, function(data) {
                                if (!BrowserWebSocket) {
                                    var opts = {};
                                    if (packet.options) { opts.compress = packet.options.compress }
                                    if (self.perMessageDeflate) {
                                        var len = "string" == typeof data ? global.Buffer.byteLength(data) : data.length;
                                        if (len < self.perMessageDeflate.threshold) { opts.compress = false } } }
                                try {
                                    if (BrowserWebSocket) { self.ws.send(data) } else { self.ws.send(data, opts) } } catch (e) { debug("websocket closed before onclose event") }--total || done() }) })(packets[i]) }

                    function done() { self.emit("flush");
                        setTimeout(function() { self.writable = true;
                            self.emit("drain") }, 0) } };
                WS.prototype.onClose = function() { Transport.prototype.onClose.call(this) };
                WS.prototype.doClose = function() {
                    if (typeof this.ws !== "undefined") { this.ws.close() } };
                WS.prototype.uri = function() {
                    var query = this.query || {};
                    var schema = this.secure ? "wss" : "ws";
                    var port = "";
                    if (this.port && ("wss" == schema && this.port != 443 || "ws" == schema && this.port != 80)) { port = ":" + this.port }
                    if (this.timestampRequests) { query[this.timestampParam] = yeast() }
                    if (!this.supportsBinary) { query.b64 = 1 }
                    query = parseqs.encode(query);
                    if (query.length) { query = "?" + query }
                    var ipv6 = this.hostname.indexOf(":") !== -1;
                    return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query };
                WS.prototype.check = function() {
                    return !!WebSocket && !("__initialize" in WebSocket && this.name === WS.prototype.name) } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, ws: undefined, yeast: 30 }],
        10: [function(_dereq_, module, exports) {
            var hasCORS = _dereq_("has-cors");
            module.exports = function(opts) {
                var xdomain = opts.xdomain;
                var xscheme = opts.xscheme;
                var enablesXDR = opts.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                        return new XMLHttpRequest } } catch (e) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !xscheme && enablesXDR) {
                        return new XDomainRequest } } catch (e) {}
                if (!xdomain) {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) {} } } }, { "has-cors": 22 }],
        11: [function(_dereq_, module, exports) { module.exports = after;

            function after(count, callback, err_cb) {
                var bail = false;
                err_cb = err_cb || noop;
                proxy.count = count;
                return count === 0 ? callback() : proxy;

                function proxy(err, result) {
                    if (proxy.count <= 0) {
                        throw new Error("after called too many times") }--proxy.count;
                    if (err) { bail = true;
                        callback(err);
                        callback = err_cb } else if (proxy.count === 0 && !bail) { callback(null, result) } } }

            function noop() {} }, {}],
        12: [function(_dereq_, module, exports) { module.exports = function(arraybuffer, start, end) {
                var bytes = arraybuffer.byteLength;
                start = start || 0;
                end = end || bytes;
                if (arraybuffer.slice) {
                    return arraybuffer.slice(start, end) }
                if (start < 0) { start += bytes }
                if (end < 0) { end += bytes }
                if (end > bytes) { end = bytes }
                if (start >= bytes || start >= end || bytes === 0) {
                    return new ArrayBuffer(0) }
                var abv = new Uint8Array(arraybuffer);
                var result = new Uint8Array(end - start);
                for (var i = start, ii = 0; i < end; i++, ii++) { result[ii] = abv[i] }
                return result.buffer } }, {}],
        13: [function(_dereq_, module, exports) {
            (function(chars) {
                "use strict";
                exports.encode = function(arraybuffer) {
                    var bytes = new Uint8Array(arraybuffer),
                        i, len = bytes.length,
                        base64 = "";
                    for (i = 0; i < len; i += 3) {
                        base64 += chars[bytes[i] >> 2];
                        base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
                        base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
                        base64 += chars[bytes[i + 2] & 63]
                    }
                    if (len % 3 === 2) { base64 = base64.substring(0, base64.length - 1) + "=" } else if (len % 3 === 1) { base64 = base64.substring(0, base64.length - 2) + "==" }
                    return base64
                };
                exports.decode = function(base64) {
                    var bufferLength = base64.length * .75,
                        len = base64.length,
                        i, p = 0,
                        encoded1, encoded2, encoded3, encoded4;
                    if (base64[base64.length - 1] === "=") { bufferLength--;
                        if (base64[base64.length - 2] === "=") { bufferLength-- } }
                    var arraybuffer = new ArrayBuffer(bufferLength),
                        bytes = new Uint8Array(arraybuffer);
                    for (i = 0; i < len; i += 4) { encoded1 = chars.indexOf(base64[i]);
                        encoded2 = chars.indexOf(base64[i + 1]);
                        encoded3 = chars.indexOf(base64[i + 2]);
                        encoded4 = chars.indexOf(base64[i + 3]);
                        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
                        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63 }
                    return arraybuffer }
            })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
        }, {}],
        14: [function(_dereq_, module, exports) {
            (function(global) {
                var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;
                var blobSupported = function() {
                    try {
                        var a = new Blob(["hi"]);
                        return a.size === 2 } catch (e) {
                        return false } }();
                var blobSupportsArrayBufferView = blobSupported && function() {
                    try {
                        var b = new Blob([new Uint8Array([1, 2])]);
                        return b.size === 2 } catch (e) {
                        return false } }();
                var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;

                function mapArrayBufferViews(ary) {
                    for (var i = 0; i < ary.length; i++) {
                        var chunk = ary[i];
                        if (chunk.buffer instanceof ArrayBuffer) {
                            var buf = chunk.buffer;
                            if (chunk.byteLength !== buf.byteLength) {
                                var copy = new Uint8Array(chunk.byteLength);
                                copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
                                buf = copy.buffer }
                            ary[i] = buf } } }

                function BlobBuilderConstructor(ary, options) { options = options || {};
                    var bb = new BlobBuilder;
                    mapArrayBufferViews(ary);
                    for (var i = 0; i < ary.length; i++) { bb.append(ary[i]) }
                    return options.type ? bb.getBlob(options.type) : bb.getBlob() }

                function BlobConstructor(ary, options) { mapArrayBufferViews(ary);
                    return new Blob(ary, options || {}) }
                module.exports = function() {
                    if (blobSupported) {
                        return blobSupportsArrayBufferView ? global.Blob : BlobConstructor } else if (blobBuilderSupported) {
                        return BlobBuilderConstructor } else {
                        return undefined } }() }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, {}],
        15: [function(_dereq_, module, exports) { module.exports = Emitter;

            function Emitter(obj) {
                if (obj) return mixin(obj) }

            function mixin(obj) {
                for (var key in Emitter.prototype) { obj[key] = Emitter.prototype[key] }
                return obj }
            Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) { this._callbacks = this._callbacks || {};
                (this._callbacks[event] = this._callbacks[event] || []).push(fn);
                return this };
            Emitter.prototype.once = function(event, fn) {
                var self = this;
                this._callbacks = this._callbacks || {};

                function on() { self.off(event, on);
                    fn.apply(this, arguments) }
                on.fn = fn;
                this.on(event, on);
                return this };
            Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) { this._callbacks = this._callbacks || {};
                if (0 == arguments.length) { this._callbacks = {};
                    return this }
                var callbacks = this._callbacks[event];
                if (!callbacks) return this;
                if (1 == arguments.length) { delete this._callbacks[event];
                    return this }
                var cb;
                for (var i = 0; i < callbacks.length; i++) { cb = callbacks[i];
                    if (cb === fn || cb.fn === fn) { callbacks.splice(i, 1);
                        break } }
                return this };
            Emitter.prototype.emit = function(event) { this._callbacks = this._callbacks || {};
                var args = [].slice.call(arguments, 1),
                    callbacks = this._callbacks[event];
                if (callbacks) { callbacks = callbacks.slice(0);
                    for (var i = 0, len = callbacks.length; i < len; ++i) { callbacks[i].apply(this, args) } }
                return this };
            Emitter.prototype.listeners = function(event) { this._callbacks = this._callbacks || {};
                return this._callbacks[event] || [] };
            Emitter.prototype.hasListeners = function(event) {
                return !!this.listeners(event).length } }, {}],
        16: [function(_dereq_, module, exports) { module.exports = function(a, b) {
                var fn = function() {};
                fn.prototype = b.prototype;
                a.prototype = new fn;
                a.prototype.constructor = a } }, {}],
        17: [function(_dereq_, module, exports) { exports = module.exports = _dereq_("./debug");
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
            exports.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"];

            function useColors() {
                return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 }
            exports.formatters.j = function(v) {
                return JSON.stringify(v) };

            function formatArgs() {
                var args = arguments;
                var useColors = this.useColors;
                args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff);
                if (!useColors) return args;
                var c = "color: " + this.color;
                args = [args[0], c, "color: inherit"].concat(Array.prototype.slice.call(args, 1));
                var index = 0;
                var lastC = 0;
                args[0].replace(/%[a-z%]/g, function(match) {
                    if ("%" === match) return;
                    index++;
                    if ("%c" === match) { lastC = index } });
                args.splice(lastC, 0, c);
                return args }

            function log() {
                return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments) }

            function save(namespaces) {
                try {
                    if (null == namespaces) { exports.storage.removeItem("debug") } else { exports.storage.debug = namespaces } } catch (e) {} }

            function load() {
                var r;
                try { r = exports.storage.debug } catch (e) {}
                return r }
            exports.enable(load());

            function localstorage() {
                try {
                    return window.localStorage } catch (e) {} } }, { "./debug": 18 }],
        18: [function(_dereq_, module, exports) { exports = module.exports = debug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = _dereq_("ms");
            exports.names = [];
            exports.skips = [];
            exports.formatters = {};
            var prevColor = 0;
            var prevTime;

            function selectColor() {
                return exports.colors[prevColor++ % exports.colors.length] }

            function debug(namespace) {
                function disabled() {}
                disabled.enabled = false;

                function enabled() {
                    var self = enabled;
                    var curr = +new Date;
                    var ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;
                    if (null == self.useColors) self.useColors = exports.useColors();
                    if (null == self.color && self.useColors) self.color = selectColor();
                    var args = Array.prototype.slice.call(arguments);
                    args[0] = exports.coerce(args[0]);
                    if ("string" !== typeof args[0]) { args = ["%o"].concat(args) }
                    var index = 0;
                    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
                        if (match === "%") return match;
                        index++;
                        var formatter = exports.formatters[format];
                        if ("function" === typeof formatter) {
                            var val = args[index];
                            match = formatter.call(self, val);
                            args.splice(index, 1);
                            index-- }
                        return match });
                    if ("function" === typeof exports.formatArgs) { args = exports.formatArgs.apply(self, args) }
                    var logFn = enabled.log || exports.log || console.log.bind(console);
                    logFn.apply(self, args) }
                enabled.enabled = true;
                var fn = exports.enabled(namespace) ? enabled : disabled;
                fn.namespace = namespace;
                return fn }

            function enable(namespaces) { exports.save(namespaces);
                var split = (namespaces || "").split(/[\s,]+/);
                var len = split.length;
                for (var i = 0; i < len; i++) {
                    if (!split[i]) continue;
                    namespaces = split[i].replace(/\*/g, ".*?");
                    if (namespaces[0] === "-") { exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$")) } else { exports.names.push(new RegExp("^" + namespaces + "$")) } } }

            function disable() { exports.enable("") }

            function enabled(name) {
                var i, len;
                for (i = 0, len = exports.skips.length; i < len; i++) {
                    if (exports.skips[i].test(name)) {
                        return false } }
                for (i = 0, len = exports.names.length; i < len; i++) {
                    if (exports.names[i].test(name)) {
                        return true } }
                return false }

            function coerce(val) {
                if (val instanceof Error) return val.stack || val.message;
                return val } }, { ms: 25 }],
        19: [function(_dereq_, module, exports) {
            (function(global) {
                var keys = _dereq_("./keys");
                var hasBinary = _dereq_("has-binary");
                var sliceBuffer = _dereq_("arraybuffer.slice");
                var base64encoder = _dereq_("base64-arraybuffer");
                var after = _dereq_("after");
                var utf8 = _dereq_("utf8");
                var isAndroid = navigator.userAgent.match(/Android/i);
                var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);
                var dontSendBlobs = isAndroid || isPhantomJS;
                exports.protocol = 3;
                var packets = exports.packets = { open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6 };
                var packetslist = keys(packets);
                var err = { type: "error", data: "parser error" };
                var Blob = _dereq_("blob");
                exports.encodePacket = function(packet, supportsBinary, utf8encode, callback) {
                    if ("function" == typeof supportsBinary) { callback = supportsBinary;
                        supportsBinary = false }
                    if ("function" == typeof utf8encode) { callback = utf8encode;
                        utf8encode = null }
                    var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;
                    if (global.ArrayBuffer && data instanceof ArrayBuffer) {
                        return encodeArrayBuffer(packet, supportsBinary, callback) } else if (Blob && data instanceof global.Blob) {
                        return encodeBlob(packet, supportsBinary, callback) }
                    if (data && data.base64) {
                        return encodeBase64Object(packet, callback) }
                    var encoded = packets[packet.type];
                    if (undefined !== packet.data) { encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data) }
                    return callback("" + encoded) };

                function encodeBase64Object(packet, callback) {
                    var message = "b" + exports.packets[packet.type] + packet.data.data;
                    return callback(message) }

                function encodeArrayBuffer(packet, supportsBinary, callback) {
                    if (!supportsBinary) {
                        return exports.encodeBase64Packet(packet, callback) }
                    var data = packet.data;
                    var contentArray = new Uint8Array(data);
                    var resultBuffer = new Uint8Array(1 + data.byteLength);
                    resultBuffer[0] = packets[packet.type];
                    for (var i = 0; i < contentArray.length; i++) { resultBuffer[i + 1] = contentArray[i] }
                    return callback(resultBuffer.buffer) }

                function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
                    if (!supportsBinary) {
                        return exports.encodeBase64Packet(packet, callback) }
                    var fr = new FileReader;
                    fr.onload = function() { packet.data = fr.result;
                        exports.encodePacket(packet, supportsBinary, true, callback) };
                    return fr.readAsArrayBuffer(packet.data) }

                function encodeBlob(packet, supportsBinary, callback) {
                    if (!supportsBinary) {
                        return exports.encodeBase64Packet(packet, callback) }
                    if (dontSendBlobs) {
                        return encodeBlobAsArrayBuffer(packet, supportsBinary, callback) }
                    var length = new Uint8Array(1);
                    length[0] = packets[packet.type];
                    var blob = new Blob([length.buffer, packet.data]);
                    return callback(blob) }
                exports.encodeBase64Packet = function(packet, callback) {
                    var message = "b" + exports.packets[packet.type];
                    if (Blob && packet.data instanceof global.Blob) {
                        var fr = new FileReader;
                        fr.onload = function() {
                            var b64 = fr.result.split(",")[1];
                            callback(message + b64) };
                        return fr.readAsDataURL(packet.data) }
                    var b64data;
                    try { b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data)) } catch (e) {
                        var typed = new Uint8Array(packet.data);
                        var basic = new Array(typed.length);
                        for (var i = 0; i < typed.length; i++) { basic[i] = typed[i] }
                        b64data = String.fromCharCode.apply(null, basic) }
                    message += global.btoa(b64data);
                    return callback(message) };
                exports.decodePacket = function(data, binaryType, utf8decode) {
                    if (typeof data == "string" || data === undefined) {
                        if (data.charAt(0) == "b") {
                            return exports.decodeBase64Packet(data.substr(1), binaryType) }
                        if (utf8decode) {
                            try { data = utf8.decode(data) } catch (e) {
                                return err } }
                        var type = data.charAt(0);
                        if (Number(type) != type || !packetslist[type]) {
                            return err }
                        if (data.length > 1) {
                            return { type: packetslist[type], data: data.substring(1) } } else {
                            return { type: packetslist[type] } } }
                    var asArray = new Uint8Array(data);
                    var type = asArray[0];
                    var rest = sliceBuffer(data, 1);
                    if (Blob && binaryType === "blob") { rest = new Blob([rest]) }
                    return { type: packetslist[type], data: rest } };
                exports.decodeBase64Packet = function(msg, binaryType) {
                    var type = packetslist[msg.charAt(0)];
                    if (!global.ArrayBuffer) {
                        return { type: type, data: { base64: true, data: msg.substr(1) } } }
                    var data = base64encoder.decode(msg.substr(1));
                    if (binaryType === "blob" && Blob) { data = new Blob([data]) }
                    return { type: type, data: data } };
                exports.encodePayload = function(packets, supportsBinary, callback) {
                    if (typeof supportsBinary == "function") { callback = supportsBinary;
                        supportsBinary = null }
                    var isBinary = hasBinary(packets);
                    if (supportsBinary && isBinary) {
                        if (Blob && !dontSendBlobs) {
                            return exports.encodePayloadAsBlob(packets, callback) }
                        return exports.encodePayloadAsArrayBuffer(packets, callback) }
                    if (!packets.length) {
                        return callback("0:") }

                    function setLengthHeader(message) {
                        return message.length + ":" + message }

                    function encodeOne(packet, doneCallback) { exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) { doneCallback(null, setLengthHeader(message)) }) }
                    map(packets, encodeOne, function(err, results) {
                        return callback(results.join("")) }) };

                function map(ary, each, done) {
                    var result = new Array(ary.length);
                    var next = after(ary.length, done);
                    var eachWithIndex = function(i, el, cb) { each(el, function(error, msg) { result[i] = msg;
                            cb(error, result) }) };
                    for (var i = 0; i < ary.length; i++) { eachWithIndex(i, ary[i], next) } }
                exports.decodePayload = function(data, binaryType, callback) {
                    if (typeof data != "string") {
                        return exports.decodePayloadAsBinary(data, binaryType, callback) }
                    if (typeof binaryType === "function") { callback = binaryType;
                        binaryType = null }
                    var packet;
                    if (data == "") {
                        return callback(err, 0, 1) }
                    var length = "",
                        n, msg;
                    for (var i = 0, l = data.length; i < l; i++) {
                        var chr = data.charAt(i);
                        if (":" != chr) { length += chr } else {
                            if ("" == length || length != (n = Number(length))) {
                                return callback(err, 0, 1) }
                            msg = data.substr(i + 1, n);
                            if (length != msg.length) {
                                return callback(err, 0, 1) }
                            if (msg.length) { packet = exports.decodePacket(msg, binaryType, true);
                                if (err.type == packet.type && err.data == packet.data) {
                                    return callback(err, 0, 1) }
                                var ret = callback(packet, i + n, l);
                                if (false === ret) return }
                            i += n;
                            length = "" } }
                    if (length != "") {
                        return callback(err, 0, 1) } };
                exports.encodePayloadAsArrayBuffer = function(packets, callback) {
                    if (!packets.length) {
                        return callback(new ArrayBuffer(0)) }

                    function encodeOne(packet, doneCallback) { exports.encodePacket(packet, true, true, function(data) {
                            return doneCallback(null, data) }) }
                    map(packets, encodeOne, function(err, encodedPackets) {
                        var totalLength = encodedPackets.reduce(function(acc, p) {
                            var len;
                            if (typeof p === "string") { len = p.length } else { len = p.byteLength }
                            return acc + len.toString().length + len + 2 }, 0);
                        var resultArray = new Uint8Array(totalLength);
                        var bufferIndex = 0;
                        encodedPackets.forEach(function(p) {
                            var isString = typeof p === "string";
                            var ab = p;
                            if (isString) {
                                var view = new Uint8Array(p.length);
                                for (var i = 0; i < p.length; i++) { view[i] = p.charCodeAt(i) }
                                ab = view.buffer }
                            if (isString) { resultArray[bufferIndex++] = 0 } else { resultArray[bufferIndex++] = 1 }
                            var lenStr = ab.byteLength.toString();
                            for (var i = 0; i < lenStr.length; i++) { resultArray[bufferIndex++] = parseInt(lenStr[i]) }
                            resultArray[bufferIndex++] = 255;
                            var view = new Uint8Array(ab);
                            for (var i = 0; i < view.length; i++) { resultArray[bufferIndex++] = view[i] } });
                        return callback(resultArray.buffer) }) };
                exports.encodePayloadAsBlob = function(packets, callback) {
                    function encodeOne(packet, doneCallback) { exports.encodePacket(packet, true, true, function(encoded) {
                            var binaryIdentifier = new Uint8Array(1);
                            binaryIdentifier[0] = 1;
                            if (typeof encoded === "string") {
                                var view = new Uint8Array(encoded.length);
                                for (var i = 0; i < encoded.length; i++) { view[i] = encoded.charCodeAt(i) }
                                encoded = view.buffer;
                                binaryIdentifier[0] = 0 }
                            var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;
                            var lenStr = len.toString();
                            var lengthAry = new Uint8Array(lenStr.length + 1);
                            for (var i = 0; i < lenStr.length; i++) { lengthAry[i] = parseInt(lenStr[i]) }
                            lengthAry[lenStr.length] = 255;
                            if (Blob) {
                                var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
                                doneCallback(null, blob) } }) }
                    map(packets, encodeOne, function(err, results) {
                        return callback(new Blob(results)) }) };
                exports.decodePayloadAsBinary = function(data, binaryType, callback) {
                    if (typeof binaryType === "function") { callback = binaryType;
                        binaryType = null }
                    var bufferTail = data;
                    var buffers = [];
                    var numberTooLong = false;
                    while (bufferTail.byteLength > 0) {
                        var tailArray = new Uint8Array(bufferTail);
                        var isString = tailArray[0] === 0;
                        var msgLength = "";
                        for (var i = 1;; i++) {
                            if (tailArray[i] == 255) break;
                            if (msgLength.length > 310) { numberTooLong = true;
                                break }
                            msgLength += tailArray[i] }
                        if (numberTooLong) return callback(err, 0, 1);
                        bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
                        msgLength = parseInt(msgLength);
                        var msg = sliceBuffer(bufferTail, 0, msgLength);
                        if (isString) {
                            try { msg = String.fromCharCode.apply(null, new Uint8Array(msg)) } catch (e) {
                                var typed = new Uint8Array(msg);
                                msg = "";
                                for (var i = 0; i < typed.length; i++) { msg += String.fromCharCode(typed[i]) } } }
                        buffers.push(msg);
                        bufferTail = sliceBuffer(bufferTail, msgLength) }
                    var total = buffers.length;
                    buffers.forEach(function(buffer, i) { callback(exports.decodePacket(buffer, binaryType, true), i, total) }) } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./keys": 20, after: 11, "arraybuffer.slice": 12, "base64-arraybuffer": 13, blob: 14, "has-binary": 21, utf8: 29 }],
        20: [function(_dereq_, module, exports) { module.exports = Object.keys || function keys(obj) {
                var arr = [];
                var has = Object.prototype.hasOwnProperty;
                for (var i in obj) {
                    if (has.call(obj, i)) { arr.push(i) } }
                return arr } }, {}],
        21: [function(_dereq_, module, exports) {
            (function(global) {
                var isArray = _dereq_("isarray");
                module.exports = hasBinary;

                function hasBinary(data) {
                    function _hasBinary(obj) {
                        if (!obj) return false;
                        if (global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
                            return true }
                        if (isArray(obj)) {
                            for (var i = 0; i < obj.length; i++) {
                                if (_hasBinary(obj[i])) {
                                    return true } } } else if (obj && "object" == typeof obj) {
                            if (obj.toJSON) { obj = obj.toJSON() }
                            for (var key in obj) {
                                if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                                    return true } } }
                        return false }
                    return _hasBinary(data) } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { isarray: 24 }],
        22: [function(_dereq_, module, exports) {
            try { module.exports = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest } catch (err) { module.exports = false } }, {}],
        23: [function(_dereq_, module, exports) {
            var indexOf = [].indexOf;
            module.exports = function(arr, obj) {
                if (indexOf) return arr.indexOf(obj);
                for (var i = 0; i < arr.length; ++i) {
                    if (arr[i] === obj) return i }
                return -1 } }, {}],
        24: [function(_dereq_, module, exports) { module.exports = Array.isArray || function(arr) {
                return Object.prototype.toString.call(arr) == "[object Array]" } }, {}],
        25: [function(_dereq_, module, exports) {
            var s = 1e3;
            var m = s * 60;
            var h = m * 60;
            var d = h * 24;
            var y = d * 365.25;
            module.exports = function(val, options) { options = options || {};
                if ("string" == typeof val) return parse(val);
                return options.long ? long(val) : short(val) };

            function parse(str) { str = "" + str;
                if (str.length > 1e4) return;
                var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
                if (!match) return;
                var n = parseFloat(match[1]);
                var type = (match[2] || "ms").toLowerCase();
                switch (type) {
                    case "years":
                    case "year":
                    case "yrs":
                    case "yr":
                    case "y":
                        return n * y;
                    case "days":
                    case "day":
                    case "d":
                        return n * d;
                    case "hours":
                    case "hour":
                    case "hrs":
                    case "hr":
                    case "h":
                        return n * h;
                    case "minutes":
                    case "minute":
                    case "mins":
                    case "min":
                    case "m":
                        return n * m;
                    case "seconds":
                    case "second":
                    case "secs":
                    case "sec":
                    case "s":
                        return n * s;
                    case "milliseconds":
                    case "millisecond":
                    case "msecs":
                    case "msec":
                    case "ms":
                        return n } }

            function short(ms) {
                if (ms >= d) return Math.round(ms / d) + "d";
                if (ms >= h) return Math.round(ms / h) + "h";
                if (ms >= m) return Math.round(ms / m) + "m";
                if (ms >= s) return Math.round(ms / s) + "s";
                return ms + "ms" }

            function long(ms) {
                return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms" }

            function plural(ms, n, name) {
                if (ms < n) return;
                if (ms < n * 1.5) return Math.floor(ms / n) + " " + name;
                return Math.ceil(ms / n) + " " + name + "s" } }, {}],
        26: [function(_dereq_, module, exports) {
            (function(global) {
                var rvalidchars = /^[\],:{}\s]*$/;
                var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
                var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
                var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
                var rtrimLeft = /^\s+/;
                var rtrimRight = /\s+$/;
                module.exports = function parsejson(data) {
                    if ("string" != typeof data || !data) {
                        return null }
                    data = data.replace(rtrimLeft, "").replace(rtrimRight, "");
                    if (global.JSON && JSON.parse) {
                        return JSON.parse(data) }
                    if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
                        return new Function("return " + data)() } } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, {}],
        27: [function(_dereq_, module, exports) { exports.encode = function(obj) {
                var str = "";
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        if (str.length) str += "&";
                        str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]) } }
                return str };
            exports.decode = function(qs) {
                var qry = {};
                var pairs = qs.split("&");
                for (var i = 0, l = pairs.length; i < l; i++) {
                    var pair = pairs[i].split("=");
                    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]) }
                return qry } }, {}],
        28: [function(_dereq_, module, exports) {
            var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
            var parts = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            module.exports = function parseuri(str) {
                var src = str,
                    b = str.indexOf("["),
                    e = str.indexOf("]");
                if (b != -1 && e != -1) { str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length) }
                var m = re.exec(str || ""),
                    uri = {},
                    i = 14;
                while (i--) { uri[parts[i]] = m[i] || "" }
                if (b != -1 && e != -1) { uri.source = src;
                    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
                    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
                    uri.ipv6uri = true }
                return uri } }, {}],
        29: [function(_dereq_, module, exports) {
            (function(global) {
                (function(root) {
                    var freeExports = typeof exports == "object" && exports;
                    var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
                    var freeGlobal = typeof global == "object" && global;
                    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) { root = freeGlobal }
                    var stringFromCharCode = String.fromCharCode;

                    function ucs2decode(string) {
                        var output = [];
                        var counter = 0;
                        var length = string.length;
                        var value;
                        var extra;
                        while (counter < length) { value = string.charCodeAt(counter++);
                            if (value >= 55296 && value <= 56319 && counter < length) { extra = string.charCodeAt(counter++);
                                if ((extra & 64512) == 56320) { output.push(((value & 1023) << 10) + (extra & 1023) + 65536) } else { output.push(value);
                                    counter-- } } else { output.push(value) } }
                        return output }

                    function ucs2encode(array) {
                        var length = array.length;
                        var index = -1;
                        var value;
                        var output = "";
                        while (++index < length) { value = array[index];
                            if (value > 65535) { value -= 65536;
                                output += stringFromCharCode(value >>> 10 & 1023 | 55296);
                                value = 56320 | value & 1023 }
                            output += stringFromCharCode(value) }
                        return output }

                    function checkScalarValue(codePoint) {
                        if (codePoint >= 55296 && codePoint <= 57343) {
                            throw Error("Lone surrogate U+" + codePoint.toString(16).toUpperCase() + " is not a scalar value") } }

                    function createByte(codePoint, shift) {
                        return stringFromCharCode(codePoint >> shift & 63 | 128) }

                    function encodeCodePoint(codePoint) {
                        if ((codePoint & 4294967168) == 0) {
                            return stringFromCharCode(codePoint) }
                        var symbol = "";
                        if ((codePoint & 4294965248) == 0) { symbol = stringFromCharCode(codePoint >> 6 & 31 | 192) } else if ((codePoint & 4294901760) == 0) { checkScalarValue(codePoint);
                            symbol = stringFromCharCode(codePoint >> 12 & 15 | 224);
                            symbol += createByte(codePoint, 6) } else if ((codePoint & 4292870144) == 0) { symbol = stringFromCharCode(codePoint >> 18 & 7 | 240);
                            symbol += createByte(codePoint, 12);
                            symbol += createByte(codePoint, 6) }
                        symbol += stringFromCharCode(codePoint & 63 | 128);
                        return symbol }

                    function utf8encode(string) {
                        var codePoints = ucs2decode(string);
                        var length = codePoints.length;
                        var index = -1;
                        var codePoint;
                        var byteString = "";
                        while (++index < length) { codePoint = codePoints[index];
                            byteString += encodeCodePoint(codePoint) }
                        return byteString }

                    function readContinuationByte() {
                        if (byteIndex >= byteCount) {
                            throw Error("Invalid byte index") }
                        var continuationByte = byteArray[byteIndex] & 255;
                        byteIndex++;
                        if ((continuationByte & 192) == 128) {
                            return continuationByte & 63 }
                        throw Error("Invalid continuation byte") }

                    function decodeSymbol() {
                        var byte1;
                        var byte2;
                        var byte3;
                        var byte4;
                        var codePoint;
                        if (byteIndex > byteCount) {
                            throw Error("Invalid byte index") }
                        if (byteIndex == byteCount) {
                            return false }
                        byte1 = byteArray[byteIndex] & 255;
                        byteIndex++;
                        if ((byte1 & 128) == 0) {
                            return byte1 }
                        if ((byte1 & 224) == 192) {
                            var byte2 = readContinuationByte();
                            codePoint = (byte1 & 31) << 6 | byte2;
                            if (codePoint >= 128) {
                                return codePoint } else {
                                throw Error("Invalid continuation byte") } }
                        if ((byte1 & 240) == 224) { byte2 = readContinuationByte();
                            byte3 = readContinuationByte();
                            codePoint = (byte1 & 15) << 12 | byte2 << 6 | byte3;
                            if (codePoint >= 2048) { checkScalarValue(codePoint);
                                return codePoint } else {
                                throw Error("Invalid continuation byte") } }
                        if ((byte1 & 248) == 240) { byte2 = readContinuationByte();
                            byte3 = readContinuationByte();
                            byte4 = readContinuationByte();
                            codePoint = (byte1 & 15) << 18 | byte2 << 12 | byte3 << 6 | byte4;
                            if (codePoint >= 65536 && codePoint <= 1114111) {
                                return codePoint } }
                        throw Error("Invalid UTF-8 detected") }
                    var byteArray;
                    var byteCount;
                    var byteIndex;

                    function utf8decode(byteString) { byteArray = ucs2decode(byteString);
                        byteCount = byteArray.length;
                        byteIndex = 0;
                        var codePoints = [];
                        var tmp;
                        while ((tmp = decodeSymbol()) !== false) { codePoints.push(tmp) }
                        return ucs2encode(codePoints) }
                    var utf8 = { version: "2.0.0", encode: utf8encode, decode: utf8decode };
                    if (typeof define == "function" && typeof define.amd == "object" && define.amd) { define(function() {
                            return utf8 }) } else if (freeExports && !freeExports.nodeType) {
                        if (freeModule) { freeModule.exports = utf8 } else {
                            var object = {};
                            var hasOwnProperty = object.hasOwnProperty;
                            for (var key in utf8) { hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]) } } } else { root.utf8 = utf8 } })(this) }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, {}],
        30: [function(_dereq_, module, exports) { "use strict";
            var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
                length = 64,
                map = {},
                seed = 0,
                i = 0,
                prev;

            function encode(num) {
                var encoded = "";
                do { encoded = alphabet[num % length] + encoded;
                    num = Math.floor(num / length) } while (num > 0);
                return encoded }

            function decode(str) {
                var decoded = 0;
                for (i = 0; i < str.length; i++) { decoded = decoded * length + map[str.charAt(i)] }
                return decoded }

            function yeast() {
                var now = encode(+new Date);
                if (now !== prev) return seed = 0, prev = now;
                return now + "." + encode(seed++) }
            for (; i < length; i++) map[alphabet[i]] = i;
            yeast.encode = encode;
            yeast.decode = decode;
            module.exports = yeast }, {}],
        31: [function(_dereq_, module, exports) {
            var url = _dereq_("./url");
            var parser = _dereq_("socket.io-parser");
            var Manager = _dereq_("./manager");
            var debug = _dereq_("debug")("socket.io-client");
            module.exports = exports = lookup;
            var cache = exports.managers = {};

            function lookup(uri, opts) {
                if (typeof uri == "object") { opts = uri;
                    uri = undefined }
                opts = opts || {};
                var parsed = url(uri);
                var source = parsed.source;
                var id = parsed.id;
                var path = parsed.path;
                var sameNamespace = cache[id] && path in cache[id].nsps;
                var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
                var io;
                if (newConnection) { debug("ignoring socket cache for %s", source);
                    io = Manager(source, opts) } else {
                    if (!cache[id]) { debug("new io instance for %s", source);
                        cache[id] = Manager(source, opts) }
                    io = cache[id] }
                return io.socket(parsed.path) }
            exports.protocol = parser.protocol;
            exports.connect = lookup;
            exports.Manager = _dereq_("./manager");
            exports.Socket = _dereq_("./socket") }, { "./manager": 32, "./socket": 34, "./url": 35, debug: 39, "socket.io-parser": 47 }],
        32: [function(_dereq_, module, exports) {
            var eio = _dereq_("engine.io-client");
            var Socket = _dereq_("./socket");
            var Emitter = _dereq_("component-emitter");
            var parser = _dereq_("socket.io-parser");
            var on = _dereq_("./on");
            var bind = _dereq_("component-bind");
            var debug = _dereq_("debug")("socket.io-client:manager");
            var indexOf = _dereq_("indexof");
            var Backoff = _dereq_("backo2");
            var has = Object.prototype.hasOwnProperty;
            module.exports = Manager;

            function Manager(uri, opts) {
                if (!(this instanceof Manager)) return new Manager(uri, opts);
                if (uri && "object" == typeof uri) { opts = uri;
                    uri = undefined }
                opts = opts || {};
                opts.path = opts.path || "/socket.io";
                this.nsps = {};
                this.subs = [];
                this.opts = opts;
                this.reconnection(opts.reconnection !== false);
                this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
                this.reconnectionDelay(opts.reconnectionDelay || 1e3);
                this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
                this.randomizationFactor(opts.randomizationFactor || .5);
                this.backoff = new Backoff({ min: this.reconnectionDelay(), max: this.reconnectionDelayMax(), jitter: this.randomizationFactor() });
                this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
                this.readyState = "closed";
                this.uri = uri;
                this.connecting = [];
                this.lastPing = null;
                this.encoding = false;
                this.packetBuffer = [];
                this.encoder = new parser.Encoder;
                this.decoder = new parser.Decoder;
                this.autoConnect = opts.autoConnect !== false;
                if (this.autoConnect) this.open() }
            Manager.prototype.emitAll = function() { this.emit.apply(this, arguments);
                for (var nsp in this.nsps) {
                    if (has.call(this.nsps, nsp)) { this.nsps[nsp].emit.apply(this.nsps[nsp], arguments) } } };
            Manager.prototype.updateSocketIds = function() {
                for (var nsp in this.nsps) {
                    if (has.call(this.nsps, nsp)) { this.nsps[nsp].id = this.engine.id } } };
            Emitter(Manager.prototype);
            Manager.prototype.reconnection = function(v) {
                if (!arguments.length) return this._reconnection;
                this._reconnection = !!v;
                return this };
            Manager.prototype.reconnectionAttempts = function(v) {
                if (!arguments.length) return this._reconnectionAttempts;
                this._reconnectionAttempts = v;
                return this };
            Manager.prototype.reconnectionDelay = function(v) {
                if (!arguments.length) return this._reconnectionDelay;
                this._reconnectionDelay = v;
                this.backoff && this.backoff.setMin(v);
                return this };
            Manager.prototype.randomizationFactor = function(v) {
                if (!arguments.length) return this._randomizationFactor;
                this._randomizationFactor = v;
                this.backoff && this.backoff.setJitter(v);
                return this };
            Manager.prototype.reconnectionDelayMax = function(v) {
                if (!arguments.length) return this._reconnectionDelayMax;
                this._reconnectionDelayMax = v;
                this.backoff && this.backoff.setMax(v);
                return this };
            Manager.prototype.timeout = function(v) {
                if (!arguments.length) return this._timeout;
                this._timeout = v;
                return this };
            Manager.prototype.maybeReconnectOnOpen = function() {
                if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) { this.reconnect() } };
            Manager.prototype.open = Manager.prototype.connect = function(fn) { debug("readyState %s", this.readyState);
                if (~this.readyState.indexOf("open")) return this;
                debug("opening %s", this.uri);
                this.engine = eio(this.uri, this.opts);
                var socket = this.engine;
                var self = this;
                this.readyState = "opening";
                this.skipReconnect = false;
                var openSub = on(socket, "open", function() { self.onopen();
                    fn && fn() });
                var errorSub = on(socket, "error", function(data) { debug("connect_error");
                    self.cleanup();
                    self.readyState = "closed";
                    self.emitAll("connect_error", data);
                    if (fn) {
                        var err = new Error("Connection error");
                        err.data = data;
                        fn(err) } else { self.maybeReconnectOnOpen() } });
                if (false !== this._timeout) {
                    var timeout = this._timeout;
                    debug("connect attempt will timeout after %d", timeout);
                    var timer = setTimeout(function() { debug("connect attempt timed out after %d", timeout);
                        openSub.destroy();
                        socket.close();
                        socket.emit("error", "timeout");
                        self.emitAll("connect_timeout", timeout) }, timeout);
                    this.subs.push({ destroy: function() { clearTimeout(timer) } }) }
                this.subs.push(openSub);
                this.subs.push(errorSub);
                return this };
            Manager.prototype.onopen = function() { debug("open");
                this.cleanup();
                this.readyState = "open";
                this.emit("open");
                var socket = this.engine;
                this.subs.push(on(socket, "data", bind(this, "ondata")));
                this.subs.push(on(socket, "ping", bind(this, "onping")));
                this.subs.push(on(socket, "pong", bind(this, "onpong")));
                this.subs.push(on(socket, "error", bind(this, "onerror")));
                this.subs.push(on(socket, "close", bind(this, "onclose")));
                this.subs.push(on(this.decoder, "decoded", bind(this, "ondecoded"))) };
            Manager.prototype.onping = function() { this.lastPing = new Date;
                this.emitAll("ping") };
            Manager.prototype.onpong = function() { this.emitAll("pong", new Date - this.lastPing) };
            Manager.prototype.ondata = function(data) { this.decoder.add(data) };
            Manager.prototype.ondecoded = function(packet) { this.emit("packet", packet) };
            Manager.prototype.onerror = function(err) { debug("error", err);
                this.emitAll("error", err) };
            Manager.prototype.socket = function(nsp) {
                var socket = this.nsps[nsp];
                if (!socket) {
                    socket = new Socket(this, nsp);
                    this.nsps[nsp] = socket;
                    var self = this;
                    socket.on("connecting", onConnecting);
                    socket.on("connect", function() { socket.id = self.engine.id });
                    if (this.autoConnect) { onConnecting() }
                }

                function onConnecting() {
                    if (!~indexOf(self.connecting, socket)) { self.connecting.push(socket) } }
                return socket
            };
            Manager.prototype.destroy = function(socket) {
                var index = indexOf(this.connecting, socket);
                if (~index) this.connecting.splice(index, 1);
                if (this.connecting.length) return;
                this.close() };
            Manager.prototype.packet = function(packet) { debug("writing packet %j", packet);
                var self = this;
                if (!self.encoding) { self.encoding = true;
                    this.encoder.encode(packet, function(encodedPackets) {
                        for (var i = 0; i < encodedPackets.length; i++) { self.engine.write(encodedPackets[i], packet.options) }
                        self.encoding = false;
                        self.processPacketQueue() }) } else { self.packetBuffer.push(packet) } };
            Manager.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var pack = this.packetBuffer.shift();
                    this.packet(pack) } };
            Manager.prototype.cleanup = function() { debug("cleanup");
                var sub;
                while (sub = this.subs.shift()) sub.destroy();
                this.packetBuffer = [];
                this.encoding = false;
                this.lastPing = null;
                this.decoder.destroy() };
            Manager.prototype.close = Manager.prototype.disconnect = function() { debug("disconnect");
                this.skipReconnect = true;
                this.reconnecting = false;
                if ("opening" == this.readyState) { this.cleanup() }
                this.backoff.reset();
                this.readyState = "closed";
                if (this.engine) this.engine.close() };
            Manager.prototype.onclose = function(reason) { debug("onclose");
                this.cleanup();
                this.backoff.reset();
                this.readyState = "closed";
                this.emit("close", reason);
                if (this._reconnection && !this.skipReconnect) { this.reconnect() } };
            Manager.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect) return this;
                var self = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) { debug("reconnect failed");
                    this.backoff.reset();
                    this.emitAll("reconnect_failed");
                    this.reconnecting = false } else {
                    var delay = this.backoff.duration();
                    debug("will wait %dms before reconnect attempt", delay);
                    this.reconnecting = true;
                    var timer = setTimeout(function() {
                        if (self.skipReconnect) return;
                        debug("attempting reconnect");
                        self.emitAll("reconnect_attempt", self.backoff.attempts);
                        self.emitAll("reconnecting", self.backoff.attempts);
                        if (self.skipReconnect) return;
                        self.open(function(err) {
                            if (err) { debug("reconnect attempt error");
                                self.reconnecting = false;
                                self.reconnect();
                                self.emitAll("reconnect_error", err.data) } else { debug("reconnect success");
                                self.onreconnect() } }) }, delay);
                    this.subs.push({ destroy: function() { clearTimeout(timer) } }) } };
            Manager.prototype.onreconnect = function() {
                var attempt = this.backoff.attempts;
                this.reconnecting = false;
                this.backoff.reset();
                this.updateSocketIds();
                this.emitAll("reconnect", attempt) }
        }, { "./on": 33, "./socket": 34, backo2: 36, "component-bind": 37, "component-emitter": 38, debug: 39, "engine.io-client": 1, indexof: 42, "socket.io-parser": 47 }],
        33: [function(_dereq_, module, exports) { module.exports = on;

            function on(obj, ev, fn) { obj.on(ev, fn);
                return { destroy: function() { obj.removeListener(ev, fn) } } } }, {}],
        34: [function(_dereq_, module, exports) {
            var parser = _dereq_("socket.io-parser");
            var Emitter = _dereq_("component-emitter");
            var toArray = _dereq_("to-array");
            var on = _dereq_("./on");
            var bind = _dereq_("component-bind");
            var debug = _dereq_("debug")("socket.io-client:socket");
            var hasBin = _dereq_("has-binary");
            module.exports = exports = Socket;
            var events = { connect: 1, connect_error: 1, connect_timeout: 1, connecting: 1, disconnect: 1, error: 1, reconnect: 1, reconnect_attempt: 1, reconnect_failed: 1, reconnect_error: 1, reconnecting: 1, ping: 1, pong: 1 };
            var emit = Emitter.prototype.emit;

            function Socket(io, nsp) { this.io = io;
                this.nsp = nsp;
                this.json = this;
                this.ids = 0;
                this.acks = {};
                this.receiveBuffer = [];
                this.sendBuffer = [];
                this.connected = false;
                this.disconnected = true;
                if (this.io.autoConnect) this.open() }
            Emitter(Socket.prototype);
            Socket.prototype.subEvents = function() {
                if (this.subs) return;
                var io = this.io;
                this.subs = [on(io, "open", bind(this, "onopen")), on(io, "packet", bind(this, "onpacket")), on(io, "close", bind(this, "onclose"))] };
            Socket.prototype.open = Socket.prototype.connect = function() {
                if (this.connected) return this;
                this.subEvents();
                this.io.open();
                if ("open" == this.io.readyState) this.onopen();
                this.emit("connecting");
                return this };
            Socket.prototype.send = function() {
                var args = toArray(arguments);
                args.unshift("message");
                this.emit.apply(this, args);
                return this };
            Socket.prototype.emit = function(ev) {
                if (events.hasOwnProperty(ev)) { emit.apply(this, arguments);
                    return this }
                var args = toArray(arguments);
                var parserType = parser.EVENT;
                if (hasBin(args)) { parserType = parser.BINARY_EVENT }
                var packet = { type: parserType, data: args };
                packet.options = {};
                packet.options.compress = !this.flags || false !== this.flags.compress;
                if ("function" == typeof args[args.length - 1]) { debug("emitting packet with ack id %d", this.ids);
                    this.acks[this.ids] = args.pop();
                    packet.id = this.ids++ }
                if (this.connected) { this.packet(packet) } else { this.sendBuffer.push(packet) }
                delete this.flags;
                return this };
            Socket.prototype.packet = function(packet) { packet.nsp = this.nsp;
                this.io.packet(packet) };
            Socket.prototype.onopen = function() { debug("transport is open - connecting");
                if ("/" != this.nsp) { this.packet({ type: parser.CONNECT }) } };
            Socket.prototype.onclose = function(reason) { debug("close (%s)", reason);
                this.connected = false;
                this.disconnected = true;
                delete this.id;
                this.emit("disconnect", reason) };
            Socket.prototype.onpacket = function(packet) {
                if (packet.nsp != this.nsp) return;
                switch (packet.type) {
                    case parser.CONNECT:
                        this.onconnect();
                        break;
                    case parser.EVENT:
                        this.onevent(packet);
                        break;
                    case parser.BINARY_EVENT:
                        this.onevent(packet);
                        break;
                    case parser.ACK:
                        this.onack(packet);
                        break;
                    case parser.BINARY_ACK:
                        this.onack(packet);
                        break;
                    case parser.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case parser.ERROR:
                        this.emit("error", packet.data);
                        break } };
            Socket.prototype.onevent = function(packet) {
                var args = packet.data || [];
                debug("emitting event %j", args);
                if (null != packet.id) { debug("attaching ack callback to event");
                    args.push(this.ack(packet.id)) }
                if (this.connected) { emit.apply(this, args) } else { this.receiveBuffer.push(args) } };
            Socket.prototype.ack = function(id) {
                var self = this;
                var sent = false;
                return function() {
                    if (sent) return;
                    sent = true;
                    var args = toArray(arguments);
                    debug("sending ack %j", args);
                    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
                    self.packet({ type: type, id: id, data: args }) } };
            Socket.prototype.onack = function(packet) {
                var ack = this.acks[packet.id];
                if ("function" == typeof ack) { debug("calling ack %s with %j", packet.id, packet.data);
                    ack.apply(this, packet.data);
                    delete this.acks[packet.id] } else { debug("bad ack %s", packet.id) } };
            Socket.prototype.onconnect = function() { this.connected = true;
                this.disconnected = false;
                this.emit("connect");
                this.emitBuffered() };
            Socket.prototype.emitBuffered = function() {
                var i;
                for (i = 0; i < this.receiveBuffer.length; i++) { emit.apply(this, this.receiveBuffer[i]) }
                this.receiveBuffer = [];
                for (i = 0; i < this.sendBuffer.length; i++) { this.packet(this.sendBuffer[i]) }
                this.sendBuffer = [] };
            Socket.prototype.ondisconnect = function() { debug("server disconnect (%s)", this.nsp);
                this.destroy();
                this.onclose("io server disconnect") };
            Socket.prototype.destroy = function() {
                if (this.subs) {
                    for (var i = 0; i < this.subs.length; i++) { this.subs[i].destroy() }
                    this.subs = null }
                this.io.destroy(this) };
            Socket.prototype.close = Socket.prototype.disconnect = function() {
                if (this.connected) { debug("performing disconnect (%s)", this.nsp);
                    this.packet({ type: parser.DISCONNECT }) }
                this.destroy();
                if (this.connected) { this.onclose("io client disconnect") }
                return this };
            Socket.prototype.compress = function(compress) { this.flags = this.flags || {};
                this.flags.compress = compress;
                return this } }, { "./on": 33, "component-bind": 37, "component-emitter": 38, debug: 39, "has-binary": 41, "socket.io-parser": 47, "to-array": 51 }],
        35: [function(_dereq_, module, exports) {
            (function(global) {
                var parseuri = _dereq_("parseuri");
                var debug = _dereq_("debug")("socket.io-client:url");
                module.exports = url;

                function url(uri, loc) {
                    var obj = uri;
                    var loc = loc || global.location;
                    if (null == uri) uri = loc.protocol + "//" + loc.host;
                    if ("string" == typeof uri) {
                        if ("/" == uri.charAt(0)) {
                            if ("/" == uri.charAt(1)) { uri = loc.protocol + uri } else { uri = loc.host + uri } }
                        if (!/^(https?|wss?):\/\//.test(uri)) { debug("protocol-less url %s", uri);
                            if ("undefined" != typeof loc) { uri = loc.protocol + "//" + uri } else { uri = "https://" + uri } }
                        debug("parse %s", uri);
                        obj = parseuri(uri) }
                    if (!obj.port) {
                        if (/^(http|ws)$/.test(obj.protocol)) { obj.port = "80" } else if (/^(http|ws)s$/.test(obj.protocol)) { obj.port = "443" } }
                    obj.path = obj.path || "/";
                    var ipv6 = obj.host.indexOf(":") !== -1;
                    var host = ipv6 ? "[" + obj.host + "]" : obj.host;
                    obj.id = obj.protocol + "://" + host + ":" + obj.port;
                    obj.href = obj.protocol + "://" + host + (loc && loc.port == obj.port ? "" : ":" + obj.port);
                    return obj } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { debug: 39, parseuri: 45 }],
        36: [function(_dereq_, module, exports) { module.exports = Backoff;

            function Backoff(opts) { opts = opts || {};
                this.ms = opts.min || 100;
                this.max = opts.max || 1e4;
                this.factor = opts.factor || 2;
                this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
                this.attempts = 0 }
            Backoff.prototype.duration = function() {
                var ms = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var rand = Math.random();
                    var deviation = Math.floor(rand * this.jitter * ms);
                    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation }
                return Math.min(ms, this.max) | 0 };
            Backoff.prototype.reset = function() { this.attempts = 0 };
            Backoff.prototype.setMin = function(min) { this.ms = min };
            Backoff.prototype.setMax = function(max) { this.max = max };
            Backoff.prototype.setJitter = function(jitter) { this.jitter = jitter } }, {}],
        37: [function(_dereq_, module, exports) {
            var slice = [].slice;
            module.exports = function(obj, fn) {
                if ("string" == typeof fn) fn = obj[fn];
                if ("function" != typeof fn) throw new Error("bind() requires a function");
                var args = slice.call(arguments, 2);
                return function() {
                    return fn.apply(obj, args.concat(slice.call(arguments))) } } }, {}],
        38: [function(_dereq_, module, exports) { module.exports = Emitter;

            function Emitter(obj) {
                if (obj) return mixin(obj) }

            function mixin(obj) {
                for (var key in Emitter.prototype) { obj[key] = Emitter.prototype[key] }
                return obj }
            Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) { this._callbacks = this._callbacks || {};
                (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
                return this };
            Emitter.prototype.once = function(event, fn) {
                function on() { this.off(event, on);
                    fn.apply(this, arguments) }
                on.fn = fn;
                this.on(event, on);
                return this };
            Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) { this._callbacks = this._callbacks || {};
                if (0 == arguments.length) { this._callbacks = {};
                    return this }
                var callbacks = this._callbacks["$" + event];
                if (!callbacks) return this;
                if (1 == arguments.length) { delete this._callbacks["$" + event];
                    return this }
                var cb;
                for (var i = 0; i < callbacks.length; i++) { cb = callbacks[i];
                    if (cb === fn || cb.fn === fn) { callbacks.splice(i, 1);
                        break } }
                return this };
            Emitter.prototype.emit = function(event) { this._callbacks = this._callbacks || {};
                var args = [].slice.call(arguments, 1),
                    callbacks = this._callbacks["$" + event];
                if (callbacks) { callbacks = callbacks.slice(0);
                    for (var i = 0, len = callbacks.length; i < len; ++i) { callbacks[i].apply(this, args) } }
                return this };
            Emitter.prototype.listeners = function(event) { this._callbacks = this._callbacks || {};
                return this._callbacks["$" + event] || [] };
            Emitter.prototype.hasListeners = function(event) {
                return !!this.listeners(event).length } }, {}],
        39: [function(_dereq_, module, exports) { arguments[4][17][0].apply(exports, arguments) }, { "./debug": 40, dup: 17 }],
        40: [function(_dereq_, module, exports) { arguments[4][18][0].apply(exports, arguments) }, { dup: 18, ms: 44 }],
        41: [function(_dereq_, module, exports) {
            (function(global) {
                var isArray = _dereq_("isarray");
                module.exports = hasBinary;

                function hasBinary(data) {
                    function _hasBinary(obj) {
                        if (!obj) return false;
                        if (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
                            return true }
                        if (isArray(obj)) {
                            for (var i = 0; i < obj.length; i++) {
                                if (_hasBinary(obj[i])) {
                                    return true } } } else if (obj && "object" == typeof obj) {
                            if (obj.toJSON && "function" == typeof obj.toJSON) { obj = obj.toJSON() }
                            for (var key in obj) {
                                if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                                    return true } } }
                        return false }
                    return _hasBinary(data) } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { isarray: 43 }],
        42: [function(_dereq_, module, exports) { arguments[4][23][0].apply(exports, arguments) }, { dup: 23 }],
        43: [function(_dereq_, module, exports) { arguments[4][24][0].apply(exports, arguments) }, { dup: 24 }],
        44: [function(_dereq_, module, exports) { arguments[4][25][0].apply(exports, arguments) }, { dup: 25 }],
        45: [function(_dereq_, module, exports) { arguments[4][28][0].apply(exports, arguments) }, { dup: 28 }],
        46: [function(_dereq_, module, exports) {
            (function(global) {
                var isArray = _dereq_("isarray");
                var isBuf = _dereq_("./is-buffer");
                exports.deconstructPacket = function(packet) {
                    var buffers = [];
                    var packetData = packet.data;

                    function _deconstructPacket(data) {
                        if (!data) return data;
                        if (isBuf(data)) {
                            var placeholder = { _placeholder: true, num: buffers.length };
                            buffers.push(data);
                            return placeholder } else if (isArray(data)) {
                            var newData = new Array(data.length);
                            for (var i = 0; i < data.length; i++) { newData[i] = _deconstructPacket(data[i]) }
                            return newData } else if ("object" == typeof data && !(data instanceof Date)) {
                            var newData = {};
                            for (var key in data) { newData[key] = _deconstructPacket(data[key]) }
                            return newData }
                        return data }
                    var pack = packet;
                    pack.data = _deconstructPacket(packetData);
                    pack.attachments = buffers.length;
                    return { packet: pack, buffers: buffers } };
                exports.reconstructPacket = function(packet, buffers) {
                    var curPlaceHolder = 0;

                    function _reconstructPacket(data) {
                        if (data && data._placeholder) {
                            var buf = buffers[data.num];
                            return buf } else if (isArray(data)) {
                            for (var i = 0; i < data.length; i++) { data[i] = _reconstructPacket(data[i]) }
                            return data } else if (data && "object" == typeof data) {
                            for (var key in data) { data[key] = _reconstructPacket(data[key]) }
                            return data }
                        return data }
                    packet.data = _reconstructPacket(packet.data);
                    packet.attachments = undefined;
                    return packet };
                exports.removeBlobs = function(data, callback) {
                    function _removeBlobs(obj, curKey, containingObject) {
                        if (!obj) return obj;
                        if (global.Blob && obj instanceof Blob || global.File && obj instanceof File) { pendingBlobs++;
                            var fileReader = new FileReader;
                            fileReader.onload = function() {
                                if (containingObject) { containingObject[curKey] = this.result } else { bloblessData = this.result }
                                if (!--pendingBlobs) { callback(bloblessData) } };
                            fileReader.readAsArrayBuffer(obj) } else if (isArray(obj)) {
                            for (var i = 0; i < obj.length; i++) { _removeBlobs(obj[i], i, obj) } } else if (obj && "object" == typeof obj && !isBuf(obj)) {
                            for (var key in obj) { _removeBlobs(obj[key], key, obj) } } }
                    var pendingBlobs = 0;
                    var bloblessData = data;
                    _removeBlobs(bloblessData);
                    if (!pendingBlobs) { callback(bloblessData) } } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, { "./is-buffer": 48, isarray: 43 }],
        47: [function(_dereq_, module, exports) {
            var debug = _dereq_("debug")("socket.io-parser");
            var json = _dereq_("json3");
            var isArray = _dereq_("isarray");
            var Emitter = _dereq_("component-emitter");
            var binary = _dereq_("./binary");
            var isBuf = _dereq_("./is-buffer");
            exports.protocol = 4;
            exports.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"];
            exports.CONNECT = 0;
            exports.DISCONNECT = 1;
            exports.EVENT = 2;
            exports.ACK = 3;
            exports.ERROR = 4;
            exports.BINARY_EVENT = 5;
            exports.BINARY_ACK = 6;
            exports.Encoder = Encoder;
            exports.Decoder = Decoder;

            function Encoder() {}
            Encoder.prototype.encode = function(obj, callback) { debug("encoding packet %j", obj);
                if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) { encodeAsBinary(obj, callback) } else {
                    var encoding = encodeAsString(obj);
                    callback([encoding]) } };

            function encodeAsString(obj) {
                var str = "";
                var nsp = false;
                str += obj.type;
                if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) { str += obj.attachments;
                    str += "-" }
                if (obj.nsp && "/" != obj.nsp) { nsp = true;
                    str += obj.nsp }
                if (null != obj.id) {
                    if (nsp) { str += ",";
                        nsp = false }
                    str += obj.id }
                if (null != obj.data) {
                    if (nsp) str += ",";
                    str += json.stringify(obj.data) }
                debug("encoded %j as %s", obj, str);
                return str }

            function encodeAsBinary(obj, callback) {
                function writeEncoding(bloblessData) {
                    var deconstruction = binary.deconstructPacket(bloblessData);
                    var pack = encodeAsString(deconstruction.packet);
                    var buffers = deconstruction.buffers;
                    buffers.unshift(pack);
                    callback(buffers) }
                binary.removeBlobs(obj, writeEncoding) }

            function Decoder() { this.reconstructor = null }
            Emitter(Decoder.prototype);
            Decoder.prototype.add = function(obj) {
                var packet;
                if ("string" == typeof obj) { packet = decodeString(obj);
                    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { this.reconstructor = new BinaryReconstructor(packet);
                        if (this.reconstructor.reconPack.attachments === 0) { this.emit("decoded", packet) } } else { this.emit("decoded", packet) } } else if (isBuf(obj) || obj.base64) {
                    if (!this.reconstructor) {
                        throw new Error("got binary data when not reconstructing a packet") } else { packet = this.reconstructor.takeBinaryData(obj);
                        if (packet) { this.reconstructor = null;
                            this.emit("decoded", packet) } } } else {
                    throw new Error("Unknown type: " + obj) } };

            function decodeString(str) {
                var p = {};
                var i = 0;
                p.type = Number(str.charAt(0));
                if (null == exports.types[p.type]) return error();
                if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
                    var buf = "";
                    while (str.charAt(++i) != "-") { buf += str.charAt(i);
                        if (i == str.length) break }
                    if (buf != Number(buf) || str.charAt(i) != "-") {
                        throw new Error("Illegal attachments") }
                    p.attachments = Number(buf) }
                if ("/" == str.charAt(i + 1)) { p.nsp = "";
                    while (++i) {
                        var c = str.charAt(i);
                        if ("," == c) break;
                        p.nsp += c;
                        if (i == str.length) break } } else { p.nsp = "/" }
                var next = str.charAt(i + 1);
                if ("" !== next && Number(next) == next) { p.id = "";
                    while (++i) {
                        var c = str.charAt(i);
                        if (null == c || Number(c) != c) {--i;
                            break }
                        p.id += str.charAt(i);
                        if (i == str.length) break }
                    p.id = Number(p.id) }
                if (str.charAt(++i)) {
                    try { p.data = json.parse(str.substr(i)) } catch (e) {
                        return error() } }
                debug("decoded %s as %j", str, p);
                return p }
            Decoder.prototype.destroy = function() {
                if (this.reconstructor) { this.reconstructor.finishedReconstruction() } };

            function BinaryReconstructor(packet) { this.reconPack = packet;
                this.buffers = [] }
            BinaryReconstructor.prototype.takeBinaryData = function(binData) { this.buffers.push(binData);
                if (this.buffers.length == this.reconPack.attachments) {
                    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
                    this.finishedReconstruction();
                    return packet }
                return null };
            BinaryReconstructor.prototype.finishedReconstruction = function() { this.reconPack = null;
                this.buffers = [] };

            function error(data) {
                return { type: exports.ERROR, data: "parser error" } } }, { "./binary": 46, "./is-buffer": 48, "component-emitter": 49, debug: 39, isarray: 43, json3: 50 }],
        48: [function(_dereq_, module, exports) {
            (function(global) { module.exports = isBuf;

                function isBuf(obj) {
                    return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer } }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}) }, {}],
        49: [function(_dereq_, module, exports) { arguments[4][15][0].apply(exports, arguments) }, { dup: 15 }],
        50: [function(_dereq_, module, exports) {
            (function(global) {
                (function() {
                    var isLoader = typeof define === "function" && define.amd;
                    var objectTypes = { "function": true, object: true };
                    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
                    var root = objectTypes[typeof window] && window || this,
                        freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;
                    if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) { root = freeGlobal }

                    function runInContext(context, exports) {
                        context || (context = root["Object"]());
                        exports || (exports = root["Object"]());
                        var Number = context["Number"] || root["Number"],
                            String = context["String"] || root["String"],
                            Object = context["Object"] || root["Object"],
                            Date = context["Date"] || root["Date"],
                            SyntaxError = context["SyntaxError"] || root["SyntaxError"],
                            TypeError = context["TypeError"] || root["TypeError"],
                            Math = context["Math"] || root["Math"],
                            nativeJSON = context["JSON"] || root["JSON"];
                        if (typeof nativeJSON == "object" && nativeJSON) { exports.stringify = nativeJSON.stringify;
                            exports.parse = nativeJSON.parse }
                        var objectProto = Object.prototype,
                            getClass = objectProto.toString,
                            isProperty, forEach, undef;
                        var isExtended = new Date(-0xc782b5b800cec);
                        try { isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 && isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708 } catch (exception) {}

                        function has(name) {
                            if (has[name] !== undef) {
                                return has[name] }
                            var isSupported;
                            if (name == "bug-string-char-index") { isSupported = "a" [0] != "a" } else if (name == "json") { isSupported = has("json-stringify") && has("json-parse") } else {
                                var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                                if (name == "json-stringify") {
                                    var stringify = exports.stringify,
                                        stringifySupported = typeof stringify == "function" && isExtended;
                                    if (stringifySupported) {
                                        (value = function() {
                                            return 1 }).toJSON = value;
                                        try { stringifySupported = stringify(0) === "0" && stringify(new Number) === "0" && stringify(new String) == '""' && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && stringify(value) === "1" && stringify([value]) == "[1]" && stringify([undef]) == "[null]" && stringify(null) == "null" && stringify([undef, getClass, null]) == "[null,null,null]" && stringify({ a: [value, true, false, null, "\x00\b\n\f\r	"] }) == serialized && stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" && stringify(new Date(-864e13)) == '"-271821-04-20T00:00:00.000Z"' && stringify(new Date(864e13)) == '"+275760-09-13T00:00:00.000Z"' && stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"' } catch (exception) { stringifySupported = false } }
                                    isSupported = stringifySupported }
                                if (name == "json-parse") {
                                    var parse = exports.parse;
                                    if (typeof parse == "function") {
                                        try {
                                            if (parse("0") === 0 && !parse(false)) { value = parse(serialized);
                                                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                                                if (parseSupported) {
                                                    try { parseSupported = !parse('"	"') } catch (exception) {}
                                                    if (parseSupported) {
                                                        try { parseSupported = parse("01") !== 1 } catch (exception) {} }
                                                    if (parseSupported) {
                                                        try { parseSupported = parse("1.") !== 1 } catch (exception) {} } } } } catch (exception) { parseSupported = false } }
                                    isSupported = parseSupported } }
                            return has[name] = !!isSupported }
                        if (!has("json")) {
                            var functionClass = "[object Function]",
                                dateClass = "[object Date]",
                                numberClass = "[object Number]",
                                stringClass = "[object String]",
                                arrayClass = "[object Array]",
                                booleanClass = "[object Boolean]";
                            var charIndexBuggy = has("bug-string-char-index");
                            if (!isExtended) {
                                var floor = Math.floor;
                                var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                                var getDay = function(year, month) {
                                    return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400) } }
                            if (!(isProperty = objectProto.hasOwnProperty)) { isProperty = function(property) {
                                    var members = {},
                                        constructor;
                                    if ((members.__proto__ = null, members.__proto__ = { toString: 1 }, members).toString != getClass) { isProperty = function(property) {
                                            var original = this.__proto__,
                                                result = property in (this.__proto__ = null, this);
                                            this.__proto__ = original;
                                            return result } } else { constructor = members.constructor;
                                        isProperty = function(property) {
                                            var parent = (this.constructor || constructor).prototype;
                                            return property in this && !(property in parent && this[property] === parent[property]) } }
                                    members = null;
                                    return isProperty.call(this, property) } }
                            forEach = function(object, callback) {
                                var size = 0,
                                    Properties, members, property;
                                (Properties = function() { this.valueOf = 0 }).prototype.valueOf = 0;
                                members = new Properties;
                                for (property in members) {
                                    if (isProperty.call(members, property)) { size++ } }
                                Properties = members = null;
                                if (!size) { members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                                    forEach = function(object, callback) {
                                        var isFunction = getClass.call(object) == functionClass,
                                            property, length;
                                        var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                                        for (property in object) {
                                            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) { callback(property) } }
                                        for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)); } } else if (size == 2) { forEach = function(object, callback) {
                                        var members = {},
                                            isFunction = getClass.call(object) == functionClass,
                                            property;
                                        for (property in object) {
                                            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) { callback(property) } } } } else { forEach = function(object, callback) {
                                        var isFunction = getClass.call(object) == functionClass,
                                            property, isConstructor;
                                        for (property in object) {
                                            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) { callback(property) } }
                                        if (isConstructor || isProperty.call(object, property = "constructor")) { callback(property) } } }
                                return forEach(object, callback) };
                            if (!has("json-stringify")) {
                                var Escapes = { 92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t" };
                                var leadingZeroes = "000000";
                                var toPaddedString = function(width, value) {
                                    return (leadingZeroes + (value || 0)).slice(-width) };
                                var unicodePrefix = "\\u00";
                                var quote = function(value) {
                                    var result = '"',
                                        index = 0,
                                        length = value.length,
                                        useCharIndex = !charIndexBuggy || length > 10;
                                    var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
                                    for (; index < length; index++) {
                                        var charCode = value.charCodeAt(index);
                                        switch (charCode) {
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 12:
                                            case 13:
                                            case 34:
                                            case 92:
                                                result += Escapes[charCode];
                                                break;
                                            default:
                                                if (charCode < 32) { result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                                                    break }
                                                result += useCharIndex ? symbols[index] : value.charAt(index) } }
                                    return result + '"' };
                                var serialize = function(property, object, callback, properties, whitespace, indentation, stack) {
                                    var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                                    try { value = object[property] } catch (exception) {}
                                    if (typeof value == "object" && value) { className = getClass.call(value);
                                        if (className == dateClass && !isProperty.call(value, "toJSON")) {
                                            if (value > -1 / 0 && value < 1 / 0) {
                                                if (getDay) { date = floor(value / 864e5);
                                                    for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                                                    for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                                                    date = 1 + date - getDay(year, month);
                                                    time = (value % 864e5 + 864e5) % 864e5;
                                                    hours = floor(time / 36e5) % 24;
                                                    minutes = floor(time / 6e4) % 60;
                                                    seconds = floor(time / 1e3) % 60;
                                                    milliseconds = time % 1e3 } else { year = value.getUTCFullYear();
                                                    month = value.getUTCMonth();
                                                    date = value.getUTCDate();
                                                    hours = value.getUTCHours();
                                                    minutes = value.getUTCMinutes();
                                                    seconds = value.getUTCSeconds();
                                                    milliseconds = value.getUTCMilliseconds() }
                                                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z" } else { value = null } } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || isProperty.call(value, "toJSON"))) { value = value.toJSON(property) } }
                                    if (callback) { value = callback.call(object, property, value) }
                                    if (value === null) {
                                        return "null" }
                                    className = getClass.call(value);
                                    if (className == booleanClass) {
                                        return "" + value } else if (className == numberClass) {
                                        return value > -1 / 0 && value < 1 / 0 ? "" + value : "null" } else if (className == stringClass) {
                                        return quote("" + value) }
                                    if (typeof value == "object") {
                                        for (length = stack.length; length--;) {
                                            if (stack[length] === value) {
                                                throw TypeError() } }
                                        stack.push(value);
                                        results = [];
                                        prefix = indentation;
                                        indentation += whitespace;
                                        if (className == arrayClass) {
                                            for (index = 0, length = value.length; index < length; index++) { element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                                                results.push(element === undef ? "null" : element) }
                                            result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]" } else { forEach(properties || value, function(property) {
                                                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                                                if (element !== undef) { results.push(quote(property) + ":" + (whitespace ? " " : "") + element) } });
                                            result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}" }
                                        stack.pop();
                                        return result } };
                                exports.stringify = function(source, filter, width) {
                                    var whitespace, callback, properties, className;
                                    if (objectTypes[typeof filter] && filter) {
                                        if ((className = getClass.call(filter)) == functionClass) { callback = filter } else if (className == arrayClass) { properties = {};
                                            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1)); } }
                                    if (width) {
                                        if ((className = getClass.call(width)) == numberClass) {
                                            if ((width -= width % 1) > 0) {
                                                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " "); } } else if (className == stringClass) { whitespace = width.length <= 10 ? width : width.slice(0, 10) } }
                                    return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []) } }
                            if (!has("json-parse")) {
                                var fromCharCode = String.fromCharCode;
                                var Unescapes = { 92: "\\", 34: '"', 47: "/", 98: "\b", 116: "	", 110: "\n", 102: "\f", 114: "\r" };
                                var Index, Source;
                                var abort = function() { Index = Source = null;
                                    throw SyntaxError() };
                                var lex = function() {
                                    var source = Source,
                                        length = source.length,
                                        value, begin, position, isSigned, charCode;
                                    while (Index < length) { charCode = source.charCodeAt(Index);
                                        switch (charCode) {
                                            case 9:
                                            case 10:
                                            case 13:
                                            case 32:
                                                Index++;
                                                break;
                                            case 123:
                                            case 125:
                                            case 91:
                                            case 93:
                                            case 58:
                                            case 44:
                                                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                                                Index++;
                                                return value;
                                            case 34:
                                                for (value = "@", Index++; Index < length;) { charCode = source.charCodeAt(Index);
                                                    if (charCode < 32) { abort() } else if (charCode == 92) { charCode = source.charCodeAt(++Index);
                                                        switch (charCode) {
                                                            case 92:
                                                            case 34:
                                                            case 47:
                                                            case 98:
                                                            case 116:
                                                            case 110:
                                                            case 102:
                                                            case 114:
                                                                value += Unescapes[charCode];
                                                                Index++;
                                                                break;
                                                            case 117:
                                                                begin = ++Index;
                                                                for (position = Index + 4; Index < position; Index++) { charCode = source.charCodeAt(Index);
                                                                    if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) { abort() } }
                                                                value += fromCharCode("0x" + source.slice(begin, Index));
                                                                break;
                                                            default:
                                                                abort() } } else {
                                                        if (charCode == 34) {
                                                            break }
                                                        charCode = source.charCodeAt(Index);
                                                        begin = Index;
                                                        while (charCode >= 32 && charCode != 92 && charCode != 34) { charCode = source.charCodeAt(++Index) }
                                                        value += source.slice(begin, Index) } }
                                                if (source.charCodeAt(Index) == 34) { Index++;
                                                    return value }
                                                abort();
                                            default:
                                                begin = Index;
                                                if (charCode == 45) { isSigned = true;
                                                    charCode = source.charCodeAt(++Index) }
                                                if (charCode >= 48 && charCode <= 57) {
                                                    if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) { abort() }
                                                    isSigned = false;
                                                    for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++);
                                                    if (source.charCodeAt(Index) == 46) { position = ++Index;
                                                        for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                                                        if (position == Index) { abort() }
                                                        Index = position }
                                                    charCode = source.charCodeAt(Index);
                                                    if (charCode == 101 || charCode == 69) { charCode = source.charCodeAt(++Index);
                                                        if (charCode == 43 || charCode == 45) { Index++ }
                                                        for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                                                        if (position == Index) { abort() }
                                                        Index = position }
                                                    return +source.slice(begin, Index) }
                                                if (isSigned) { abort() }
                                                if (source.slice(Index, Index + 4) == "true") { Index += 4;
                                                    return true } else if (source.slice(Index, Index + 5) == "false") { Index += 5;
                                                    return false } else if (source.slice(Index, Index + 4) == "null") { Index += 4;
                                                    return null }
                                                abort() } }
                                    return "$" };
                                var get = function(value) {
                                    var results, hasMembers;
                                    if (value == "$") { abort() }
                                    if (typeof value == "string") {
                                        if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                                            return value.slice(1) }
                                        if (value == "[") { results = [];
                                            for (;; hasMembers || (hasMembers = true)) { value = lex();
                                                if (value == "]") {
                                                    break }
                                                if (hasMembers) {
                                                    if (value == ",") { value = lex();
                                                        if (value == "]") { abort() } } else { abort() } }
                                                if (value == ",") { abort() }
                                                results.push(get(value)) }
                                            return results } else if (value == "{") {
                                            results = {};
                                            for (;; hasMembers || (hasMembers = true)) {
                                                value = lex();
                                                if (value == "}") {
                                                    break }
                                                if (hasMembers) {
                                                    if (value == ",") { value = lex();
                                                        if (value == "}") { abort() } } else { abort() } }
                                                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") { abort() }
                                                results[value.slice(1)] = get(lex())
                                            }
                                            return results
                                        }
                                        abort()
                                    }
                                    return value
                                };
                                var update = function(source, property, callback) {
                                    var element = walk(source, property, callback);
                                    if (element === undef) { delete source[property] } else { source[property] = element } };
                                var walk = function(source, property, callback) {
                                    var value = source[property],
                                        length;
                                    if (typeof value == "object" && value) {
                                        if (getClass.call(value) == arrayClass) {
                                            for (length = value.length; length--;) { update(value, length, callback) } } else { forEach(value, function(property) { update(value, property, callback) }) } }
                                    return callback.call(source, property, value) };
                                exports.parse = function(source, callback) {
                                    var result, value;
                                    Index = 0;
                                    Source = "" + source;
                                    result = get(lex());
                                    if (lex() != "$") { abort() }
                                    Index = Source = null;
                                    return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result }
                            }
                        }
                        exports["runInContext"] = runInContext;
                        return exports
                    }
                    if (freeExports && !isLoader) { runInContext(root, freeExports) } else {
                        var nativeJSON = root.JSON,
                            previousJSON = root["JSON3"],
                            isRestored = false;
                        var JSON3 = runInContext(root, root["JSON3"] = { noConflict: function() {
                                if (!isRestored) { isRestored = true;
                                    root.JSON = nativeJSON;
                                    root["JSON3"] = previousJSON;
                                    nativeJSON = previousJSON = null }
                                return JSON3 } });
                        root.JSON = { parse: JSON3.parse, stringify: JSON3.stringify } }
                    if (isLoader) { define(function() {
                            return JSON3 }) }
                }).call(this)
            }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
        }, {}],
        51: [function(_dereq_, module, exports) { module.exports = toArray;

            function toArray(list, index) {
                var array = [];
                index = index || 0;
                for (var i = index || 0; i < list.length; i++) { array[i - index] = list[i] }
                return array } }, {}]
    }, {}, [31])(31)
});
