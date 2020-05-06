
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
        <div>
            <pre>
            {`ㅎㅇㅎㅇ 슈발?
            asdf
            adv
            asdv
            asdfvas
            divasd
            divasdvc
            ac
            vjp
            woeeojvqve
            pojvfejop

            qvjeqvjooj
            geq
            ipoj`}
            </pre>
        </div>
    );
}

document.body.appendChild((<Main/>)[O]);