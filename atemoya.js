
// 1 
const BASE_URL = "https://www.transifex.com/api/2/project/";
const DEFAULT_DIR = 'locale';
const DEFAULT_PROJECT = 'amore';

// 2
var fs = require('fs'),
mkpath = require('mkpath'),
path = require('path'),
request = require('request');                                    
                                                                console.log("   line 11: past declarations");

function importFromTransifex(options) // 9
{                                                                 console.log('\n   line 13: options --> ' + options); 

  var authHeader = 'Basic' + new Buffer(options.user).toString('base64');  // 7
                                                                 console.log('   line 16: authHeader --> ' + authHeader);
  function writeFile(relPath, exports, callback)      
  {                                                              console.log('   \nline 18: in writeFile(): relPath --> ' + relPath + '; exports --> ' + exports + '; callback --> '+callback);
    callback = callback || function(){};
    var absPath = path.join(options.dir, relPath);               console.log('   line 21: absPath --> ' + absPath);


    mkpath(path.dirname(absPath), function ( err ) // 11 ?
    {
      if (err)
      {
        return callback(err);
      }
      fs.writeFile(absPath, exports, {encodig: "utf-8"}, callback);
    });
  } // writeFile()




  function projectRequest (url, callback) // 5
  {
    request.get(  { url:url, headers:{'Authorization': authHeader} }, function (error, response, body) // 8 ?
    {                                                           console.log('\n   line 39: in function projectRequest(): \nurl --> ' + url + '; \nauthHeader --> '+authHeader+'; \nerror --> ' + error + '; \nresponse --> ' + response + '; \nresponse.statusCode --> ' + response.statusCode +  '; \nbody --> ' + body);
      if (error)
      {
        callback(error);
      }

      if (response.statusCode !== 200)
      {                                                          console.log('   line 47: in the if(response.statusCode !==200)');
        callback( Error (url + " returned " + response.statusCode));  // 10
      }

      callback(null, body);

    }); // request.get()
  }; // projectRequest() // 12


  var detailsPath = '/?details',
      url = BASE_URL + options.project + detailsPath; // 3




  projectRequest(url, function (error, projectDetails) // 4 ?
  {                                                                console.log('\n   line 63: in projectRequest(): \nerror --> '+ error +'; \nprojectDetails --> ' + projectDetails);

    if (error)
    {
      return console.log("Cannot return the project details");
    }

    var resources =  JSON.parse(projectDetails); // 6
                                                                    console.log('   line 71: resources: ' + resources);

    resources.teams.forEach(function (entry) //?
    {
      resourcePath = resources.resources[0].slug + '/translation/' + entry;
      var url = BASE_URL + options.project + '/resource/' + resourcePath + '/?file';

      projectRequest (url, function (error, fileContent) // ?
      {
        if (error)
        {
          return console.log("Cannot return the fileContent");
        }

        var filename = entry + '.plist';

        writeFile(filename, fileContent, function (err) //?
        {
          console.log( (err ? "Error writing " : "Wrote ") + filename); // 13
        });// writeFile()

      }); // projectRequest()

    }); //// resources.team.forEach() 

  }); // projectRequest()

} // importFromTransifex 






function main()
{                                                                          console.log('   line 107: entered main()');
  var program = require ('commander');

  program
    .option ('-u, --user <user:pass>', 'Specify your username and password on Transifex like this: John:abc123')
    .option ('-p, --project <slug>', 'Specify project slug')
    .option ('-d, --dir <path>', 'locale directory for the downloaded .plist files')
    .parse(process.argv);
                                                                               console.log('   line 115: past program options declarations');
  if (!program.user)
  {
    console.log('Please specify credentials with "-u user:pw".');
    process.exit(1);
  }

  program.project = program.project || DEFAULT_PROJECT;                             console.log('   line 122: program.project --> '+program.project);
  program.dir = program.dir || DEFAULT_DIR;                                          console.log('   line 123: program.dir --> ' + program.dir);
  importFromTransifex(program);                                               console.log('   line 124: started importFromTransifex()');

} // main()

if (!module.parent)
{                                                                                 console.log('   line 128: entered the if (!module.parent)');
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
  12) end with semicolon (or without?)
  13) error[space]? (...)

*/



