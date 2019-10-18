$(function () {
    let content = $(".dropdown-menu").html()
    $("button[name='seeker-menu']").popover(
        {html: true,content: content, container: 'body',trigger: 'focus', placement: 'bottom'}
    )
    $(document).on("click","#logout",function () {
        $.post('/logout').done(()=>{
            window.location.href = '/'
        }).fail(()=>{

        })
    })
})