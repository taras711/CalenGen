//Class to create/show the Settings page
class Settings extends AppObject
{
    constructor( main )
    {
        super()
        this.main = main
        this.lay = null
        this.index = 1
    }

    show()
    {
        //If layout not created yet.
        if( !this.lay )
        {
            //Create the layout.
            this.lay = ui.addLayout( this.main, "linear", "fillxy,vcenter" )
            this.lay.setChildMargins( .05, .05, .05, .05 )

            //Add some text.
            var s = "This is your <strong>settings page</strong>."
            this.txtHome = ui.addText( this.lay, s, "Multiline,Html" )

            //Add a button with primary color.
            this.btnHello = ui.addButton( this.lay, "Hello Settings", "primary" )
            this.btnHello.setOnTouch( ()=>{ ui.showPopup("hi","bottom") } );
            
        }
        
        //Show the page.
        this.lay.show()
    }

    hide(){
        if( this.lay ) this.lay.hide()
    }
}