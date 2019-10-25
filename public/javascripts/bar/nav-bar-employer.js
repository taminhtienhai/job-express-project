$(function () {

    $(document).on("click","#logout",function () {
        $.post('/employer/logout').done(()=>{
            window.location.href = '/employer'
        }).fail(()=>{

        })
    })
})