// All client side scripts go herSe.
(function ($) {
    let isSubscribed = $('#isSubscribed').val();
    let test = $('#test');
    console.log(isSubscribed);
    if(isSubscribed === "true"){
        test.after(
            `<input type="submit" id="unSubscribe" value="unSubscribe"></input>`
        )
    }else{
        test.after(
            `<input type="submit" id="userSubscribe" value="Subscribe"></input>`
        )
    }

    $('#userSubscribe').on('click',function(event){
        event.preventDefault();
        $.post("url",{

        }).then(res=>{
            location.replace(window.location.href);
        })
    })

})(window.jQuery);