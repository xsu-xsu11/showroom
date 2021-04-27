var customScroll = {
    aConts  : [],
    mouseY : 0,
    N  : 0,
    asd : 0, /*active scrollbar element*/
    sc : 0,
    sp : 0,
    to : 0,
    scrollbarAll: function (cont_class) {
        const cont = document.querySelectorAll(cont_class);
        cont.forEach((item) => this.scrollbar(item));
    },
    // constructor
    scrollbar : function (cont) {
        // perform initialization
        if (! customScroll.init()) return false;
        var cont_wrap = cont.cloneNode(false);
        cont_wrap.className ='scroll-wrap';
        cont_wrap.style.display="none";
        cont_wrap.style.position='relative';
        
        cont.parentNode.appendChild(cont_wrap);
        cont_wrap.appendChild(cont);
        cont.style.position = 'absolute';
        cont.style.left = '0';
        cont.style.width = '100%';
        // adding new container into array
        customScroll.aConts[customScroll.N++] = cont;
        cont.sg = false;
        //creating scrollbar child elements
        cont.st = this.create_div('customScroll_st', cont, cont_wrap);
        cont.sb = this.create_div('customScroll_sb', cont, cont_wrap);
        cont.su = this.create_div('customScroll_up', cont, cont_wrap);
        cont.sd = this.create_div('customScroll_down', cont, cont_wrap);
        // cont.st.style.display='none';
        // cont.sb.style.display='none';

        // on mouse down processing
        cont.sb.onmousedown = function (e) {
            if (! this.cont.sg) {
                if (! e) e = window.event;
                customScroll.asd = this.cont;
                this.cont.yZ = e.screenY;
                this.cont.sZ = cont.scrollTop;
                this.cont.sg = true;
                // new class name
                this.className = 'customScroll_sb customScroll_sb_down';
            }
            return false;
        }
        // on mouse down on free track area - move our scroll element too
        cont.st.onmousedown = function (e) {
            if (! e) e = window.event;
            customScroll.asd = this.cont;
            customScroll.mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            for (var o = this.cont, y = 0; o != null; o = o.offsetParent) y += o.offsetTop;
            this.cont.scrollTop = (customScroll.mouseY - y - (this.cont.ratio * this.cont.offsetHeight / 2) - this.cont.sw) / this.cont.ratio;
            this.cont.sb.onmousedown(e);
        }
        // onmousedown events
        cont.su.onmousedown = cont.su.ondblclick = function (e) { customScroll.mousedown(this, -1); return false; }
        cont.sd.onmousedown = cont.sd.ondblclick = function (e) { customScroll.mousedown(this,  1); return false; }
        //onmouseout events
        cont.su.onmouseout = cont.su.onmouseup = customScroll.clear;
        cont.sd.onmouseout = cont.sd.onmouseup = customScroll.clear;
        // on mouse over - apply custom class name: customScroll_sb_over
        cont.sb.onmouseover = function (e) {
            if (! this.cont.sg) this.className = 'customScroll_sb customScroll_sb_over';
            return false;
        }
        // on mouse out - revert back our usual class name 'customScroll_sb'
        cont.sb.onmouseout  = function (e) {
            if (! this.cont.sg) this.className = 'customScroll_sb';
            return false;
        }
        // onscroll - change positions of scroll element
        cont.customScroll_onscroll = function () {
            this.ratio = (this.offsetHeight - 2 * 10) / this.scrollHeight;
            this.sb.style.top = Math.floor(10 + this.scrollTop * this.ratio) + 'px';
        }
        // scrollbar width
        cont.sw = 2;
        // start scrolling
        cont.customScroll_onscroll();
        customScroll.refresh();
        // binding own onscroll event
        cont.onscroll = cont.customScroll_onscroll;
        return cont;
    },
    // initialization
    init : function () {
        if (window.oper || (! window.addEventListener && ! window.attachEvent)) { return false; }
        // temp inner function for event registration
        function addEvent (o, e, f) {
            if (window.addEventListener) { o.addEventListener(e, f, false); customScroll.w3c = true; return true; }
            if (window.attachEvent) return o.attachEvent('on' + e, f);
            return false;
        }
        // binding events
        addEvent(window.document, 'mousemove', customScroll.onmousemove);
        addEvent(window.document, 'mouseup', customScroll.onmouseup);
        addEvent(window, 'resize', customScroll.refresh);
        return true;
    },
    // create and append div finc
    create_div : function(c, cont, cont_clone) {
        var o = document.createElement('div');
        o.cont = cont;
        o.className = c;
        cont_clone.appendChild(o);
        return o;
    },
    // do clear of controls
    clear : function () {
        clearTimeout(customScroll.to);
        customScroll.sc = 0;
        return false;
    },
    // refresh scrollbar
    refresh : function () {
        for (var i = 0, N = customScroll.N; i < N; i++) {
            var o = customScroll.aConts[i];
            o.customScroll_onscroll();
            o.sb.style.width = o.st.style.width = o.su.style.width = o.sd.style.width = o.sw + 'px';
            o.su.style.height = o.sd.style.height = '10px';
            o.sb.style.height = Math.ceil(Math.max(o.sw * .5, o.ratio * o.offsetHeight) + 1) + 'px';
        }
    },
    // arrow scrolling
    arrow_scroll : function () {
        if (customScroll.sc != 0) {
            customScroll.asd.scrollTop += 6 * customScroll.sc / customScroll.asd.ratio;
            customScroll.to = setTimeout(customScroll.arrow_scroll, customScroll.sp);
            customScroll.sp = 32;
        }
    },
    /* event binded functions : */
    // scroll on mouse down
    mousedown : function (o, s) {
        if (customScroll.sc == 0) {
            // new class name
            o.cont.sb.className = 'customScroll_sb customScroll_sb_down';
            customScroll.asd = o.cont;
            customScroll.sc = s;
            customScroll.sp = 400;
            customScroll.arrow_scroll();
        }
    },
    // on mouseMove binded event
    onmousemove : function(e) {
        if (! e) e = window.event;
        // get vertical mouse position
        customScroll.mouseY = e.screenY;
        if (customScroll.asd.sg) customScroll.asd.scrollTop = customScroll.asd.sZ + (customScroll.mouseY - customScroll.asd.yZ) / customScroll.asd.ratio;
    },
    // on mouseUp binded event
    onmouseup : function (e) {
        if (! e) e = window.event;
        var tg = (e.target) ? e.target : e.srcElement;
        if (customScroll.asd && document.releaseCapture) customScroll.asd.releaseCapture();
        // new class name
        if (customScroll.asd) customScroll.asd.sb.className = (tg.className.indexOf('scrollbar') > 0) ? 'customScroll_sb customScroll_sb_over' : 'customScroll_sb';
        document.onselectstart = '';
        customScroll.clear();
        customScroll.asd.sg = false;
    }
}
// window.onload = function() {
//     customScroll.scrollbarAll('.service__form'); // scrollbar initialization
//     viewActionList();
//     customScroll.refresh();
// }