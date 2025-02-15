class Appbar{

    constructor( main ){
        this.main = main;
    }

    config( parameters = {} ){
        return Object.assign({
            width: 1,
            title: "Main",
            menu: "Menu,Primary",
            list: [],
        }, parameters);
    }

    onModul(){
        let config = this.config();
        this.apb = ui.addAppBar(this.main, config.title, config.menu ? config.menu : "", config.width)

    }
}