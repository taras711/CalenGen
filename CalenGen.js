include("service.integrate.js"); // include classes
// Force this app to portrait mode.
cfg.Portrait;
// Main class for the app
class Main extends App
{
    // Called when app starts.
    onStart()
    {

        // Main layout
        view.implementParameters(layMain, view.queryComponent(layMain).id);
        
        // Add pages
        view.pages = [
            this.dashBoard = new Dashboard(layMain), // Dashboard
            this.settings = new Settings(layMain) // Settings
        ]
        
        // Set default page
        view.switchFragment(view.pages[0]);
    }
}