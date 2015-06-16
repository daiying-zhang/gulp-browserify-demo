module.exports = {
    initialize: function(view, data){
        this.view = view;
        this.data = data;

        this.view.rendList(this.data.getData());

        this.bindEvent();
    },

    bindEvent: function(){
        var view = this.view;
        var data = this.data;
        var el = view.el;

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
            }
        });

        // 事件代理
        el.addEventListener('click', function(eve){
            var tar = eve.target;
            if(tar.classList.contains('j-remove')){
                eve.preventDefault();
                view.removeItem(tar.parentNode.dataset.index);
            }
        });
    }
}
