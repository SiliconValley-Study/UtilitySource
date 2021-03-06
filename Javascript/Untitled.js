/**
 * String 형태의 URL 을 Object 로 변환하는 함수
/**/
function param2obj( strParam ){
    if( typeof strParam !== "string" ) return strParam || {};

    var params = strParam.split( "&" )
        , obj = {};

    for( var li in params ){
        var variable = params[ li ].split( "=" )
            , varName = variable[ 0 ]
            , val = variable[ 1 ];

        if( !varName ) continue;

        if( !obj.hasOwnProperty(varName) ){
            obj[ varName ] = val;
            continue;
        }

        var arr = obj[ varName ];

        if( arr instanceof Array )
            arr[ arr.length ] = val
        else
            obj[ varName ] = [ arr, val ]; //중복되는 값이 생겼을 때 배열로 생성하면서 기존 값, 새로 넣을 값을 추가
    }

    return obj;
}
/**
 * 동적 Form 을 사용하여 Data 를 전송하는 함수 ( Popup 가능 - 선택사항 )
/**/
function sendData( $, url, param, options ){
    if( !url || !$ instanceof Object || !$.prototype.jquery ) return; //TODO. jQuery 없이도 동작할 수 있도록 변경 해야 함

    param = param2obj( param );
    options = param2obj( options );

    if( typeof param !== "object" ) return;

    var time = new Date().getTime()
        , formId = "testForm" + time
        , formSelector = "#" + formId
        , isPopup = options.type === "popup"
        , method = options.method || "post"
        , target = options.target || ( isPopup ? "popup" + time : "" ) //전송 타겟이 팝업일때 타겟명이 없는 경우 팝업창을 계속 생성 하게 된다.
        , textHTML = [ "<form id=\"", formId, "\" method=\"" + method + "\" target=\"" + target + "\" action=\"", url, "\">" ];

    if( isPopup ){
        var width = options.width || 600
            , height = options.height || 500
            , top = options.top || screen.availWidth / 2 - ( width / 2 )
            , left = options.left || screen.availHeight / 2 - ( height / 2 )
            , popupOptions = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left + ",scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0";

        window.open( "", target, popupOptions );
    }

    for( var li in param )
        textHTML[ textHTML.length ] = "<input type=\"hidden\" name=\"" + li + "\" value=\"" + param[ li ] + "\" />";

    textHTML[ textHTML.length ] = "</form>";
    $( "body" ).append( textHTML.join("") ); //TODO. jQuery 없을 때 native code 로 처리 하는 로직 추가 해야 함
    $( formSelector )
                    .submit()
                    .remove();
}

/**
//Usage
sendData( jQuery, "view.jsp"
, {
    "boardType": "free"
    , "id": 50
}
, {
    "type": "popup"
    , "target": "boardView"
    , "width": 900
    , "height": 600 
});
/**/
