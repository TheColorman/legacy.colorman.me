window.onscroll = function() {  //når der scrolles
    var scrollPos = window.pageYOffset; //hvor langt er der scrollet
    if (scrollPos > 20) {   //hvis man har scrollet langt nok ned...
        //så gør baggrunden af min navigationsbar solid 
        document.getElementById("navbar").style.backgroundColor = "rgba(0, 63, 105, 1)";
    } else {    //hvis man scroller op i toppen igen...
        //så gør baggrunden af min navigationsbar gennemsigtig.
        document.getElementById("navbar").style.backgroundColor = "rgba(0, 63, 105, 0)";
    }
}