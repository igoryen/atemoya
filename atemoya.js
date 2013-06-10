// 1 
const BASE_URL = "https://www.transifex.com/api/2/project/";
const DEFAULT_DIR = 'locale';
const DEFAULT_PROJECT = 'amore';

// 2
var fs = require('fs'),
mkpath = require('mkpath'),
path = require('path'),
request = require('request'),
detailsPath = '/?details',
url = BASE_URL + options.project + detailsPath;

console.log("dbg: past declarations");

function importFromTransifex(options)
{
  var authHead = 'Basic' + new Buffer(options.user).toString('base64');

  function writeFile(relPath, exports, callback)
  {
    callback = callback || function(){};

    var absPath = path.join(options.dir, relPath);

    mkpath(path.dirname(absPath), function (err)
    {
      if (err)
      {
        return callback(err);
      }
      fs.writeFile(absPath, exports, {encodig: "utf-8"}, callback);
    });
  } // writeFile()

  function projectRequest (url, callback)
  {
    request.get(  { url:url, headers:{'Authorization': authHeader} }, function (error, response, body)
    {
      if (error)
      {
        callback(error);
      }
      if (response.statusCode !== 200)
      {
        callback(Error (url + " returned " + response.statusCode));
      }

      callback(null, body);

    } ); // request.get()
  } // projectRequest()


  projectRequest(url, function (error, projectDetails) 
  {
    if (error)
    {
      return console.log("Cannot return the project details");
    }

    var resources =  JSON.parse(projectDetails);

    resources.teams.forEach(function (entry)
    {
      resourcePath = resources.resources[0].slug + '/translation/' + entry;

      var url = BASE_URL + options.project + '/resource/' + resourcePath + '/?file';

      projectRequest (url, function (error, fileContent)
      {
        if (error)
        {
          return console.log("Cannot return the fileContent");
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
*/