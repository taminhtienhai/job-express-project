$(function () {

    $(document).on("click","#logout",function () {
        $.post('/logout').done(()=>{
            window.location.href = '/'
        }).fail(()=>{

        })
    })
})