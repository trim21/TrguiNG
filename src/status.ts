import React from "react";

export class RunStatus {
    ide: boolean = true;
    title: string | undefined = "";
    content: string | undefined = "";

    constructor(ide: boolean = true, title : string | undefined = undefined, content : string | undefined = undefined){
        this.ide = ide
        this.title = title
        this.content = content
    }
}
