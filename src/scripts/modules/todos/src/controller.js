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

        var addBtn = el.querySelector('.j-add');

        addBtn.addEventListener('click', function(eve){
            eve.preventDefault();

            data.add({
                title: Math.random()
            });
            view.rendList(data.getData())
        });

        el.addEventListener('click', function(eve){
            eve.preventDefault();

            var tar = eve.target;
            if(tar.classList.contains('j-remove')){
                view.removeItem(tar.parentNode.dataset.index);
            }
        });
    }
}
