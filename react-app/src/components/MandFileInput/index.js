export default function MandFileInput( {edit, url, image, upload} )
{
    if(!edit)
    {
        return(
        <p className = "bus_form_upload_icon_wrapper">
            <i className={image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
        </p>
        )
    }
    if(url)
    {
        return(
            <p className="image_and_delete_button">
                <i className = {image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
                <img alt="preview" className={ image ? "form_images hidden" : "form_images"} src={url}></img>
            </p>
        )
    }else{
        //should always be a url for a mandatory image when editing
        //but it is lost on refresh
        return (
            <p className="image_and_delete_button">
                <i className="fa-solid fa-upload" onClick = {upload}></i>
            </p>
        )
    }
}
