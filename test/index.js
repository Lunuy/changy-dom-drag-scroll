
import ChangyDom from "changy-dom";
import { Number, O } from "changy";
import { DragScroll } from "../dist/index";

function Main() {
    return (
        <div style={{width: "100%", height:"100%"}}>
            <DragScroll element={<Content/>} cam={{zoomAmount: new Number(1.2)}}/>
        </div>
    );
}

function Content() {
    return (
        <div style={{backgroundColor: "skyblue", display: "inline-block", width:"600px"}}>
            <p style={{userSelect: "none", fontSize: "calc(max(13px, 60px - 5vw))"}}>
                안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요
            </p>
        </div>
    );
}

document.body.appendChild((<Main/>)[O]);