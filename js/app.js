
$(document).ready(function(){
  var wrapper = document.getElementById("signature-pad"),
  clearButton = wrapper.querySelector("[data-action=clear]"),
  savePNGButton = wrapper.querySelector("[data-action=save-png]"),
  saveSVGButton = wrapper.querySelector("[data-action=save-svg]"),
  canvas = wrapper.querySelector("canvas"),
  signaturePad;

  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    ratiox=canvas.offsetWidth/canvas.width
    canvas.height = canvas.offsetHeight * ratio;
    ratioy=canvas.offsetHeight/canvas.height
    var image = new Image();
    image.src = $('#sig').val();
    canvas.getContext("2d").scale(ratiox, ratioy);
    canvas.getContext("2d").translate(canvas.width/2,canvas.height/2);
    canvas.getContext("2d").drawImage(image,-image.width/2,-image.height/2);
    canvas.getContext("2d").translate(-canvas.width/2,-canvas.height/2)
  }

  window.onresize = resizeCanvas;
  resizeCanvas();

  signaturePad = new SignaturePad(canvas);

  clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
  });
/*
  savePNGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      alert("Please provide signature first.");
    } else {
      $("#sig").val(signaturePad.toDataURL());
    }
  });
  */
  /*
  saveSVGButton.addEventListener("click", function (event) {
  if (signaturePad.isEmpty()) {
  alert("Please provide signature first.");
} else {
window.open(signaturePad.toDataURL('image/svg+xml'));
}
});
*/
});
