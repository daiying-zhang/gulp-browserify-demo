(function(){
    var userListTMPL = require('tmpl/userList.mustache');
    var html = userListTMPL.render({
        data: [
            {
                name: 'zdy',
                sex: '男'
            },
            {
                name: '李思',
                sex: '女'
            },
            {
                name: '王五',
                sex: '男'
            }
        ]
    });
    //Test
    document.querySelector('#j-users').innerHTML = html;
})();
