/**
 * Service for ARAS soft
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

class Service {


   constructor() {

   }

   getMod(path, json = false) { // function indentifier #1245
      if (app.FileExists(path)) {
         if (json) return JSON.parse(app.ReadFile(path));
         else return app.ReadFile(path);
      }

      return "ASS_1245";
   }

   integrate() {
      return this.getMod("Service/integrate.json", true);
   }
}