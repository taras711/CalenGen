/**
 * Controller for ARAS soft
 * Copyright (C) 2025 ARAS
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Author: Taras Kerest <kerest73@gmail.com>
 * Version: 1.0
 * Last modified: 2024-07-31
 */

const service = new Service();
const integrate = service.integrate();
const view = new View();

app.Script(integrate.Ui.Fragments.settings);
app.Script(integrate.Ui.Fragments.dashboard);

view.addModule(integrate.Modules.qr, "script");
view.addModule(integrate.Modules.slider, "script")
view.addModule(integrate.Design.app, "style");
view.addModule(integrate.Design.fonts, "style");
let layMain = view.appLay();
let appBar = view.appBar(layMain);
let drawer = view.appDrawer(layMain);

view.implementParameters(view.ui.drawerMenu, view.queryComponent(view.ui.drawerMenu).id);

view.ui.drawerMenu.setOnTouch(menu)

function menu(title, i, value, e ) {
    view.switchFragment(view.pages[e]);
    view.ui.drawer.hide();
}
