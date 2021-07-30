import React from "react";


const FooterWrapper = (props) => 
{
    return (
        <section 
            className = { `${props.classes ? props.classes : ""}` }
            style = {{
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#bbb"
            }}
        >
            { props.children }
        </section>
    );
} 

export default FooterWrapper;