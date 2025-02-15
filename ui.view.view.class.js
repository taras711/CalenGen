class View {

    constructor() {
        this.main = null;
        this.currentFragment = null;
        this.ui = {
            getComponent: {}
        }
        this.paramPath = "ui.view.params.json"
    }

    addModule(module, type) {
        switch (type) {
            case "script":
                var script = document.createElement('script');
                script.src = module;

                document.head.appendChild(script);
                break;
            case "style":
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = module;

                document.head.appendChild(link);
                break;
        }
    }

    appLay(config = {}) {
        let set = Object.assign({
            width: 1,
            height: 1,
            name: "main",
            type: "linear",
            option: "fillxy,vcenter",
        }, config);

        this.main = ui.addLayout(set.name, set.type, set.option, set.width, set.height);
        
        return this.ui.main = this.main;
    }

    appDrawer(config = {}, callback = function () {}) {
        let set = Object.assign({
            width: 0.7,
            position: "left",
            header: false,
            headerObj: "",
            menuList: [],
            menuOption: "Icon",
            menuLabel: false
        }, config);
        let drLay = ui.addLayout(null, "Linear", "VCenter", 1);
        this.ui.drawer = ui.addDrawer(drLay, set.position, set.width);
        this.ui.drawerMenu = ui.addList(drLay, set.menuList, set.menuOption ? set.menuOption : null, 1);
        this.ui.drawerMenu.label = set.menuLabel ? set.menuLabel : null;
        this.ui.drawerMenu.setOnTouch(callback);
        ui.addDivider(drLay, 1);
        return this.ui.drawer;

    }

    appBar(config = {}) {
        let set = Object.assign({
            width: 1,
            title: "",
            menu: "Menu,Primary",
            list: [],
            subFragment: false,
            subFragmentClass: false
        }, config);

        let icons = ["menu", "arrow_back"];
        let action = null, appBarIcon, _this = this;

        if(this.ui.appbar == null){
            this.ui.appbar = ui.addAppBar(this.main, set.title, set.menu ? set.menu : "", set.width);

            this.implementStyle((this.queryComponent(this.ui.appbar)).firstElementChild, {"box-shadow": "none"});
            this.implementParameters(this.ui.appbar, this.queryComponent(this.ui.appbar).id);
        }

        let appbar = this.ui.appbar;

        if(set.subFragment) {
            appBarIcon = this.queryComponent(appbar).querySelector(".material-icons");
            if(set.subFragmentClass) this.queryComponent(appbar).classList.add(".sub-appbar")
            appBarIcon.innerHTML = icons[1];
            action = function(){ _this.switchFragment(_this.prewFragment) }
        }else{
            appBarIcon = this.queryComponent(appbar).querySelector(".material-icons");
            this.queryComponent(appbar).classList.add(".sub-appbar")
            appBarIcon.innerHTML = icons[0];
            action = function(){ drawer.show() }
        }

        appbar.setOnMenu(action);

        return appbar;

    }

    switchFragment( fragment ) {
        let _cf = this.currentFragment;
        let _sf = false;
        
        this.prewFragment = this.currentFragment;
        
        if(typeof fragment !== "object") return false;

        if(_cf !== null) {
            this.currentFragment.hide()
        }
        this.currentFragment = fragment;
        
        if(fragment.index > 0) _sf = true;
        else _sf = false;
        
        this.appBar({subFragment: _sf});
        
        fragment.show();
    }

    animated( object ){
        if(typeof object !== 'object') return false;
        this.queryComponent(object).classList.add('.slideInLeft');
    }

    createComponent(name, parameters = {}) {
        let _res = Object.assign({
            name: name,
            id: "comp_" + Math.random() * (950 - 100) + 100,
            class: "",
            attributes: {},
            parent: "body",
            parentType: "selector"
        }, parameters);

        return this.render(_res);
    }

    queryComponent( object = {}) {
        if( typeof object == 'object'){
            return object?._div ?? object._div;
        }
        return null;
    }

    implementStyle( object, styles = {} ) {

        let _render = function(){
            let output = "";
            for(let st in styles){
                output += `${Object.keys(styles)}: ${styles[st]};`;
            }
            return output;
        }

        if(object instanceof HTMLElement){
            object.setAttribute("style", _render());
        }else if(this.queryComponent(object) instanceof HTMLElement){
            object.setAttribute("style", _render());
        }else{
            return false;
        }
    }

    implementParameters( object, id ) {
        let _paramPath = this.paramPath;
        let paramsFile = function(){
            if(!app.FileExists(_paramPath)){ 
                if(app.CreateFile(_paramPath, "rw")) app.WriteFile(_paramPath, "{}");
            }

            return JSON.parse(app.ReadFile(_paramPath));
        }

        let paramsRender = function(){
            let _values = "";
            let _paramsFile = paramsFile();
            for (let key in _paramsFile) {
                if (_paramsFile.hasOwnProperty(key)) {
                    if(key == id){
                        let keys = Object.keys(_paramsFile[key]);
                        for(let i = 0; i < keys.length; i++){
                            
                            if (keys[i].indexOf("#") == -1) {
                                if(typeof object[keys[i]] == "function"){
                                    
                                    object[keys[i]].apply(object, _paramsFile[key][keys[i]]);
                                }else{
                                    object[keys[i]] = _paramsFile[key][keys[i]].toString();
                                }
                            }
                        }
                    }
                }
            }
        }
        
        paramsRender();

    }

    render(obj) {
        if (typeof obj !== 'object') return false;
        let attr = {}

        var createElement = function (type, props) {
            var $e = document.createElement(type);

            for (var prop in props) {
                $e.setAttribute(prop, props[prop]);
            }

            return $e;
        }

        Object.keys(obj.attributes).forEach(function (key, index) {
            attr[key] = obj.attributes[key];
        });

        let elem = createElement(obj.name, {
            id: obj.id,
            class: obj.class ? obj.class : "",
            ...attr
        });

        obj.content ? elem.innerHTML = obj.content : null;

        if (obj.parent) {
            switch (obj.parentType) {
                case "object":
                    obj.parent.appendChild(elem);
                    break;
                case "object":
                    document.querySelector(obj.parent).appendChild(elem);
                    break;
                default:
                    document.querySelector(obj.parent).appendChild(elem);
                    break;
            }
        }
        obj.parent ? obj.parent.appendChild(elem) : null;

        return this.ui.getComponent[obj.id] = elem;
    }
}