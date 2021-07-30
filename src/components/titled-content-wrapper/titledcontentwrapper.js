import React from "react";


const TitledContentWrapper = (props) => 
{
    return (
        <section 
            className = "p-0"
            style = {{
                borderColor: "#bbb",
                borderStyle: "solid",
                borderWidth: "1px"
            }}
        >
            <div    
                className = "bg-light px-3 py-2"
                style = {{
                    borderBottomColor: "#bbb",
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px"
                }}
            >
                <h6 className = "mb-0">{ props.title }</h6>
            </div>
            { props.children }
        </section>
    );
}

export default TitledContentWrapper;