// 1 
const BASE_URL = "https://www.transifex.com/api/2/project/";
const DEFAULT_DIR = 'locale';
const DEFAULT_PROJECT = 'amore';

// 2
var fs = require('fs'),
mkpath = require('mkpath'),
path = require('path'),
request = require('request');


     console.log("   dbg: past declarations");

function importFromTransifex(options) // 9
{
       console.log('   dbg: options: ' + options); 




  var authHeader = 'Basic' + new Buffer(options.user).toString('base64'); // 7
       console.log('   dbg: authHeader: ' + authHeader);

  function writeFile(relPath, exports, callback)
  {
    callback = callback || function(){};
    var absPath = path.join(options.dir, relPath);

        console.log('   dbg: absPath: ' + absPath);


    mkpath(path.dirname(absPath), function (err)
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
    request.get(  { url:url, headers:{'Authorization': authHeader} }, function (error, response, body) // 8
    {                                                  console.log('   dbg: error: ' + error + '; response: ' + response + '; response.statusCode: ' + response.statusCode +  '; body: ' + body);
      if (error)
      {
        callback(error);
      }

      if (response.statusCode !== 200)
      {             console.log('   dbg: in the if(response.statusCode !==200)');
        callback(Error (url + " returned " + response.statusCode));  // 10
      }

      callback(null, body);

    }); // request.get()
  } // projectRequest()


  var detailsPath = '/?details',
      url = BASE_URL + options.project + detailsPath; // 3




  projectRequest(url, function (error, projectDetails) // 4
  {
         console.log('   dbg: projectDetails: ' + projectDetails);

    if (error)
    {
      return console.log("Cannot return the project details");
    }

    var resources =  JSON.parse(projectDetails); // 6
         console.log('   dbg: resources: ' + resources);

    resources.teams.forEach(function (entry)
    {
      resourcePath = resources.resources[0].slug + '/translation/' + entry;
      var url = BASE_URL + options.project + '/resource/' + resourcePath + '/?file';

      projectRequest (url, function (error, fileContent)
      {
        if (error)
        {
          return console.log("   dbg: I cyan return the fileContent");
        }

        var filename = entry + '.plist';

        writeFile(filename, fileContent, function (err)
        {
          console.log( (err? "Error writing " : "Wrote ") + filename);
        });// writeFile()

      }); // projectRequest()

    }); //// resources.team.forEach() 

  }); // projectRequest()

} // importFromTransifex 






function main()
{
       console.log('   dbg: entered main()');
  var program = require ('commander');

  program
  .option ('-u, --user <user:pass>', 'Specify your username and password on Transifex like this: John:abc123')
  .option ('-p --project <slug>', 'Specify project slug')
  .option ('-d --dir <path>', 'locale directory for the downloaded .plist files')
  .parse(process.argv);

  if (!program.user)
  {
    console.log('Please specify credentials with "-u user:pw".');
    process.exit(1);
  }

  program.project = program.project || DEFAULT_PROJECT;
  program.dir = program.dir || DEFAULT_DIR;
  importFromTransifex(program);

} // main()

if (!module.parent)
{
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
  7) this is where it needs the username and pw first.
    encodes acc. to a Base64 scheme (look up in Wikipedia)
  8) pass .. to the header(s)
    error: "null"
    response value is [object Object]
    body value is "Authorization required"
  9) options value is [object Object]

*/