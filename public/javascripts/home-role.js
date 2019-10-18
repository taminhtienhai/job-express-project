$(()=>{
    $(document).on('click',"button[name='s-role']",function () {

        $.post('/employer').done(()=>{
            window.location.href = '/employer'
        }).fail(()=>{
            alert("directional fail")
        })
    })
    $(document).on('click',"button[name='e-role']",function () {
        $.post('/').done(()=>{
            window.location.href = '/'
        }).fail(()=>{
            alert("directional fail")
        })
    })
})