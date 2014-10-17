var Template = function( template ){
        var _template = template
            , _pattern = /(#\{(.*?)\})/g //#{PATTERN}
            , _patternObject = (function( str ){
                if( typeof str !== "string" ) return;

                var obj = {}
                    , vals = str.split( _pattern );

                for( var val in vals ){
                    var match = _pattern.exec( vals[val] );
                    match && ( obj[match[2]] = match[1] );
                }

                return obj;
            })( _template );

        return {
            parse: function( o ){
                if( typeof _template !== "string" ) return;

                var temp = template;

                for( var val in o )
                    temp = temp.split( _patternObject[ val ] ).join( o[val] || "" ); //new 생성시 정의했던 패턴 변수들만 적용된다.

                return temp.replace( _pattern, "" );
            }
        };
    }
    , template = new Template( "this is a #{text}" );

console.log( template.parse({ text: "pen" }) );//결과 : this is a pen
