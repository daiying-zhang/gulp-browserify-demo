module.exports = {
    initialize: function(id){
        this.el = document.querySelector(id);
        this.listContainer = this.el.querySelector('.j-container');
    },

    rendList: function(list){
        console.info('rendList()');

        var tmpl = require('./tmpl/todoList.mustache');
        var rendData = preHandelList(list || []);
        var html = tmpl.render(rendData);

        this.listContainer.innerHTML = html;
    },

    removeItem: function(index){
        console.info('removeItem(' + index + ')');
        var item = this.listContainer.querySelector('[data-index="' + index + '"]');
        this.listContainer.removeChild(item);
    },

    addItem: function(){
        console.info('addList');
    },

    updateCount: function(count){
        this.el.querySelector('.j-count').innerHTML = (count || 0) + ' items left'
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
