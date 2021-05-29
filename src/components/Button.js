import React,{ useState } from "react";

export default function Button({ getPais, children }){

    const handleClick = () => {
        const pais = children;
        getPais(pais);
    }

    return(
        <div>
            <button type="button" className="btn btn-info btn-lg" onClick={handleClick}>{children}</button>
        </div>
    );
}