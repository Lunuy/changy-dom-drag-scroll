
import { Number, cF, String, O } from "changy";
import ChangyDom, { Element } from "changy-dom";

const transformOrigin : ((x : Number, y : Number) => String<any>) = cF(
    (x, y) => `${x}px ${y}px`
, String);
const transform : ((x : Number, y : Number, zoom : Number) => String<any>) = cF(
    (x, y, zoom) => `translate(50%, 50%) translate(${-x}px, ${-y}px) scale(${zoom})`
, String);

function getPos([clientX,clientY]: [number, number], boundingClientRect : ClientRect, cam : Cam) {
    return [
        cam.x[O] + (clientX - boundingClientRect.width/2)/cam.zoom[O],
        cam.y[O] + (clientY - boundingClientRect.height/2)/cam.zoom[O]
    ];
}


export interface Cam {
    x : Number,
    y : Number,
    zoom : Number,
    zoomAmount : Number,
    touchpadZoomAmount : Number
};

function DragScroll({
    cam:{
        x = new Number(0),
        y = new Number(0),
        zoom = new Number(1),
        zoomAmount = new Number(0),
        touchpadZoomAmount = new Number(1.03)
    },
    element
} : {cam:{[K in keyof Cam]?:Cam[K]}, element : Element}) {
    const cam : Cam = { x, y, zoom, zoomAmount, touchpadZoomAmount };
    let isMousePressed = false;
    let touches : TouchList = [] as any;
    return (
        <div style={{width:"100%", height:"100%", position:"relative", overflow:"hidden"}}

        // Mouse
        onmousedown={e => {
            e.preventDefault();
            isMousePressed = true;
        }}
        onmouseup={e => {
            e.preventDefault();
            isMousePressed = false;
        }}
        onmouseleave={e => {
            e.preventDefault();
            isMousePressed = false;
        }}
        onmousemove={(e : MouseEvent) => {
            e.preventDefault();
            if(isMousePressed) {
                x.set(x[O] - e.movementX/zoom[O]);
                y.set(y[O] - e.movementY/zoom[O]);
            }
        }}
        onwheel={(e : WheelEvent) => {
            e.preventDefault();
            const boundingClientRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const zoomMultiplier = (
                e.ctrlKey ?
                    touchpadZoomAmount[O]**-e.deltaY
                :
                    zoomAmount[O]**-((e.deltaY > 0) ? 1 : -1)
            );

            // compute
            const mousePos = [
                (e.clientX - boundingClientRect.width/2) / (zoom[O]*zoomMultiplier),
                (e.clientY - boundingClientRect.height/2) / (zoom[O]*zoomMultiplier)
            ];

            const camPosMoveMultiplier = zoomMultiplier - 1;
            const camXMove = camPosMoveMultiplier * mousePos[0];
            const camYMove = camPosMoveMultiplier * mousePos[1];

            zoom.set(zoom[O] * zoomMultiplier);
            x.set(x[O] + camXMove);
            y.set(y[O] + camYMove);
        }}

        // Touch
        ontouchstart={(e : TouchEvent) => {
            e.preventDefault();
            touches = e.touches;
            //touches.push(e.touches);
        }}
        ontouchend={(e: TouchEvent) => {
            e.preventDefault();
            touches = e.touches;
        }}
        ontouchmove={(e : TouchEvent) => {
            e.preventDefault();
            if(touches[1]) { //ZOOM
                const boundingClientRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const changedTouches = new Array(2).fill(null).map(
                    (v, index) => Array.from(e.changedTouches).find(touch => touch.identifier === touches[index].identifier) ?? touches[index]
                );

                // zoom
                const lastTouch0Pos = getPos([touches[0].clientX, touches[0].clientY], boundingClientRect, cam);
                const lastTouch1Pos = getPos([touches[1].clientX, touches[1].clientY], boundingClientRect, cam);
                const lastWidth = lastTouch1Pos[0] - lastTouch0Pos[0]; //client Coordinate
                const lastHeight = lastTouch1Pos[1] - lastTouch0Pos[1];
                const lastR = Math.sqrt((lastWidth)**2 + (lastHeight)**2);

                // zoom
                const touch0MovedX = (changedTouches[0].clientX - touches[0].clientX)/zoom[O];
                const touch0MovedY = (changedTouches[0].clientY - touches[0].clientY)/zoom[O];
                const touch1MovedX = (changedTouches[1].clientX - touches[1].clientX)/zoom[O];
                const touch1MovedY = (changedTouches[1].clientY - touches[1].clientY)/zoom[O];
                const displayWidth = lastWidth - touch0MovedX + touch1MovedX; // Depend on NOT CHANGED ZOOM.
                const displayHeight = lastHeight - touch0MovedY + touch1MovedY;
                const r = Math.sqrt(displayWidth**2 + displayHeight**2);
                const zoomMultiplier = r / lastR;

                // move
                const touch0Pos = getPos([changedTouches[0].clientX, changedTouches[0].clientY], boundingClientRect, {...cam, zoom: new Number(zoom[O]*zoomMultiplier)});
                const touch1Pos = getPos([changedTouches[1].clientX, changedTouches[1].clientY], boundingClientRect, {...cam, zoom: new Number(zoom[O]*zoomMultiplier)});
                const camX = x[O] + ((lastTouch0Pos[0] - touch0Pos[0]) + (lastTouch1Pos[0] - touch1Pos[0]))/2;
                const camY = y[O] + ((lastTouch0Pos[1] - touch0Pos[1]) + (lastTouch1Pos[1] - touch1Pos[1]))/2;

                zoom.set(zoom[O] * zoomMultiplier);
                x.set(camX);
                y.set(camY);
            } else { //MOVE
                const lastTouch = touches[0];
                const changedTouch = e.changedTouches[0];
                if(touches[0].identifier === changedTouch.identifier) {
                    x.set(x[O] - (changedTouch.clientX - lastTouch.clientX)/zoom[O]);
                    y.set(y[O] - (changedTouch.clientY - lastTouch.clientY)/zoom[O]);
                }
            }
            touches = e.touches;
        }}
        >
            <div style={{
                height:"100%",
                width:"100%",
                position:"absolute",
                transformOrigin: transformOrigin(x, y),
                transform: transform(x, y, zoom)
            }}>
                {
                    element
                }
            </div>
        </div>
    );
}

export default DragScroll;