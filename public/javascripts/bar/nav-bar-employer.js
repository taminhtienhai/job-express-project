$(function () {
    let content = $(".dropdown-menu").html()
    $("button[name='employer-menu']").popover(
        {html: true,content: ()=>{return content}, container: 'body',trigger: 'focus', placement: 'bottom'}
    )

    $(document).on("click","#logout",function () {
        $.post('/employer/logout').done(()=>{
            window.location.href = '/employer'
        }).fail(()=>{

        })
    })
})