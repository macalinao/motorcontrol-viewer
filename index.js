$(function(){
  $("#receiver")
    .on("dragover", function(e) {
      $(this).addClass("hover");
      e.preventDefault();
    })
    .on("dragend", function() {
      $(this).removeClass("hover");
    })
    .on("drop", function(e) {
      $(this).removeClass("hover");
      e.stopPropagation();
      e.preventDefault();
      console.log(e)

      var file = e.originalEvent.dataTransfer.files[0];
      var reader = new FileReader();

      $(reader).on("load", function(e) {
        console.log(e.target.result);
      });

      reader.readAsText(file, "UTF-8");
    })
});
