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
