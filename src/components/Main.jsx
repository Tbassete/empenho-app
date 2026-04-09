import { Outlet } from "react-router-dom";

function Main(){
    return(
        <div className="container-main">
             <Outlet />   
        </div>
    )
}

export default Main;