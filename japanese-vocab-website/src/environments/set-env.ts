const setEnv = (path: string = 'environment') => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  require('dotenv').config({
    path: 'src/environments/.env',
  });
  const targetPath = `./src/environments/${path}.ts`;
  const oldFile: string = fs.readFileSync(targetPath, "utf-8");
  const endIndex = oldFile.indexOf('};');
  // `environment.ts` file structure
  const envConfigFile = `${oldFile.substring(0, endIndex).trim()},
    //TODO: think if I really need this here, currently use it hardcoded
    //graphqlApiRoute: 'https://japanese-vocab-graphql-api.onrender.com/graphql',
    emailServiceRoute: '${process.env["EMAIL_SERVICE"]}',
    myEmail: '${process.env['MY_EMAIL']}'
};`.trim();
  writeFile(targetPath, envConfigFile, (err: any) => {
    if(err) {
        console.error(err);
        throw err;
    } else {
        console.log('Angular enviroment.ts generated successfully')
    }
  })
};

setEnv(process.argv[2]);