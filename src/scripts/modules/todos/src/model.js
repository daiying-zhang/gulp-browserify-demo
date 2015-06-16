var todoList = [];

module.exports = {
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
        return todoList.length;
    },

    remove: function(index){
        return todoList.splice(index, 1);
    },

    update: function(index, obj){
        return obj && todoList.splice(index, 1, obj);
    },

    clear: function(){
        todoList = [];
    }
}
