include("Service/service.class.js");
include("Ui/Modul/appbar.js");

const service = new Service();
const integrate = service.integrate();

let appBar = new Appbar(this.layMain);
appBar.onModul()