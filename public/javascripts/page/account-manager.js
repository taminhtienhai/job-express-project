$(()=>{
    $.get('/employer/account-data').done(function (data) {
        $("[name='user']").val(data.user.S)
        $("[name='company_name']").val(data.company_name.S)
        $("[name='address']").val(data.address.S)
        $("[name='contact']").val(data.contact_name.S)
        $("[name='phone']").val(data.phone.S)
    }).fail(function(){
        alert('fail')
    })
})