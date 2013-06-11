// 1 
const BASE_URL = 'https://www.transifex.com/api/2/project/';
const DEFAULT_DIR = 'locale';
const DEFAULT_PROJECT = 'amore';
// 2
var fs = require('fs'),
  mkpath = require('mkpath'),
  path = require('path'),
  request = require('request');                             

function importFromTransifex(options) { // 14
  var authHeader = 'Basic ' + new Buffer(options.user).toString('base64');  // 15   

  function writeFile( relPath, exports, callback ) {      
    callback = callback || function(){};
    var absPath = path.join(options.dir, relPath);   // 21      
    mkpath(path.dirname(absPath), function( err ) {
      if ( err ) {
        return callback( err );
      }
      fs.writeFile(absPath, exports, { encoding: "utf-8" }, callback);
    });
  }

  function projectRequest (url, callback) { 
    request.get({
      url: url,
      headers: {'Authorization': authHeader}
    }, function(error, response, body) {     // 16 , 19                      
      if (error) {
        callback(error);
      }
      if (response.statusCode !== 200) {                              
        callback(Error(url + " returned " + response.statusCode));
      }
      callback(null, body);
    });
  };     

  var detailsPath = '/?details',
    url = BASE_URL + options.project + detailsPath;
  projectRequest(url, function(error, projectDetails) {    // 17           
    if (error) {
      return console.log("Can not return the project details");
    }
    var resources = JSON.parse(projectDetails);  // 18, 20                      
    resources.teams.forEach(function(entry) {
      resourcesPath = resources.resources[0].slug + '/translation/' + entry;
      var url = BASE_URL + options.project + '/resource/' + resourcesPath + '/?file';
      projectRequest(url, function(error, fileContent){
        if (error) {
          return console.log("Can not return the fileContent");
        }
        var filename = entry + '.plist';
        writeFile(filename, fileContent, function( err ) {
          console.log( ( err ? "Error writing " : "Wrote " ) + filename ); // 22
        });
      });
    });
  });
}

function main() {
  var program = require('commander');
  program
    .option('-u, --user <user:pass>', 'specify a Transifex username and password in the form username:password')
    .option('-p, --project <slug>', 'specify project slug')
    .option('-d, --dir <path>', 'locale dir for the downloaded plist files')
    .parse(process.argv);
  if (!program.user) {
    console.log('please specify credentials with "-u user:pass".');
    process.exit(1);
  }
  program.project = program.project || DEFAULT_PROJECT;
  program.dir = program.dir || DEFAULT_DIR;
  importFromTransifex(program);
}

if (!module.parent) {
  main();
}


/*
=====================================================================
  1) declareing constants
  2) including modules
  3) this var is declared here because this is its scope
  4) projectRequest() is used. It is calling the anonymous function whose parameter is projectDetails 
  5) projectRequest() definition.
  6) expecting a .json file 
  7) Use the username and pw.
    encodes acc. to a Base64 scheme (look up in Wikipedia)
  8) pass .. to the header(s)
    error: "null"
    response value is [object Object]
    body value is "Authorization required"
  9) options value is [object Object]
  10) Create an Error object. Error() is a constructor of an Error object? (part of node.js.)
  11) why is $err orange, not white! 
  12) semicolon here is unnecessary 
  13) error[space]? (...)
  14) value --> [object Object]
  15) authHeader --> Basic aWdvcnllbjpsMGNhbGl6ZXI=
  16) url --> https://www.transifex.com/api/2/project/amore/?details; 
authHeader --> Basic aWdvcnllbjpsMGNhbGl6ZXI=; 
error --> null; 
response --> [object Object]; 
response.statusCode --> 200; 
body --> {
    "feed": "", 
    "last_updated": "2013-06-07T17:42:13.446", 
    "description": "I love you", 
    "tags": "", 
    "trans_instructions": "", 
    "teams": [
        "af", 
        "am", 
        "ar", 
        "as", 
        "az", 
        ~~~~~~~
        "vec", 
        "ady", 
        "cv"
    ], 
    "maintainers": [
        {
            "username": "aali"
        }, 
        {
            "username": "igoryen"
        }
    ], 
    "private": false, 
    "slug": "amore", 
    "auto_join": false, 
    "outsource": null, 
    "fill_up_resources": true, 
    "bug_tracker": "", 
    "source_language_code": "en_US", 
    "owner": {
        "username": "aali"
    }, 
    "homepage": "", 
    "long_description": "", 
    "resources": [
        {
            "slug": "en", 
            "name": "en_US.plist"
        }
    ], 
    "name": "amore"
}
17) 
error --> null; 
projectDetails --> {
    "feed": "", 
    "last_updated": "2013-06-07T17:42:13.446", 
    "description": "I love you", 
    "tags": "", 
    "trans_instructions": "", 
    "teams": [
        "af", 
        "am", 
        "ar", 
        "as", 
       ~~~~~~~
        "os", 
        "tn", 
        "vec", 
        "ady", 
        "cv"
    ], 
    "maintainers": [
        {
            "username": "aali"
        }, 
        {
            "username": "igoryen"
        }
    ], 
    "private": false, 
    "slug": "amore", 
    "auto_join": false, 
    "outsource": null, 
    "fill_up_resources": true, 
    "bug_tracker": "", 
    "source_language_code": "en_US", 
    "owner": {
        "username": "aali"
    }, 
    "homepage": "", 
    "long_description": "", 
    "resources": [
        {
            "slug": "en", 
            "name": "en_US.plist"
        }
    ], 
    "name": "amore"
}
18) resource --> [object Object]
19) 
url --> https://www.transifex.com/api/2/project/amore/resource/en/translation/am/?file; 
authHeader --> Basic aWdvcnllbjpsMGNhbGl6ZXI=; 
error --> null; 
response --> [object Object]; 
response.statusCode --> 200; 
body --> <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>iloveyou</key>
    <string>አፈቅርሻለሁ</string>
  </dict>
</plist>
20) 
relPath --> am.plist; exports --> <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>iloveyou</key>
    <string>አፈቅርሻለሁ</string>
  </dict>
</plist>
; callback --> function ( err ) {
          console.log( ( err ? "Error writing " : "Wrote " ) + filename );
        }

21) absPath --> importedFiles/am.plist
22) Wrote am.plist

*/



