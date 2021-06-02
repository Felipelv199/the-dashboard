
/*
$.get("/api/data/age", { firstAge: 15, lastAge: 20})
    .done( ( data ) => {
        console.log( data )
    })*/

    /*
    $.get("/api/data/decease")
    .done( ( data ) => {
        console.log( data )
    })*/

var info = null;

    $.get("/api/data/decease")
    .done( ( data ) => {
        info = data;
        console.log( data )
    })
