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
    return (
        <p>
        {
            url &&
            <p className="image_and_delete_button">
                <i className = {image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
                <img alt="preview" className={ image ? "form_images hidden" : "form_images"} src={url}></img>
            </p>
        }
        {
            !url && //page refresh
            <p className="image_and_delete_button">
                <i className="fa-solid fa-upload" onClick = {upload}></i>
            </p>
        }
        </p>
    )
}
