
import { Number, cF, String, O } from "changy";
import ChangyDom, { Element } from "changy-dom";

const numberToPixel : ((number : Number) => String<any>) = cF((number => number + "px"), String);
const transformOrigin : ((x : Number, y : Number) => String<any>) = cF(
    (x, y) => `${x}px ${y}px`
, String);
const transform : ((x : Number, y : Number, zoom : Number) => String<any>) = cF(
    (x, y, zoom) => `translate(50%, 50%) translate(${-x}px, ${-y}px) scale(${zoom})`
, String);

function DragScroll({cam:{x = new Number(0), y = new Number(0), zoom = new Number(1), zoomAmount = new Number(0)}, element} : {cam:{x : Number, y : Number, zoom : Number, zoomAmount : Number}, element : Element}) {
    let isMousePressed = false;
    return (
        <div style={{width:"100%", height:"100%", position:"relative", overflow:"hidden"}}
        onmousedown={() => {
            isMousePressed = true;
        }}
        onmouseup={() => {
            isMousePressed = false;
        }}
        onmouseleave={() => {
            isMousePressed = false;
        }}
        onmousemove={(e : MouseEvent) => {
            if(isMousePressed) {
                x.set(x[O] - e.movementX/zoom[O]);
                y.set(y[O] - e.movementY/zoom[O]);
            }
        }}
        onwheel={(e : WheelEvent) => {
            const boundingClientRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const zoomMultiplier = zoomAmount[O]**(-e.deltaY);

            // compute
            const mouseX = (e.clientX - boundingClientRect.width/2) / (zoom[O] * zoomMultiplier);
            const mouseY = (e.clientY - boundingClientRect.height/2) / (zoom[O] * zoomMultiplier);

            const camPosMoveMultiplier = zoomMultiplier - 1//zoomMultiplier * (zoomMultiplier - 1);
            const camXMove = camPosMoveMultiplier * mouseX;
            const camYMove = camPosMoveMultiplier * mouseY;

            zoom.set(zoom[O] * zoomMultiplier);
            x.set(x[O] + camXMove);
            y.set(y[O] + camYMove);
        }}
        >
            <div style={{
                height:"100%",
                width:"100%",
                position:"absolute",
                transformOrigin: transformOrigin(x, y),
                transform:transform(x, y, zoom)
            }}>
                {
                    element
                }
            </div>
        </div>
    );
}

export default DragScroll;