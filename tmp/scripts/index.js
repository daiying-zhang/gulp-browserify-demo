(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);


},{}],2:[function(require,module,exports){
var view = require('./src/view');
var model = require('./src/model');
var controller = require('./src/controller');

view.initialize('#j-todos');

controller.initialize(view, model);

},{"./src/controller":3,"./src/model":4,"./src/view":6}],3:[function(require,module,exports){
module.exports = {
    initialize: function(view, data){
        this.view = view;
        this.data = data;

        this.data.initialize();
        this.leftCount = this.data.getLeftCount();
        this.view.rendList(this.data.getData())
                 .updateCount(this.leftCount);

        this.bindEvent();
    },

    bindEvent: function(){
        var view = this.view;
        var data = this.data;
        var el = view.el;
        var self = this;

        var input = document.querySelector('#j-text');

        // 添加
        input.addEventListener('keydown', function(eve){
            if(eve.keyCode === 13){
                eve.preventDefault();
                data.add({
                    title: input.value
                });
                input.value = "";
                view.rendList(data.getData());
                self.leftCount++;
                view.updateCount(self.leftCount);
            }
        });

        // 事件代理
        el.addEventListener('click', function(eve){
            var tar = eve.target;

            if(tar.classList.contains('j-remove')){
                // 删除
                eve.preventDefault();
                var index = tar.parentNode.dataset.index;
                // 如果删除的这个没有选中，leftCount减1
                if(!data.get(index)._checked){
                    self.leftCount--
                }
                data.remove(index);
                //view.removeItem(index);
                view.rendList(data.getData());
                view.updateCount(self.leftCount);
            }else if(tar.classList.contains('j-choose')){
                // 选择
                var checked = tar.checked;
                var index = tar.dataset.index;
                var item = data.get(index);

                item._checked = checked;

                self.leftCount += checked ? -1 : 1;

                if(checked){
                    tar.classList.add('disabled');
                    tar.parentNode.classList.add('completed')
                }else{
                    tar.classList.remove('disabled');
                    tar.parentNode.classList.remove('completed')
                }

                view.updateCount(self.leftCount);
                console.log(item);
                data.save();
            }
        });
    }
}

},{}],4:[function(require,module,exports){
var todoList = [];

module.exports = {
    initialize: function(){
        this.load();

    },
    /**
     * 获取数据
     */
    getData: function(){
        return todoList;
    },

    /**
     * 添加数据
     * @param {Object} item
     * @param {Number} [index]
     */
    add: function(item, index){
        //TODO 处理index
        item && todoList.push(item);
        this.save();
        return todoList.length;
    },
    /**
     * 删除数据
     * @param {Number} index
     */
    remove: function(index){
        var res = todoList.splice(index, 1);
        this.save();
        return res;
    },

    get: function(index){
        return todoList[index || 0];
    },

    set: function(index, obj){
        var res = obj && todoList.splice(index || 0, 1, obj);
        if(res){
            this.save();
        }
        return res
    },

    clear: function(){
        todoList = [];
    },

    save: function(){
        localStorage.setItem('d-todos', JSON.stringify(todoList));
        return this.sync();
    },

    load: function(){
        var dTodos = localStorage.getItem('d-todos');

        if(dTodos){
            todoList = JSON.parse(dTodos)
        }
    },

    getLeftCount: function(){
        var i = 0, list = todoList, len = list.length, count = len;
        if(len){
            for(; i<len; i++){
                if(list[i]._checked){
                    count--;
                }
            }
        }
        return count;
    },

    sync: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/todos/api/todos.do');

        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400){
                success(xhr.responseText)
            }
        }

        xhr.send();

        function success(text){
            var json = JSON.parse(text);
            if(json.ret){
                console.log(json.data);
            }
        }
        return this
    }
}

},{}],5:[function(require,module,exports){
var t = new (require('hogan.js/lib/template')).Template(function(c,p,i){var _=this;_.b(i=i||"");if(_.s(_.f("list",c,p,1),c,p,0,9,419,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <li class=\"item\" data-index=\"");_.b(_.v(_.f("index",c,p,0)));_.b("\">");_.b("\n" + i);_.b("        <label class=\"");if(_.s(_.f("_checked",c,p,1),c,p,0,90,99,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("completed");});c.pop();}_.b("\">");_.b("\n" + i);_.b("            <input data-index=\"");_.b(_.v(_.f("index",c,p,0)));_.b("\" type=\"checkbox\" class=\"choose ");if(_.s(_.f("_checked",c,p,1),c,p,0,200,208,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("disabled");});c.pop();}_.b(" j-choose\" name=\"name\" value=\"\" ");if(_.s(_.f("_checked",c,p,1),c,p,0,266,273,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked");});c.pop();}_.b(">");_.b("\n" + i);_.b("            <div class=\"title\">");_.b(_.v(_.f("title",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("        </label>");_.b("\n" + i);_.b("        <button class=\"j-remove remove\">&times;</button>");_.b("\n" + i);_.b("    </li>");_.b("\n");});c.pop();}return _.fl();;});module.exports = {  render: function () { return t.render.apply(t, arguments); },  r: function () { return t.r.apply(t, arguments); },  ri: function () { return t.ri.apply(t, arguments); }};
},{"hogan.js/lib/template":1}],6:[function(require,module,exports){
module.exports = {
    initialize: function(id){
        this.el = document.querySelector(id);
        this.listContainer = this.el.querySelector('.j-container');
        return this
    },

    rendList: function(list){
        console.info('rendList()');

        var tmpl = require('./tmpl/todoList.mustache');
        var rendData = preHandelList(list || []);
        var html = tmpl.render(rendData);

        this.listContainer.innerHTML = html;
        return this
    },

    removeItem: function(index){
        console.info('removeItem(' + index + ')');
        var item = this.listContainer.querySelector('[data-index="' + index + '"]');
        this.listContainer.removeChild(item);
        return this
    },

    addItem: function(){
        console.info('addList');
        return this
    },

    updateCount: function(count){
        this.el.querySelector('.j-count').innerHTML = (count || 0) + ' items left';
        return this
    }
}

function preHandelList(list){
    list.forEach(function(ele, idx){
        ele.index = idx;
    });
    return {
        list: list
    }
}

},{"./tmpl/todoList.mustache":5}],7:[function(require,module,exports){
require('./../modules/todos')

},{"./../modules/todos":2}]},{},[7]);
