
function initSign(el, fieldName) {
    jel=$('.'+el);
    
    new ResizeSensor(jel, function(){ 
       $(jel).find('canvas').attr({
            //height: jel.innerHeight(),
            width: jel.innerWidth()
                -($(jel).find('canvas').css('padding-right').split('px').join(''))
                -$(jel).find('canvas').css('padding-left').split('px').join('')
          });
    
        if ($('#'+fieldName).val()) {
            var sig=JSON.parse($('#'+fieldName).val());
            jel.signaturePad({ drawOnly: true,
                defaultAction: 'drawIt',
                validateFields: false,
                lineWidth: 0,
                output: 'input[name='+fieldName+']',
                sigNav: null,
                name: null,
                typed: null,
                clear: 'input[type=reset]',
                typeIt: null,
                drawIt: null,
                typeItDesc: null,
                drawItDesc: null}).regenerate(sig);
            }
        else 
            jel.signaturePad({
                drawOnly: true,
                defaultAction: 'drawIt',
                validateFields: false,
                lineWidth: 0,
                output: 'input[name='+fieldName+']',
                sigNav: null,
                name: null,
                typed: null,
                clear: 'input[type=reset]',
                typeIt: null,
                drawIt: null,
                typeItDesc: null,
                drawItDesc: null
              });
        });

    jel.find('canvas').attr({
            //height: jel.innerHeight(),
            width: jel.innerWidth()
                -($(jel).find('canvas').css('padding-right').split('px').join(''))
                -$(jel).find('canvas').css('padding-left').split('px').join('')
          });
    
}

function clearSign(el) {
    $('.'+el).signaturePad().clearCanvas()
}
//loadScript('ophContent/cdn/signature-pad-master/jquery.signaturepad.js');
loadScript('ophContent/cdn/signature-pad-master/assets/json2.min.js');
loadStyle('ophContent/cdn/signature-pad-master/assets/jquery.signaturepad.css');
loadScript('ophContent/cdn/css-element-queries-1.0.0/src/ResizeSensor.js');