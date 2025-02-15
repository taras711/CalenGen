class Service {

     constructor() {
          this.cache = {}

          // add(multilevels): this.setCache("main", object);
          // edit: this.setCache("main", 145, "inl");
          // read: this.getCache("main", "main2")['inl'];
     }

     setCache(name, data, index = false) {
          let _module = {}
          if (name && !index) {
               this.cache[name] = data;
          } else if (name && index) {
               this.cache[name] = this.readLevelIndex(this.cache[name], data, index)
          }
     }

     getCache(name, index = false) {
          if (name && !index) return this.cache[name];
          else if (name && index) {
               return this.readLevelIndex(this.cache[name], null, index, true);
          }

     }

     getMod(path, json = false) { // function indentifier #1245
          if (app.FileExists(path)) {
               if (json) return JSON.parse(app.ReadFile(path));
               else return app.ReadFile(path);
          }

          return "ASS_1245";
     }

     readLevelIndex(object, data, index, read = false) {
          let _level;
          let _keys = Object.keys(object);

          if (_keys.length > 0) {
               for (let k in object) {
                    if (object.hasOwnProperty(k)) {
                         if (index && k == index) {

                              if (!read && data !== null) object[k] = data;
                              else {
                                   _level = object[k];
                                   break;
                              }

                         } else if (typeof object[k] == "object") {
                              if (read) return this.readLevelIndex(object[k], data, index);
                              else this.readLevelIndex(object[k], data, index);
                         } else {

                         }
                    }
               }
          }

          return read ? _level : object;
     }

     integrate() {
          return this.getMod("service.integrate.json", true);
     }


}