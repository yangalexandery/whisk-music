import * as React from "react";

export class FileSelector extends React.Component<undefined, undefined>
{
    constructor(props: any)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectorFiles: FileList)
    {
        console.log(selectorFiles[0]);
        var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          console.log(reader.result);
        };
        reader.readAsText(selectorFiles[0]);
    }

    render ()
    {
        return <div>
            <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
        </div>;
    }
}