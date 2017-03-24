(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.Paginate = factory();
    }
}(this, function () {
    var Tmps = {
        ctn: [
            '{{if prev}}',
            '<div class="btn-prev{{page_count <= page_size ? " hideBtn" : ""}}">{{prev_text}}</div>',
            '{{/if}}',
            '<div class="page-box">',
                '<ul class="main-page-list">',

                '{{each data as item i}}',
                '<li class="page" data-page="{{item.page}}">{{item.page}}</li>',
                '{{/each}}',

                '{{if redirect}}',
                '<li class="redirect">',
                '<input type="text" class="input">',
                '<span class="btn">{{redirect_text}}</span>',
                '</li>',
                '{{/if}}',
                '</ul>',
            '</div>',
            '{{if next}}',
            '<div class="btn-next{{page_count <= page_size ? " hideBtn" : ""}}">{{next_text}}</div>',
            '{{/if}}'
        ].join('')
    };

    var _tostring = {}.toString;

    var _helper = function(type) {
        return function(obj) {
            return '[object ' + type + ']' === _tostring.call(obj);
        }
    };

    var _each = function (arr,fn){for(var i=0,len=arr.length;i<len;i++){fn(arr[i], i, arr);}};

    var template = {};
    template.brackets = "{{ }}";

    var _html = function (str) {
        return '"' + str.replace(/("|'|\\)/g, '\\$1') + '"';
    };

    var _logic = function (str) {
        var arr = str.split(' ');
        var keyword = arr[0];
        var ret = "";
        switch (keyword) {
            case 'if':
                ret = '(function (){return !me.' + arr[1] + '?"":""';
                break;
            case '/if':
                ret = '""})()';
                break;
            case 'each':
                var eachCode = _each.toString();
                var keyname = arr[3] ? arr[3] : '$value';
                ret = '(function (){var each=' + eachCode + ';var r="";each(me.' + arr[1] + ',function ($v,$i){r+=(function (){me.' + keyname + '=$v;return ""';
                break;
            case '/each':
                ret = '""})()});return r;})()';
                break;
            default:
                var keys = str.replace(/\/\*.*?\*\/|'[^']*'|"[^"]*"|\.[\$\w]+/g, '').split(/[^\$\w\d]+/);
                var s = "";
                var pos = 0;
                _each(keys, function (key) {
                    if (key) {
                        pos = str.indexOf(key) + key.length;
                        s += str.substr(0, pos).replace(key, 'me.' + key);
                    }
                });
                s += str.substr(pos);
                ret = '(function (){return ' + s + '})()';
        }
        return ret;
    };

    template.render = function (t, obj) {
        var tags = template.brackets.split(' ');
        var openTag = tags[0];
        var closeTag = tags[1];
        var factory = [];
        _each(t.split(openTag), function (code) {
            code = code.split(closeTag);
            var $0 = code[0];
            var $1 = code[1];
            if (code.length === 1) {
                factory.push(_html(code[0]));
            }
            else {
                factory.push(_logic($0));
                if ($1) {
                    factory.push(_html($1));
                }
            }
        });
        factory = "return " + factory.join("+");
        return new Function('me', factory);
    };

    var _isObject = _helper('Object');
    var _isString = _helper('String');
    var _slice = Array.prototype.slice;

    var noop = function() {};

    var _proxy = function (dom, fn, ctx) {
        var cb = dom.onclick;
        var self = ctx;

        dom.onclick = function (evt) {
            var event = _fix(evt);
            if (fn.call(self, event) !== false) {
                cb.call(self, event);
            }
        };
    };

    var _fix = function (evt) {
        var event = evt || window.event;

        if (event.target) {
            return event;
        }

        var ret = {};

        for (var i in event) {
            ret[i] = event[i];
        }

        ret.target = event.srcElement || document;
        ret.preventDefault = function preventDefault() {
            event.returnValue = false;
        };
        ret.stopPropagation = function stopPropagation() {
            event.cancelBubble = false;
        };

        return ret;
    };

    var __trim = String.prototype.trim;

    var _trim = (function () {
        if (__trim) {
            return function (str) {
                return __trim.call(str);
            };
        }
        return function (str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    })();

    var _dom = document.createElement('a');

    var _hasClass = (function () {
        if (_dom.classList) {
            return function (elm, name) {
                return elm.classList.contains(name);
            };
        }
        return function (elm, name) {
            return el.className.match(new RegExp('(\\s|^)(' + name + ')(\\s|$)'));
        };
    })();

    var _addClass = (function () {
        if (_dom.classList) {
            return function (elm, name) {
                if (elm && name && !_hasClass(elm, name)) {
                    elm.classList.add(name);
                }
            };
        }
        return function (elm, name) {
            if (elm && name && !_hasClass(elm, name)) {
                elm.className += _trim(elm.className) + ' ' + name;
            }
        };
    })();

    var _removeClass = (function () {
        if (_dom.classList) {
            return function (elm, name) {
                if (elm && name && _hasClass(elm, name)) {
                    elm.classList.remove(name);
                }
            };
        }
        return function (elm, name) {
            if (elm && name && _hasClass(elm, name)) {
                el.className = el.className.replace(RegExp('(\\s|^)(' + cls + ')(\\s|$)'), '$3');
            }
        };
    })();



    var _extend = function () {
        var args = _slice.call(arguments, 1);
        var s = arguments[0];
        for (var i = 0, len = args.length; i < len; i++) {
            var m = args[i];
            for (var key in m) {
                if (m.hasOwnProperty(key)) {
                    s[key] = m[key];
                }
            }
        }
        return s;
    };

    var Paginate = function(options) {

        if (!options) {
            throw new Error('missing params, options is required');
        }

        if (!options.container) {
            throw new Error('missing params, container is required');
        }

        if (!options.page_count) {
            throw new Error('missing params, page_count is required');
        }

        this.$con = options.container;

        // 记录开始的页
        this.page = 1;
        this.default = {
            page_size: 5,
            prev: true,
            next: true,
            redirect: false,
            redirect_text: 'go',
            prev_text: '',
            next_text: '',
            page_count: 0
        };

        // 初始化配置
        this.options = this.config(options);

        this.init();
    }
    Paginate.prototype = {

        constructor: Paginate,

        init: function() {

            /**
             * 事件回调池
             * 为用户提供两种不同的事件绑定方式
             * 此类为自定义事件触发类型
             */
            this._cbs = {};

            // 初始化事件
            this.initEvt();

            // 初始化渲染
            this.render(1, 1 + this.config('page_size'));
        },

        /**
         * 注册自定义事件
         */
        on: function(evt, cb) {
            this._cbs[evt] = cb;
        },

        /**
         * 销毁自定义事件
         */
        off: function(evt) {
            if (evt) {
                delete this._cbs[evt];
            }
            else {
                this._cbs = {};
            }
        },

        /**
         * 触发自定义事件
         */
        fire: function(evt) {
            var argv = _slice.call(arguments);
            var evt = argv[0];
            var params = argv.slice(1);
            return this._cbs[evt] ? this._cbs[evt].apply(evt, params) : noop();
        },

        /**
         * 获取配置或者设置配置
         */
        config: function(key, value) {
            if (_isObject(key)) {
                // console.log(_extend({}, this.default, key))
                return _extend({}, this.default, key);
            }
            if (_isString(key)) {
                if (value === undefined) {
                    return this.options[key];
                } else {
                    this.options[key] = value;
                }
            }
        },

        /**
         * 初始化dom事件
         */
        initEvt: function() {
            var self = this;
            var handler = self.handler;
            self.$con.onclick = noop;
            _proxy(self.$con, function (e) {
                var cname = e.target.className;
                switch (cname) {
                    case 'btn-next':
                        handler.next.call(self);
                        break;
                    case 'btn-prev':
                        handler.prev.call(self);
                        break;
                    case 'page':
                        handler.page.call(self, e);
                        break;
                    case '.btn':
                        handler.redirect.call(self, e, e.target)
                }
            }, self);
            self.$con.onkeyup = function (e) {
                var event = _fix(e);
                if (event.keyCode === 13) {
                    handler.redirect.call(self, evt, e.target);
                }
            };
        },

        destory: function() {
            this.$con.onclick = null;
            this._cbs = {};
            this.$con.innerHTML = '';
        },

        /**
         * 内部方法，
         * 制造一份数据，用于产生分页
         */
        _make: function(pageStart, pageEnd) {
            var ret = [];

            // 如果开始页小于1
            // 重置开始和结束页
            if (pageStart < 1) {
                pageStart = 1;
                pageEnd = pageStart + this.config('page_size');
            }

            // 如果结束页大于总数
            // 重置结束页
            // 注意，此处未重置开始页的位置，如果开始页到结束页的间隔不足显示数量会留有空隙
            if (pageEnd > this.config('page_count')) {
                pageEnd = this.config('page_count') + 1;
            }

            for (var i = pageStart; i < pageEnd; i++) {
                ret.push({
                    page: i
                });
            }

            return ret;
        },


        /**
         * 渲染方法,渲染分页显示
         * @param  {Number} pageStart 开始页
         * @param  {Number} pageEnd 结束页
         * @param  {Number} direction 方向
         * @param  {Number} curr 选中的是哪一页
         */
        render: function(pageStart, pageEnd, direction, curr) {
            var self = this;
            var render = template.render(Tmps.ctn);
            var options = {
                data: self._make(pageStart, pageEnd),
                next: self.config('next'),
                prev: self.config('prev'),
                prev_text: self.config('prev_text'),
                next_text: self.config('next_text'),
                redirect: self.config('redirect'),
                redirect_text: self.config('redirect_text'),
                page_count: self.config('page_count'),
                page_size: self.config('page_size')
            };


            self.$con.innerHTML = render(options);

            // 如果方向为前一页，选中最后当屏的最后一页
            if (direction === -1) {
                self.page = options.data[options.data.length - 1].page;
            } else {
                // 要不然选中第一页
                self.page = options.data[0].page;
            }

            // 如果有指定选中页，修正选中页
            if (curr !== undefined) {
                self.page = options.data[curr].page;
            }

            self.setCur(self.page);
        },

        /**
         * 设置选中状态
         */
        setCur: function(page) {
            // ie bug ; nodeList不能用slice
            var pages = this.$con.getElementsByTagName('li');
            for (var i = 0, len = pages.length; i < len; i++) {
                _removeClass(pages[i], 'cur');
                if (pages[i].getAttribute('data-page') == page) {
                    _addClass(pages[i], 'cur');
                }
            }
        },

        handler: {
            next: function() {
                var self = this;

                var run = self.fire('nextClick', self.page);

                if (run === undefined || run === true) {
                    var count = self.config('page_count');

                    var size = self.config('page_size');

                    var doms = self.$con.getElementsByTagName('li');
                    var lastpage;

                    for (var i = 0, len = doms.length; i < len; i++) {
                        if (doms[i].className.indexOf('page') !== -1) {
                            lastpage = doms[i];
                        }
                    }

                    var page = lastpage.getAttribute('data-page') | 0;

                    if (page >= count) {
                        return;
                    }

                    // 真正的执行next事件

                    self.render(page + 1, page + size + 1);
                    self.fire('nextClicked', self.page);
                    self.fire('pageClicked', self.page);
                }
            },

            prev: function() {
                var self = this;
                var run = self.fire('prevClick', self.page);

                if (run === undefined || run === true) {
                    var count = self.config('page_count');

                    var size = self.config('page_size');

                    if (self.page <= 1) {
                        return;
                    }

                    // 真正的执行next事件
                    // 
                    var doms = self.$con.getElementsByTagName('li');
                    var firstpage;

                    for (var i = 0, len = doms.length; i < len; i++) {
                        if (doms[i].className.indexOf('page') !== -1) {
                            firstpage = doms[i];
                            break;
                        }
                    }

                    var page = firstpage.getAttribute('data-page') | 0;

                    self.render(page - size, page, -1);
                    self.fire('prevClicked', self.page);
                    self.fire('pageClicked', self.page);
                }
            },

            page: function(evt) {
                var self = this;
                var $page = evt.target;
                var page = $page.getAttribute('data-page') | 0;
                if (page === self.page) {
                    return;
                }

                var run = this.fire('pageClick');

                if (run === undefined || run === true) {
                    self.page = page;
                    self.setCur(self.page);
                    self.fire('pageClicked', self.page);
                }
            },

            redirect: function(evt, target) {
                var self = this;
                var page = parseInt(self.$con.getElementsByTagName('input')[0].value);
                if (!page ||
                    page < 1 ||
                    page > self.config('page_count') ||
                    page === self.page
                ) {
                    return;
                }
                var run = self.fire('redirect', self.page);

                if (run === undefined || run === true) {
                    var count = self.config('page_count');

                    var size = self.config('page_size');

                    var pages = self.$con.getElementsByTagName('li');

                    var $page;

                    for (var i = 0, len = pages.length; i < len; i++) {
                        if (pages[i].getAttribute('data-page') == page) {
                            $page = pages[i];
                            break;
                        }
                    }

                    if ($page) {
                        self.page = page;
                        self.setCur(self.page);
                    } else {
                        var pos = page % size;
                        var start;
                        if (pos === 0) {
                            pos = size;
                        }

                        pos = pos - 1;

                        start = page - pos;

                        self.render(start, start + size, 0, pos);
                    }
                    self.fire('redirected', self.page);
                    self.fire('pageClicked', self.page);
                }
            }
        }
    };

    return Paginate;
}));