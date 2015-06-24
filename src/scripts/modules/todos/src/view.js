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
    },

    filter: function(type){
        if(!type){
            type = 'all';
        }
        switch (type) {
            case 'all':
                css(this.el.querySelectorAll('li'), 'display', 'block')
                break;
            case 'active':
                css(this.el.querySelectorAll('li'), 'display', 'none')
                css(this.el.querySelectorAll('li[data-state="active"]'), 'display', 'block')
                break;
            case 'completed':
                css(this.el.querySelectorAll('li'), 'display', 'none')
                css(this.el.querySelectorAll('li[data-state="completed"]'), 'display', 'block')
                break;

        }

        var btns = this.el.querySelectorAll('button');
        for(var i = 0, len = btns.length; i < len; i++){
            btns[i].classList.remove('active')
        }
        this.el.querySelector('button[data-type="' + type + '"]').classList.add('active')


        function css(list, key, val){
            for(var i = 0, len = list.length; i < len; i++){
                list[i].style[key] = val
            }
        }
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
