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
