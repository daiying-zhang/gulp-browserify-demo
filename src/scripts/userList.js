(function(){
    var userListTMPL = require('../template/userList.mustache');
    var html = userListTMPL.render({
        data: [
            {
                name: 'zdy',
                sex: '男'
            },
            {
                name: '李思',
                sex: '女'
            }
        ]
    });

    document.querySelector('#j-users').innerHTML = html;
})();
