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
    /**
     * 删除数据
     * @param {Number} index
     */
    remove: function(index){
        return todoList.splice(index, 1);
    },

    get: function(index){
        return todoList[index || 0];
    },

    set: function(index, obj){
        return obj && todoList.splice(index || 0, 1, obj);
    },

    clear: function(){
        todoList = [];
    }
}
