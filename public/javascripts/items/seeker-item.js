$(()=>{
    const name = $("[name='full_name']")
    const age = $("[name='age']")
    const primary_info = $("[name='primary_info']")
    const skill = $("[name='skill']")
    const address = $("[name='address']")
    const phone = $("[name='phone']")
    const email = $("[name='email']")

    $(".card").click(function () {
        let user = $(this).find("[name='user']").text()
        $.post('/employer/seeker-info',{ user: user }).done(function (data) {
            let first_name = data.first_name?data.first_name.S:'No data'
            let last_name = data.last_name?data.last_name.S:'No data'
            // PRIMARY INFO OF SEEKER
            name.text(first_name+' '+last_name)
            age.text(data.old?data.old.S:'No data')
            primary_info.text(data.primary_info?data.primary_info.S:'No data')
            skill.text(data.skill?data.skill.S:'No data')
            address.text(data.address?data.address.S:'No data')
            phone.text(data.phone?data.phone.S:'No data')
            email.text(data.email?data.email.S:'No data')

            // PROFILE SEEKER

        }).fail(function () {

        })
    })
})