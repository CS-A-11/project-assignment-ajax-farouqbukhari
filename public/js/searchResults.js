$(document).ready(function(){
	$("#searchProds").keyup(function(){
        var title = $('#searchProds').val();
		$.ajax({
        url: '/search/'+ title,
		type: 'GET',
        dataType: 'json',
        contentType: 'json',
		success: function(data){
            console.log("Success");
            $("#suggesstion-box").css("display","block");
            console.log(data);
			$("#suggesstion-box").html(data);
			$("#searchProds").css("background","#FFF");
        },
        error: function(xhr , status){
            $("#searchProds").css("background","#FFF");
          console.log(xhr);
          console.log(status);
        },
        complete: function(xhr , status){
          console.log("Complete");
        }
		});
    });
});
//To select Product name
//function selectProduct(val) {
//$("#searchProds").val(val);
//$("#suggesstion-box").hide();
//}