/**
 * Vertical slider plugin for ARAS soft
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
 * Description: Vertical slider plugin
 */

/**
 * Initializes a vertical slider with customizable options and interactions.
 *
 * The slider allows for vertical transitions between slides with touch and 
 * autoplay functionalities. It supports responsive design and can switch to a 
 * horizontal mode on demand. Events are triggered at the start, during, and 
 * after slide transitions.
 *
 * @param {HTMLElement} slider - The DOM element representing the slider container.
 * @param {Object} options - Configuration options for the slider.
 * @param {string} [options.mode='vertical'] - The mode of the slider ('vertical' or 'horizontal').
 * @param {number} [options.activeSlider=0] - The index of the initially active slide.
 * @param {boolean} [options.autoPlay=false] - Whether the slider should auto-play.
 * @param {number} [options.autoPlayTime=3000] - The interval time for auto-playing in milliseconds.
 * @param {number} [options.maxSliderItems=5] - The maximum number of slider items.
 * @param {string} [options.transition='0.3s ease'] - The CSS transition style for slide changes.
 * @returns {Object} An object with methods to deactivate the slider and switch to horizontal mode.
 */

verticalSlider = function (slider, options) {
    var settings = $.extend({
      mode: 'vertical', // slider mode
      activeSlider: 0, // active slide
      autoPlay: false, // auto play
      autoPlayTime: 3000, // auto play time
      maxSliderItems: 5, // max slider items
      transition: '0.3s ease', // slide transition
    }, options);

    var $slider = $(slider); // Get the slider element
    var $slides = $slider.children().hasClass("active") ? $slider.children(".active") : $slider.children(".page"); // Get the slide elements
    var slideCount = $slides.length; // Get the number of slides
    var slideHeight = $slides.outerHeight(); // Get the height of a slide
    var slideWidth = $slides.outerWidth(); // Get the width of a slide
    var isDragging = false; // Check if the slider is being dragged
    var startY, currentY, translateY = 0, moveY = 0; // Variables for touch events
    var moveHandler = "touchmove"; // Touchmove event
    var startHandler = "touchstart"; // Touchstart event
    var endHandler = "touchend"; // Touchend event
    var time = false; // Check if the slider is being dragged
    var timeStart = 0; // Start time
    var timeEnd = 1800; // End time

    /**
    * Initializes the slider with its options and bindings.
    *
    * @description
    * Sets the slider's CSS styles and transitions, and binds events for touch and autoplay.
    * If autoplay is enabled, it starts immediately after the `autoPlayTime` interval.
    */
    function init() {

      // Set the slider styles
      $slider.css({
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        height: slideHeight
      });

      // Set the slide styles
      $slides.css({
        position: 'absolute',
        width: '100%',
        top: 0, 
        left: 0,
        transition: `transform ${settings.transition}`
      });

      // Set the active slide
      translateY = settings.activeSlider * slideHeight;

      // Update the slider
      updateSlider();

      // Auto play
      if (settings.autoPlay) {
        setInterval(autoPlay, settings.autoPlayTime);
      }

      // Bind events
      bindEvents();
    }

    /**
    * Updates the slider to reflect the currently active slide.
    *
    * This function removes the "active" class from all slides and adds it to the 
    * slide at the index specified by `settings.activeSlider`. It then adjusts the 
    * position of each slide to ensure the active slide is visible in the slider.
    * The transformation is applied to each slide to achieve a vertical sliding 
    * effect based on the current translation offset `translateY`.
    */
    function updateSlider() {

      // Remove the "active" class from all slides
      $slider.children().removeClass("active");
      
      // Add the "active" class to the current slide
      $slider.children().eq((settings.activeSlider) % slideCount).addClass("active");
      
      // Adjust the position of each slide
      $slides.each(function (index) {
        $(this).css('transform', 'translateY(' + (index * slideHeight - translateY) + 'px)');
      });
      
    }

    /**
    * Advances the slider to the next slide in the sequence.
    *
    * This function updates the `activeSlider` index to point to the next slide,
    * calculates the new translation offset `translateY`, and updates the slider's
    * visual state. It triggers the 'onSlideFinish' event after completing the slide
    * transition, providing the updated `activeSlider` index and `translateY` value.
    */
    function autoPlay() {
      // Advance to the next slide
      settings.activeSlider = (settings.activeSlider + 1) % slideCount;
      // Calculate the new translation offset
      translateY = settings.activeSlider * slideHeight;
      // Update the slider
      updateSlider();
      // Trigger the 'onSlideFinish' event
      triggerEvent('onSlideFinish', settings.activeSlider, translateY);
    }

    /**
    * Binds touch events to the slider for vertical dragging.
    *
    * Listens for touchstart, touchmove, and touchend events on the slider element.
    * On touchstart, it sets the initial position of the touch event and sets a flag
    * to indicate that the slider is being dragged. On touchmove, it updates the
    * position of the slider based on the delta of the touch event. On touchend, it
    * updates the active slide and triggers the 'onSlideFinish' event. It also
    * resets the flag and clears the timer.
    */
    function bindEvents() {
      // Handle touch events
      $slider.on(startHandler, function (e) { 
      e.preventDefault(); //prevent default behavior
      moveY = 0;
        // Handle touchstart event.
        isDragging = true; // Set the flag
        $slides.css("opacity", 1) // Show the slides
        startY = e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY; // Get the initial position
        triggerEvent('onSlideStart', settings.activeSlider, translateY); // Trigger the 'onSlideStart' event
        $('body').css('overflow', 'hidden'); // Stop scrolling 

      });

      // Handle touchmove event
      $slider.on(moveHandler, function (e) {
        if (isDragging) {
         time = true; // Set the flag
         timeStart += 500; // Set the start time
         
          // Update the position
          currentY = e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY;
          // Update the moveY and translateY
          moveY += (startY - currentY);
          translateY += startY - currentY;
          startY = currentY;

          // Update the active slide
          if (translateY < 0) {
            translateY = 0;
          } else if (translateY > (slideCount - 1) * slideHeight && translateY > moveY) {
            translateY = (slideCount - 1) * slideHeight; 
          }
          
          posY = translateY; // Get the current position

          updateSlider(); // Update the slider

          triggerEvent('onSlideMove', settings.activeSlider, translateY); // Trigger the 'onSlideMove' event
        }
      });

      // Handle touchend event
      $slider.on(endHandler, function () {
      isDragging = false; // Reset the flag
      
      settings.activeSlider = Math.round(translateY / slideHeight); // Update the active slide
      let activeSlide = $slider.children(".page").eq(settings.activeSlider); // Get the active slide
      slideHeight = activeSlide.height(); // Get the height of the active slide
      translateY = settings.activeSlider * slideHeight; // Calculate the new translation offset

      // Trigger the 'onSlideFinish' event
      if(time != false && timeStart >= timeEnd && (moveY >= 100|| moveY <= -100)){
      
        updateSlider();
        
        // Trigger the 'onSlideFinish' event
        triggerEvent('onSlideFinish', settings.activeSlider, translateY, moveY);
        $slider.css("height", slideHeight + 'px')
        $('body').css('overflow', ''); // Resume scrolling
           clearTime()
        }else{
           updateSlider();
           clearTime()
        }
        
      });
      
    }
    
    /**
     * Clears the timer that is used to track the time of the touch
     * events. This is used to determine whether to trigger the
     * 'onSlideFinish' event or not.
     */
    function clearTime(){
      time = false; // Reset the flag
      timeStart = 0; // Reset the start time
    }

    /**
     * Triggers a custom event on the slider element.
     *
     * @param {string} eventName - The name of the event to trigger.
     * @param {number} slideId - The index of the active slide.
     * @param {number} position - The translation offset of the slider.
     * @param {number} moveY - The amount of vertical movement.
     */
    function triggerEvent(eventName, slideId, position, moveY) {
      // Trigger the custom event
      $slider.trigger(eventName, { slideId: slideId, position: position, moveY });
    }

    /**
     * Deactivates the slider by removing its event listeners and resetting its
     * transformation offset.
     *
     * This function is useful when you want to temporarily disable the slider's
     * touch events, such as when you want to show another element on top of the
     * slider.
     */
    function deactivateSlider() {
      $slider.off(`${moveHandler} ${startHandler} ${endHandler}`); // Remove event listeners
      $slides.css('transform', 'translateY(0)'); // Reset the transformation
    }

    /**
     * Switches the slider to horizontal mode.
     *
     * This function sets the mode setting to 'horizontal', sets the
     * transition CSS property, and updates the slider by calling
     * updateSlider().
     */
    function switchToHorizontal() {
      settings.mode = 'horizontal'; // Set the mode

      // Set the transition CSS property
      $slides.css({
        transition: settings.transition,
        width: slideWidth,
        height: 'auto'
      });

      updateSlider(); // Update the slider
    }

    /**
    * Adjusts the slider dimensions when the window is resized.
    *
    * This function binds a resize event listener to the window, recalculating
    * the slide height and width whenever the window size changes. It then
    * updates the slider to ensure the current slide remains properly aligned
    * and visible.
    */
    function makeResponsive() {
      // Update the slider dimensions
      $(window).resize(function () {
        slideHeight = $slides.outerHeight(); // Get the height of the slides
        slideWidth = $slides.outerWidth(); // Get the width of the slides
        updateSlider(); // Update the slider
      });
    }

    init(); // Initialize the slider
    makeResponsive(); // Make the slider responsive

    // Return an object with the deactivate and switchToHorizontal methods
    return {
      deactivate: deactivateSlider, // Deactivate the slider
      switchToHorizontal: switchToHorizontal // Switch to horizontal mode
    };
  };