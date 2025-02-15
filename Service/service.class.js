class Service {


    constructor(){

    }

    getMod( path, json = false ){ // function indentifier #1245
        if(app.FileExists(path)){
           if(json) return JSON.parse(app.ReadFile(path));
           else  return app.ReadFile(path);
        }

       return "ASS_1245";
    }

    integrate(){
       return this.getMod("Service/integrate.json", true);
    }
}