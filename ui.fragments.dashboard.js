class Dashboard extends AppObject {
    constructor( main )
    {
        super()
        this.main = main
        this.lay = null
        this.cal = null
        this.h_section
        this.dividerBlock
        this.index = 0

    }

    show( animate )
    {
        //If layout not created yet.
        if( !this.lay )
        {
            this.lay = ui.addLayout( this.main, "linear", "fillxy,top" )
            
            let lay = this.lay, d = new Date();

            this.header();
            
            // let text = view.createComponent("h1", {
            //     id: "MyId",
            //     content: "<span>My Text</span>",
            //     parent: view.queryComponent(lay),
            //     parentType: "object",
            //     attributes: {
            //         style: "border-bottom: 2px solid green;",
            //         "data-action": true
            //     }
            // });
            this.calendarBlock = ui.addLayout(this.lay, "linear", "fillx, hcenter, top");
           // alert(view.queryComponent(this.calendarBlock).id)
            try{
                let cal = this.cal = new Cal({ block: view.queryComponent(this.calendarBlock) });
                let h_title = this.h_title;
                let h_desc = this.h_desc;
                let slpos = 1;
            h_title.text = d.getDate();
            h_desc.text = `${this.cal.Months[cal.currMonth]} ${this.cal.currYear}`;
            cal.init()
            let slider = verticalSlider(".slider", {activeSlider: 1});
            $(".slider").on("onSlideFinish", function(e, i){
            
                let slideId = i.slideId;
                let dy = $(this).children().eq(slideId).data("year");
                let dt = $(this).children().eq(slideId).data("month")
                if(dy == cal.minYear && dt == 0 && i.moveY < 0){
                    $(this).addClass("finish-in");
                    h_desc.text = `${cal.Months[0]} ${cal.currYear}`;
                    cal.currMonth = 0
                return false;
                }else if(dy == cal.maxYear && dt == 11 && i.moveY > 0){
                    $(this).addClass("finish-out")
                    h_desc.text = `${cal.Months[11]} ${cal.currYear}`;
                    cal.currMonth = 9;
                return false;
                }else{
                $(this).removeClass("finish-out").removeClass("finish-in");
                slider.deactivate();
                cal.setMonth(dt, dy, i.position);
                slider = verticalSlider(".slider", {activeSlider: slpos});
                h_desc.text = `${cal.Months[dt]} ${cal.currYear}`;
                }
              })
            }catch(e){
                alert(e)
            }
            //calendar.block = view.queryComponent(this.calendarBlock);
           // calendar.init();
           // view.implementStyle(text, {background:"blue"});
            //calendar.action(function(dd){
                //dd = dd.split("-")
                //$("#d9 span").text(dd[0])
                //$("#d10 span").text(`${calendar.arr.longMonth[dd[1]]} ${dd[2]}`);
                //calendar.nextMonth()
            //});
            
            /*window.onload = function () {
  
  var c = new Cal({ block: ".w-calendar" });
    let slider = $(".slider").verticalSlider({
    activeSlider: 1
  });

  $(".slider").on("onSlideFinish", function(e, i){
    let slideId = i.slideId;
    alert($(".slider").children().eq(slideId).data("month"))
  })
}*/
            
        }
        
        //Show the page.
        this.lay.show();
    }

    header( title, description ) {
        //let _divider = this.divider();
        
            if(!this.h_section){
                  this.h_section = ui.addLayout(this.lay, "linear", "fillxy, left, bottom");
                  view.implementParameters(this.h_section, view.queryComponent(this.h_section).id);
                  
            }
            if(!this.dividerBlock){
                  this.dividerBlock = ui.addLayout(this.h_section, "linear", "fillxy, hcenter, left", 1);
                  view.implementParameters(this.dividerBlock, view.queryComponent(this.dividerBlock).id);
                  
           }
           
           
        this.h_title = ui.addText(this.dividerBlock, title ?? "", "H3"); //d9
        this.h_desc = ui.addText(this.dividerBlock, description ?? "", "Multiline, body1"); //d10

        if(!this.div) this.div = $(view.queryComponent(this.h_section)).append(this.divider);

        
    }

    divider( options ) {
        let set = Object.assign({
            colors: [ "#f461c1", "#4579e2", "#3461c1", "white"],
            y: [3, 0, 9, 6],
            x: [50, 50, 50, 50]
        }, options);
        
        let g = "";

        for(let i = 0; i < set.colors.length; i++){
            g += `<g class="wave-parallax${i+1}"><use xlink:href="#gentle-wave" x="${set.x[i]}" y="${set.y[i]}" fill="${set.colors[i]}"/></g>`
        }

        let _dividerContainer = $("<div />", { class: "mheader" });

        let _divLay = `<svg class="wave-divider" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
                            <defs>
                                <path id="gentle-wave"
                                    d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                            </defs>
                            %g%
                        </svg>`;
        
        $(_dividerContainer).html(_divLay.replaceAll("%g%", g));
        
        return _dividerContainer;
    }

    hide()
    {
        if( this.lay ) this.lay.hide()
    }
}
