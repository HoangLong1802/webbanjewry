import axios from "axios";
import React from "react";
import MyContext from "../contexts/MyContext";

class footer extends Comment {
    static contextType = MyContext;
    constructor(props){
        super(props);
        this.state = {
            contactName:"",
            url:"",
        };
    }
    render(){
        const cates = this.state.contactName.map((item)=>{
            return(
                
            )
        })
    }
}