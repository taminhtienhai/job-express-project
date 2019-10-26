$(() => {

    // SAVE THE CURRENT INPUT
    $("input").change(function () {
        sessionStorage.first_name = $("[name='first_name']").val()
        sessionStorage.last_name = $("[name='last_name']").val()
        sessionStorage.seekerEmail = $("[name='email']").val()
        sessionStorage.seekerPass = $("[name='password']").val()
        sessionStorage.seekerConfirm = $("[name='confirm']").val()
    })

    $("[name='first_name']").val(sessionStorage.first_name)
    $("[name='last_name']").val(sessionStorage.last_name)
    $("[name='email']").val(sessionStorage.seekerEmail)
    $("[name='password']").val(sessionStorage.seekerPass)
    $("[name='confirm']").val(sessionStorage.seekerConfirm)
})