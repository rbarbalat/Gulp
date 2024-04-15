export default function RevFileInput( {url, image, upload, deleteImage, num} )
{
    if(url)
    {
        return(
            <div className="rev_image_and_delete_button">
                <i className={image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
                <i className={image ? "fa-solid fa-trash hidden" : "fa-solid fa-trash"} onClick={() => deleteImage(num)}></i>
                <img alt={"optional " + num} className={ image ? "rev_form_images hidden" : "rev_form_images"} src={url} />
            </div>
        )
    }
    else
    {
        return (
            <div className = "rev_form_upload_icon_wrapper">
                <i className={image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
            </div>
        )
    }
}
